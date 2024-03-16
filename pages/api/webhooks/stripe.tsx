import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
})
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_SECRET_KEY!
)

const handleStripeWebhook = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const sig = req.headers['stripe-signature']
    let event = req.body as Stripe.Event
    switch (event.type) {
        case 'invoice.paid':
            const prodsInInvoice = event.data.object.lines.data.map(
                (i: any) => {
                    return [i.price.product, i.price.id, i.price.lookup_key]
                }
            )
            await supabase
                .from('parents')
                .update({
                    subscription_id: event.data.object.subscription,
                    subscription_status: 'active',
                    plan: prodsInInvoice[0][2],
                })
                .eq('stripe_id', event.data.object.customer)
            break
        case 'invoice.upcoming':

        default:
            console.log(`Unhandled event type ${event.type}`)
    }

    return res.status(200).send('OK')
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'POST':
            return await handleStripeWebhook(req, res)
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
