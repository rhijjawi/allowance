import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_SUPABASE_SECRET_KEY!)
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return await GET(req, res);
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

async function GET(req: NextApiRequest, res : NextApiResponse){
    const { userId } = getAuth(req);
    const { data, error }  = await supabase.from('parents').select('*').eq('clerk_id', userId);
    const products = (await stripe.prices.list({lookup_keys : ['standard_monthly', 'standard_yearly', "early_one_time"]})).data.map((i) => i.product);
    if (error){
        res.status(500).send("Error retrieving parent data");
        return;
    }
    if (data.length == 0){
        res.status(404).end();
        return;
    }
    const customer = await stripe.customers.retrieve(data[0]['stripe_id'], {
        expand: ['subscriptions']
    });
    const subscription = await stripe.subscriptions.retrieve(data[0]['subscription_id']);
    
    const active = (subscription.status === 'active' || subscription.status === 'trialing');
    const value = subscription.items.data.filter((item) => products.indexOf(item.price.product) !== -1);
    if (value.length > 0 && active){
        return res.status(200).send(`${value.map((item) => item.price.product).join(",")},${active ? "active" : "inactive"}`);
    }
    else {
        return res.status(401).send("No active subscription");
    }

}

export default handler;
