import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { getAuth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { clerkClient } from '@clerk/nextjs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
})
const prices: {
    [index: string]: { monthly?: string; yearly?: string; one_time?: string }
} = {
    standard: {
        monthly: 'price_1OikXJL03PLceRLOxrEshHHC',
        yearly: 'price_1OikXJL03PLceRLOSrxI9oGb',
    },
    early: {
        one_time: 'price_1OikXEL03PLceRLOirvUBkJ6',
    },
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return await GET(req, res)
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
    const allPrices = Object.keys(prices)
        .map((i) => {
            return Object.keys(prices[i]).map((j) => {
                return `${i}_${j}`
            })
        })
        .flat()
    const pricesStripe = await stripe.prices.list({
        lookup_keys: allPrices,
        expand: ['data.product'],
    })
    return res.send(pricesStripe.data)
}

export default handler
