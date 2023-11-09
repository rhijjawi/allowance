import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';
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
    const {item} = JSON.parse(req.body);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const {data, error} = await supabase.from('parents').select('*').eq('clerk_id', userId);
    if (data!.length == 0){
        const stripeUser = await stripe.customers.retrieve(data![0]['stripe_id']);
        return res.status(200).json({message: "OK", customer : stripeUser})
    }
    else {
        const session = await stripe.checkout.sessions.create({
            billing_address_collection : "auto",
            currency: "eur",
            line_items : [{price: item[0], quantity: 1}],
            customer: data![0]['stripe_id'],
            mode: item[1] ? 'subscription' : 'payment',
            success_url: `https://logmoney.app/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://logmoney.app/cancel`,
        });
        return res.status(200).json({message: "OK", goto: session.url})
    }
    
}

export default handler;