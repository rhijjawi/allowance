import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_SUPABASE_SECRET_KEY!);

const handleStripeWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
    const sig = req.headers['stripe-signature'];

    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'] as string, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created': {
        const customerSubscriptionCreated = event.data.object;
        await supabase.from('parents').update({ subscription_status: "active" }).eq('stripe_id', customerSubscriptionCreated.customer as string);
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const customerSubscriptionUpdated = event.data.object;
        const status = customerSubscriptionUpdated.status;
        await supabase.from('parents').update({ subscription_status: status }).eq('stripe_id', customerSubscriptionUpdated.customer as string);
        break;
      }

      case 'invoice.paid': {
        const invoicePaid = event.data.object;
        await supabase.from('parents').update({ subscription_status: "active" }).eq('stripe_id', invoicePaid.customer as string);
        break;
      }
      case 'invoice.payment_failed': {
        const invoicePaymentFailed = event.data.object;
        await supabase.from('parents').update({ subscription_status: "unpaid" }).eq('stripe_id', invoicePaymentFailed.customer as string);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  

    res.status(200);
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    switch (req.method) {
      case 'POST':
        return await handleStripeWebhook(req, res);
      default:
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }