import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from "@/lib/email-service";

type BookingRequestBody = {
  userId: number;
  expertId: number;
  scheduleId: number;
};

export async function POST(request: Request) {
  try {
    const body: BookingRequestBody = await request.json();

    const userId = parseInt(body.userId.toString(), 10);
    const expertId = parseInt(body.expertId.toString(), 10);
    const scheduleId = parseInt(body.scheduleId.toString(), 10);

    if (isNaN(userId) || isNaN(expertId) || isNaN(scheduleId)) {
      return NextResponse.json({ success: false, message: 'Invalid input parameters' }, { status: 400 });
    }

    const schedule = await prisma.schedule.findFirst({
      where: { id: scheduleId, expertId: expertId },
    });

    if (!schedule) {
      return NextResponse.json({ success: false, message: 'Schedule not available' }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        expertId,
        scheduleId,
      },
    });

    await sendEmail({
      to: ["user@example.com", "expert@example.com"],
      template: {
        subject: "Booking Confirmation",
        html: "<h1>Your booking is confirmed</h1>",
        text: "Your booking is confirmed",
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      data: {
        bookingId: booking.id,
        status: booking.status,
        bookingDate: booking.bookingDate.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}