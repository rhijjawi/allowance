import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_SUPABASE_SECRET_KEY!);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            return await POST(req, res);
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

async function POST(req: NextApiRequest, res: NextApiResponse){
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const {data, error} = await supabase.from('parents').select('*').eq('clerk_id', userId);
    console.log(data, error)
    if (data!.length > 0){
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: data![0]['stripe_id'],
            return_url: `https://logmoney.app${req.query.backurl}`,
        });
        return res.status(200).json({message: "OK", portalSession : portalSession.url})
    }
    else {
        console.log(userId, data, error)
        return res.status(500).json({message: "oh sheiße", data: data, error: error})
    }
}

export default handler;