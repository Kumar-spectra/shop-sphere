import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { cashfree } from '@/lib/payments/cashfree';
import { shiprocket } from '@/lib/shipping/shiprocket';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: '2025-01-27.acacia' as any })
  : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, address, paymentMethod, couponCode, discountAmount = 0, origin } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Calculate final server-verified amount
    const rawSubtotal = items.reduce((sum: number, item: any) => {
      const price = item.product.discount_price ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);

    const deliveryFee = rawSubtotal >= 500 ? 0 : 99;
    const finalAmount = Math.max(0, rawSubtotal - discountAmount + deliveryFee);

    // Create simulated or live Shiprocket shipment
    const shipment = await shiprocket.createShipment(
      orderId,
      'Delhivery Surface Express',
      address?.city || 'Mumbai'
    );

    // 1. CASHFREE PAYMENT FLOW
    if (paymentMethod === 'cashfree') {
      const cfOrder = await cashfree.createOrder({
        orderId,
        orderAmount: finalAmount,
        customerDetails: {
          customerId: address?.phone || `cust_${Date.now()}`,
          customerName: address?.full_name || 'Customer',
          customerEmail: 'customer@shopsphere.in',
          customerPhone: address?.phone || '9876543210',
        },
        orderMeta: {
          returnUrl: `${origin}/checkout/success?order_id=${orderId}&method=cashfree`,
        },
      });

      return NextResponse.json({
        success: true,
        orderId,
        cfOrderId: cfOrder.cfOrderId,
        shipment,
        url: cfOrder.paymentUrl || `${origin}/checkout/payment-simulate?order_id=${orderId}&cf_order_id=${cfOrder.cfOrderId}`,
      });
    }

    // 2. CASH ON DELIVERY FLOW
    if (paymentMethod === 'cod') {
      return NextResponse.json({
        success: true,
        orderId,
        shipment,
        url: `${origin || 'http://localhost:3000'}/checkout/success?order_id=${orderId}&method=cod`,
      });
    }

    // 3. STRIPE CHECKOUT FLOW
    if (paymentMethod === 'stripe' && stripe) {
      const line_items = items.map((item: any) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.product.name,
            images: item.product.image_urls?.slice(0, 1),
          },
          unit_amount: Math.round((item.product.discount_price ?? item.product.price) * 100),
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&method=stripe`,
        cancel_url: `${origin}/checkout?canceled=true`,
        metadata: {
          order_id: orderId,
          customer_name: address?.full_name || 'Customer',
          phone: address?.phone || '',
          postal_code: address?.postal_code || '',
        },
      });

      return NextResponse.json({ url: session.url, orderId, shipment });
    }

    // Fallback URL for COD
    return NextResponse.json({
      success: true,
      orderId,
      shipment,
      url: `${origin}/checkout/success?order_id=${orderId}&method=${paymentMethod}`,
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
