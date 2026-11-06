import { Coupon } from '@/types';

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'LEARN10',
    description: '10% discount for learning & testing',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_amount: 500,
    max_discount: 2000,
    is_active: true,
  },
  {
    code: 'SPHERE500',
    description: 'Flat ₹500 off on orders above ₹2,000',
    discount_type: 'fixed',
    discount_value: 500,
    min_order_amount: 2000,
    is_active: true,
  },
  {
    code: 'WELCOME100',
    description: '₹100 welcome bonus for new shoppers',
    discount_type: 'fixed',
    discount_value: 100,
    min_order_amount: 499,
    is_active: true,
  },
];

export function validateCoupon(
  code: string,
  orderTotal: number
): { valid: boolean; discountAmount: number; message: string; coupon?: Coupon } {
  const cleanCode = code.trim().toUpperCase();
  const coupon = INITIAL_COUPONS.find((c) => c.code === cleanCode && c.is_active);

  if (!coupon) {
    return {
      valid: false,
      discountAmount: 0,
      message: 'Invalid or expired coupon code.',
    };
  }

  if (orderTotal < coupon.min_order_amount) {
    return {
      valid: false,
      discountAmount: 0,
      message: `Minimum order amount of ₹${coupon.min_order_amount} required to apply this coupon.`,
    };
  }

  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = Math.round((orderTotal * coupon.discount_value) / 100);
    if (coupon.max_discount && discount > coupon.max_discount) {
      discount = coupon.max_discount;
    }
  } else {
    discount = coupon.discount_value;
  }

  return {
    valid: true,
    discountAmount: Math.min(discount, orderTotal),
    message: `Coupon ${coupon.code} applied successfully! You saved ₹${discount}.`,
    coupon,
  };
}

