
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // TODO: Add validation here (e.g., using Zod)
    // TODO: Associate with a logged-in user

    const volunteer = await prisma.volunteer.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        birthDate: new Date(data.birthDate),
        birthPlace: data.birthPlace,
        sex: data.sex,
        maritalStatus: data.maritalStatus,
        idCardNumber: data.idNumber,
        address: data.address,
        educationLevel: data.educationLevel,
        profession: data.profession,
        skills: data.skills,
        volunteerExperience: data.volunteerExperience,
        availability: data.availability,
        causes: data.causes,
        assignedCell: data.assignedCell,
        residenceProvince: data.residence?.province,
        residenceDepartement: data.residence?.departement,
        residenceCommuneCanton: data.residence?.communeCanton,
        residenceArrondissement: data.residence?.arrondissement,
        residenceQuartierVillage: data.residence?.quartierVillage,
        photo: data.photo,
        idCardFront: data.idCardFront,
        idCardBack: data.idCardBack,
        termsAccepted: data.termsAccepted,
      },
    });

    return NextResponse.json(volunteer);
  } catch (error) {
    console.error('Volunteer Registration Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
