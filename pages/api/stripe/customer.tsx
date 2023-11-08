import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_SUPABASE_SECRET_KEY!);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            return await POST(req, res);
        case 'GET':
            return await GET(req, res);
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

async function GET(req: NextApiRequest, res: NextApiResponse){
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { data, error } = await supabase.from('parents').select('*').eq('clerk_id', userId);
    if (data![0] === undefined){
        return res.status(404).json({ error: "Not Found" });
    }
    const stripeUser = await stripe.customers.retrieve(data![0]['stripe_customer_id']);
    const response = {
        stripeUser : stripeUser,
        supabaseUser: data![0],
    }
    return res.status(200).json(response);
}
    
async function POST(req: NextApiRequest, res: NextApiResponse){
    try {
        const { userId } = getAuth(req);
        
        const { email, name } = req.body;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const customer = await stripe.customers.create({
            email,
            name,
        });
        
        res.status(200).json({
            code: 'alles gut',
            customer,
        });
    } 
    catch (e) {
        console.error(e);
        res.status(400).json({
            code: 'oh sheiße',
            error: e,
        });
    }
}
export default handler;