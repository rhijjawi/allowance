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
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const {data, error} = await supabase.from('parents').select('*').eq('clerk_id', userId);
    if (data!.length > 0){
        const stripeUser = await stripe.customers.retrieve(data![0]['stripe_id']);
        return res.status(200).json({message: "OK", customer : stripeUser})
    }
    else {
        const user = userId ? await clerkClient.users.getUser(userId) : null;
        const {id, emailAddresses, firstName, lastName, publicMetadata} = user!;
        
        const customer = await stripe.customers.create({
            email : emailAddresses[0].emailAddress,
            name : `${firstName} ${lastName}`,
            metadata : {publicMetadata : publicMetadata as any}
        });
    
        res.status(200).json({
            code: 'oh sheiße',
            customer,
        });
    }
    
}

export default handler;