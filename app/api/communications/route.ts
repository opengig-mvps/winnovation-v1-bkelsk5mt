import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type CommunicationRequestBody = {
  userId: number;
  expertId: number;
  callType: string;
};

export async function POST(request: Request) {
  try {
    const body: CommunicationRequestBody = await request.json();

    const userId = parseInt(body.userId.toString(), 10);
    const expertId = parseInt(body.expertId.toString(), 10);
    const callType = String(body.callType);

    if (isNaN(userId) || isNaN(expertId) || !callType) {
      return NextResponse.json({ success: false, message: 'Invalid input data' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const expert = await prisma.expertProfile.findUnique({ where: { userId: expertId } });

    if (!user || !expert) {
      return NextResponse.json({ success: false, message: 'User or Expert not found' }, { status: 404 });
    }

    const communication = await prisma.communication.create({
      data: {
        userId,
        expertId,
        callType,
        callDate: new Date(),
        recordingUrl: "http://example.com/recording",
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Communication session initiated',
      data: {
        communicationId: communication.id,
        callType: communication.callType,
        callDate: communication.callDate.toISOString(),
        recordingUrl: communication.recordingUrl,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error initiating communication session:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}