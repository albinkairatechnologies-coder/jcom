"use server";

import { db } from "@/lib/db";

export async function submitMembership(formData: {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  company?: string;
  industry?: string;
  message: string;
}) {
  try {
    const application = await db.membershipApplication.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        company: formData.company || null,
        industry: formData.industry || null,
        message: formData.message,
      },
    });
    return { success: true, id: application.id };
  } catch (error) {
    console.error("Error saving membership application:", error);
    return { success: false, error: "Failed to submit application. Please try again." };
  }
}
