"use server";

import prisma from "@/lib/prisma";

export async function getDresses() {
  try{
    return prisma.dresses.findMany({
      where: {
        isPublished: true,
      },

      include: {
        images: true,
        reviews: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
  catch(error){
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);    
  }
  
}
