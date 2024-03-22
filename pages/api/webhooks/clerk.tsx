import { NextApiRequest, NextApiResponse } from 'next'
import { clerkClient } from '@clerk/nextjs'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { insertRow, upsertRow } from '../user/parent'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
})
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_SECRET_KEY!
)

async function POST(req: NextApiRequest, res: NextApiResponse) {
    const { data } = req.body
    let pm
    if (data.unsafe_metadata.role === 'parent') {
        const { data: data2, error } = await supabase
            .from('parents')
            .select('*')
            .eq('clerk_id', data.id)
        if (data2!.length > 0) {
            const stripeUser = await stripe.customers.retrieve(
                data2![0]['stripe_id']
            )
            return res.status(200).json({ message: 'OK', customer: stripeUser })
        } else {
            const { id, email_addresses, first_name, last_name } = data

            const customer = await stripe.customers.create({
                email: email_addresses[0].emailAddress,
                name: `${first_name} ${last_name}`,
            })
            res.status(200).json({
                code: 'oh sheiße',
                customer,
            })
            if (data.unsafe_metadata.invitedBy){
                await insertRow(data.unsafe_metadata.invitedBy, data.id)
            }
            await supabase.from('parents').insert({
                clerk_id: data.id,
                stripe_id: customer.id,
                subscription_id: null,
            })
        }
        pm = {
            role: data.unsafe_metadata.role,
            currency: data.unsafe_metadata.currency,
            reports: {
                currency: data.unsafe_metadata.currency,
                language: 'en',
            },
        }
    }
    if (data.unsafe_metadata.role === 'student') {
        await supabase.from('misc').insert({
            clerk_id: data.id,
            emergency: [0, 0, data.unsafe_metadata.currency],
            savings: [0, 0, data.unsafe_metadata.currency],
            budget: [0, data.unsafe_metadata.currency],
            allowance: [0, data.unsafe_metadata.currency, 1],
        })
        pm = {
            role: data.unsafe_metadata.role,
            currency: data.unsafe_metadata.currency,
            oversight: [],
        }
    }
    try {
        await clerkClient.users.updateUserMetadata(data.id, {
            publicMetadata: pm,
            unsafeMetadata: {},
            privateMetadata: { role: data.unsafe_metadata.role },
        })
    } catch (e: any | unknown) {
        res.status(500).json({ message: e })
    }
    res.status(200).json({ message: 'OK' })
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'POST':
            return await POST(req, res)
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
