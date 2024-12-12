import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { expertId: string } }
) {
  try {
    const expertId = parseInt(params.expertId, 10);
    if (isNaN(expertId)) {
      return NextResponse.json({ success: false, message: 'Invalid expert ID' }, { status: 400 });
    }

    const expertProfile = await prisma.expertProfile.findFirst({
      where: { id: expertId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        ratings: {
          select: {
            userId: true,
            rating: true,
            review: true,
          },
        },
      },
    });

    if (!expertProfile) {
      return NextResponse.json({ success: false, message: 'Expert not found' }, { status: 404 });
    }

    const responseData = {
      id: expertProfile.id,
      name: expertProfile.user?.name,
      role: expertProfile.role,
      company: expertProfile.company,
      certifications: expertProfile.certifications,
      yearsOfExperience: expertProfile.yearsOfExperience,
      expertiseAreas: expertProfile.expertiseAreas,
      ratings: expertProfile.ratings.map((rating: any) => ({
        userId: rating.userId,
        rating: rating.rating,
        review: rating.review,
      })),
    };

    return NextResponse.json({
      success: true,
      message: 'Expert profile retrieved successfully',
      data: responseData,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error retrieving expert profile:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}