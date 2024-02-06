import { clerkClient } from "@clerk/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

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
    return { data: data, error: null };
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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    case "POST":
      return await POST(req, res);
    case "DELETE":
      return await DELETE(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const user = getAuth(req);
  const { userId } = user;
  if (!userId) return res.status(401).send("Unauthorized");
  if (user.sessionClaims.metadata!.role == "parent") {
    const { data, error } = await supabase
      .from("oversight")
      .select("childId")
      .or(`supervisors.cs.{${userId}}, unconfirmed.cs.{${userId}}`);
      const supervisorProfiles = await Promise.all(
        data!.map(async (supervisor: {childId : string}): Promise<any> => {
          try {
            return await clerkClient.users.getUser(supervisor.childId);
          } catch {
            return null;
          }
        }),
      );
    return res.status(200).send({ oversight: data, supervisorProfiles });
  }

  const { data, error } = await upsertRow(userId);
  if (error) {
    return res.status(500).json({ error });
  }
  if (data[0]) {
    const supervisorProfiles = await Promise.all(
      data[0].supervisors.map(async (supervisor: string): Promise<any> => {
        try {
          return await clerkClient.users.getUser(supervisor);
        } catch {
          return null;
        }
      }),
    );
    return res.status(200).json({ oversight: data[0], supervisorProfiles });
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).send("Unauthorized");
  const { supervisor } = req.body;
  if (!supervisor) {
    return res.status(400).send("shite request");
  }
  const { data, error } = await insertRow(userId, supervisor);
  if (error) {
    return res.status(500).json({ error });
  }
  return res.status(200).json({ oversight: data![0] });
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).send("Unauthorized");
  const { supervisor } = req.body;
  if (!supervisor) {
    return res.status(400).send("shite request");
  }
  const { data } = await upsertRow(userId);
  console.log(await upsertRow(userId));
  if (data![0].supervisors.indexOf(supervisor) !== -1) {
    const { data: data1, error: error1 } = await supabase
      .from("oversight")
      .upsert({
        childId: userId,
        supervisors: data![0].supervisors.filter(
          (sup: string) => sup !== supervisor,
        ),
        unconfirmed: data![0].unconfirmed,
      })
      .select();
    if (error1) {
      return res.status(500).json({ error: error1 });
    }
    return res.status(200).json({ oversight: data1![0] });
  } else {
    return res.status(304).json({ msg: "data unchanged" });
  }
}

export default handler;
