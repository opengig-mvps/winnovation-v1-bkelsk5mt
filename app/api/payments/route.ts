import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type PaymentRequestBody = {
  userId: number;
  amount: number;
  paymentMethod: string;
};

export async function POST(request: Request) {
  try {
    const body: PaymentRequestBody = await request.json();
    const userId = parseInt(body.userId.toString(), 10);
    const amount = parseFloat(body.amount.toString());
    const paymentMethod = String(body.paymentMethod);

    if (isNaN(userId) || isNaN(amount) || !paymentMethod) {
      return NextResponse.json({ success: false, message: 'Invalid input data' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const paymentStatus = 'completed';
    const transactionDate = new Date();

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        paymentMethod,
        paymentStatus,
        transactionDate,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        paymentId: payment.id,
        amount: payment.amount,
        paymentStatus: payment.paymentStatus,
        transactionDate: payment.transactionDate.toISOString(),
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}