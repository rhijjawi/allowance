import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SECRET_KEY!,
);
const upsertRow = async (userId: string | null) => {
  let { data, error } = await supabase
    .from("oversight")
    .select("supervisors, unconfirmed")
    .eq("childId", userId);
  if (data && data[0]) {
    return { data, error };
  } else {
    return supabase
      .from("oversight")
      .upsert({ childId: userId, unconfirmed: [], supervisors: [] })
      .select("supervisors, unconfirmed");
  }
};
const insertRow = async (userId: string | null, supervisor: string) => {
  const { data } = await upsertRow(userId);
  if (
    data![0] &&
    (data![0].unconfirmed.indexOf(supervisor) != -1 ||
      data![0].supervisors.indexOf(supervisor) != -1)
  ) {
    return { data: data, error: "exists" };
  }
  return await supabase
    .from("oversight")
    .upsert({
      childId: userId,
      unconfirmed: [...data![0].unconfirmed, supervisor],
      supervisors: data![0].supervisors,
    })
    .select("supervisors, unconfirmed");
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return GET(req, res);
    case "POST":
      return POST(req, res);
    default:
      return res.status(405).send("Method not allowed");
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).send("Unauthorized");
  const { data, error } = await supabase
    .from("codes")
    .select("code")
    .eq("parentId", userId);
  if (error) return res.status(500).send("Internal Server Error");
  if (data.length === 0) return res.status(404).send("Not Found");
  const { code } = data![0];
  return res.status(200).send({ code });
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  const { code } = req.body;
  if (!userId) return res.status(401).send("Unauthorized");
  if (!code) return res.status(400).send("shite Request");
  const { data, error } = await supabase.from("codes").select("*").eq("code", code);
  if (error) return res.status(500).send("Internal Server Error");
  if (data.length === 0) return res.status(404).send("Not Found");
  const insertion = await insertRow(userId, data[0].parentId);
  if (insertion.error == "exists"){
    return res.status(400).json({error : "exists"});  
  }
  await axios.post("http://127.0.0.1:2999/pair_request", {reqUser : userId, parent: data[0].parentId})
  return res.status(200).send({ insertion });
}
