import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const query = searchParams.get('query') || '';
    const company = searchParams.get('company') || '';
    const role = searchParams.get('role') || '';
    const specialization = searchParams.get('specialization') || '';

    // Fetch experts from the database
    const experts = await prisma.expertProfile.findMany({
      where: {
        AND: [
          { user: { name: { contains: query, mode: 'insensitive' } } },
          { company: { contains: company, mode: 'insensitive' } },
          { role: { contains: role, mode: 'insensitive' } },
          { expertiseAreas: { contains: specialization, mode: 'insensitive' } },
        ],
      },
      orderBy: [
        { ratings: { _avg: { rating: 'desc' } } },
        { yearsOfExperience: 'desc' },
      ],
      include: {
        user: true,
        ratings: true,
      },
    });

    const expertData = experts?.map((expert: any) => ({
      id: expert?.id,
      name: expert?.user?.name,
      role: expert?.role,
      company: expert?.company,
      yearsOfExperience: expert?.yearsOfExperience,
      expertiseAreas: expert?.expertiseAreas,
      ratings: expert?.ratings?.reduce((acc: number, rating: any) => acc + rating?.rating, 0) / expert?.ratings?.length || 0,
    }));

    return NextResponse.json({
      success: true,
      message: 'Experts retrieved successfully',
      data: expertData,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error retrieving experts:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}