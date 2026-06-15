"use server";

import { db } from "@/lib/db";

export async function submitContactQuery(formData: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const query = await db.contactQuery.create({
      data: {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      },
    });
    return { success: true, id: query.id };
  } catch (error) {
    console.error("Error saving contact query:", error);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}
