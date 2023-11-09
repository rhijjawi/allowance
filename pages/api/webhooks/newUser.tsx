import { NextApiRequest, NextApiResponse } from "next";
import { getSupabase } from "@/utils/supabase";
import { clerkClient } from "@clerk/nextjs";
import { UserJSON } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_SUPABASE_SECRET_KEY!);

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { data } = req.body;
  await clerkClient.users.updateUserMetadata(data.id, {
    publicMetadata: {
      role: data.unsafe_metadata.role,
      currency: data.unsafe_metadata.currency
    },
    unsafeMetadata: {}
  })
  const { data: data2, error } = await supabase.from('parents').select('*').eq('clerk_id', data.id);
  if (data2!.length > 0) {
    const stripeUser = await stripe.customers.retrieve(data2![0]['stripe_id']);
    return res.status(200).json({ message: "OK", customer: stripeUser })
  }
  else {
    const { id, emailAddresses, firstName, lastName } = data;

    const customer = await stripe.customers.create({
      email: emailAddresses[0].emailAddress,
      name: `${firstName} ${lastName}`,
      metadata: { publicMetadata: { role: data.unsafe_metadata.role, currency: data.unsafe_metadata.currency } as any }
    });

    res.status(200).json({
      code: 'oh sheiße',
      customer,
    });
  }
  res.status(200).json({ message: "OK" })

}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      return await POST(req, res);
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}