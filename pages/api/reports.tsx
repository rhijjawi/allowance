import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_SUPABASE_SECRET_KEY!);
const handler = async (req: NextApiRequest, res: NextApiResponse ) => {
    switch (req.method) {
      case "POST":
        return await POST(req, res);
      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };

async function POST(req: NextApiRequest, res: NextApiResponse ){
  const {userId} = req.body.userId ? req.body : getAuth(req)
  if (!userId) {return res.status(401).json({error : "Unauthenticated"})}
  const {data, error} = await supabase.from('reports').select('forchild, uuid, date_range').order("created_at", {ascending : false}).eq("parent_id", userId)
  if (error){
    return res.status(500).json({data : error});
  }
  else if (data){
    return res.status(200).json({data : data});
  }
}
export default handler;