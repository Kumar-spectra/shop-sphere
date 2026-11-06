import { NextResponse } from 'next/server';
import { cashfree } from '@/lib/payments/cashfree';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature') || '';
    const timestamp = req.headers.get('x-webhook-timestamp') || '';

    // Verify webhook signature (strict in production, permissive in learning mode)
    const isValid = cashfree.verifyWebhookSignature(signature, rawBody, timestamp);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { data, type } = payload;

    if (type === 'PAYMENT_SUCCESS_WEBHOOK' || type === 'ORDER_PAID_SUCCESS') {
      const orderId = data?.order?.order_id;
      const supabase = createAdminClient();

      if (supabase && orderId) {
        await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            order_status: 'confirmed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);
      }
    }

    return NextResponse.json({ success: true, message: 'Webhook received' }, { status: 200 });
  } catch (err: any) {
    console.error('Cashfree webhook error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

