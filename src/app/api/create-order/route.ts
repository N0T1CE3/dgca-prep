import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_SRn89iypBeUy1U',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'V2kJfaZZhcJXM7KKLbDCNzg2',
});

export async function POST(request: Request) {
  try {
    const { amount, userId } = await request.json();

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: 'INR',
      receipt: `dgca_${userId}_${Date.now()}`,
      notes: {
        userId: userId,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
