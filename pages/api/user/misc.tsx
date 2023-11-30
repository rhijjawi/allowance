import { clerkClient } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_SUPABASE_SECRET_KEY!);

async function GET(req: NextApiRequest, res : NextApiResponse){
    const {userId} = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const {data, error} = await supabase.from('misc').select('savings, emergency, budget, allowance').eq('clerk_id', userId);
    if (error){res.status(500).send("Error retrieving misc data"); return}
    if (data.length == 0){
        const {error: error2} = await supabase.from('misc').insert({clerk_id: userId, emergency: [0,0], budget: [0,"EUR"], allowance : [0, "EUR", 1]});
        res.status(201).json({savings: [0, 0], emergency: 0});
        return
    }
    return res.status(200).json(data[0]);
}

async function PUT(req: NextApiRequest, res : NextApiResponse){
    const {userId} = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const {savings, emergency} = req.body;
    const {data, error} = await supabase.from('misc').select('savings, emergency').eq('clerk_id', userId);
    if (error){res.status(500).send("Error retrieving misc data"); return}
    if (data.length == 0){res.status(404).end(); return}
    const {error: error2} = await supabase.from('misc').update({savings: savings, emergency: emergency}).eq('clerk_id', userId);
    if (error2){res.status(500).send("Error updating misc data"); return}
    return res.status(200).json({message: "OK"});
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return await GET(req, res);
        case 'PUT':
            return await PUT(req, res);
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
export default handler;