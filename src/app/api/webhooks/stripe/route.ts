import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: '2025-01-27.acacia' as any })
  : null;

export async function POST(req: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ message: 'Stripe webhook not configured' }, { status: 200 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = createAdminClient();

    if (supabase) {
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          order_status: 'confirmed',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_session_id', session.id);
    }
  }

  return NextResponse.json({ received: true });
}

