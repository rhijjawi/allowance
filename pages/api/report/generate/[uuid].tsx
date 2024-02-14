import { User, getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { clerkClient, } from "@clerk/nextjs";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_SUPABASE_SECRET_KEY!);
const handler = async (req: NextApiRequest, res: NextApiResponse ) => {
    switch (req.method) {
      case "GET":
        return await GET(req, res);
      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };

async function GET(req: NextApiRequest, res: NextApiResponse ){
    const {uuid} = req.query
    const {data, error} = await supabase.from('reports').select('parent_id, forchild, date_range').eq("uuid", uuid)
    let user = null;
    if ((data && data.length == 0)){
      return res.status(404).json({error : "Not Found"})
    }
    if (error){
      return res.status(500).json({error : error.message})
    }
    try{
      user = await clerkClient.users.getUser(data[0].parent_id)
      const expenses = await supabase.from('expenses').select("*").eq("user_id", data![0].forchild).gte("transaction_date", new Date(data[0].date_range[0]).toISOString()).lte("transaction_date", new Date(data[0].date_range[1]).toISOString())
      if (expenses.data && !expenses.error){
        return res.json({expenses : expenses.data, parent : user as User})
      }
      else {
        return res.json({error : expenses.error.message})
      }
    }
    catch (e){
      return res.status(500).send(e ? `${e}` : "Internal Server Error")
    }
    
}

export default handler;