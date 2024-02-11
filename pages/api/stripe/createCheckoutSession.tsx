import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { User, getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { assert } from 'console';
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
    const {userId} = getAuth(req);
    const user = userId ? await clerkClient.users.getUser(userId) : null;
    const {item} = JSON.parse(req.body);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const {data, error} = await supabase.from('parents').select('*').eq('clerk_id', user.id);
    if (data!.length == 0){
        const newUser = await stripe.customers.create({email : user.emailAddresses[0].emailAddress});
        const {data : data1, error : error1} = await supabase.from('parents').insert({clerk_id : user.id, stripe_id : newUser.id, subscription_status : null, plan : null}).select()
        if (data1 && !error1){
            const session = await stripe.checkout.sessions.create({
                billing_address_collection : "auto",
                currency: (user?.publicMetadata!.metadata as { currency?: string })?.currency ?? "EUR",
                line_items : [{price: item[0], quantity: 1}],
                customer: data![0]['stripe_id'],
                subscription_data: {trial_period_days: 30},
                mode: item[1] ? 'subscription' : 'payment',
                allow_promotion_codes : true,
                success_url: `https://logmoney.app/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `https://logmoney.app/cancel`,
            });
            return res.status(200).json({message: "OK", goto: session.url})
        }
        else if (error1){
            return res.status(500).json({error : error1.message})
        }
    }
    else {
        const session = await stripe.checkout.sessions.create({
            billing_address_collection : "auto",
            currency: (user?.publicMetadata!.metadata as { currency?: string })?.currency ?? "EUR",
            line_items : [{price: item[0], quantity: 1}],
            customer: data![0]['stripe_id'],
            subscription_data: {trial_period_days: 30},
            mode: item[1] ? 'subscription' : 'payment',
            allow_promotion_codes : true,
            success_url: `https://logmoney.app/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://logmoney.app/cancel`,
        });
        return res.status(200).json({message: "OK", goto: session.url})
    }
    
}

export default handler;