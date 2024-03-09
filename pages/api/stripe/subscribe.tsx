import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import Stripe from 'stripe'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_SECRET_KEY!
)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
})

const createSubscription = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        const { clerk_id, lookup_key } = req.body
        const { data, error } = await supabase
            .from('parents')
            .select('*')
            .eq('clerk_id', clerk_id)
        const prices = await stripe.prices.list({
            lookup_keys: [lookup_key],
        })
        if (data![0] === undefined || prices.data[0] === undefined || error) {
            return res.status(404).json({ error: 'Not Found' })
        }

        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            line_items: [{ price: prices.data[0].id, quantity: 1 }],
            mode: 'subscription',
            customer: data![0]['stripe_customer_id'],
            success_url: `https://logmoney.app/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://logmoney.app/cancel`,
        })
        res.status(200).json({
            code: 'session_created',
            session: session.url,
        })
    } catch (e) {
        console.error(e)
        res.status(400).json({
            code: 'session_creation_failed',
            error: e,
        })
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            return await createSubscription(req, res)
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}

export default handler
