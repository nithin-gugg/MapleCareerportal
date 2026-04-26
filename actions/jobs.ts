"use server";

import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJobAction(formData: FormData, skills: string[]) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;

  if (!title || !description) {
    throw new Error("Title and description are required");
  }

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  // Ensure unique slug
  while (true) {
    const existing = await db.job.findUnique({
      where: { slug },
    });
    if (!existing) break;
    slug = `${baseSlug}-${counter++}`;
  }

  await db.job.create({
    data: {
      title,
      slug,
      description,
      type,
      skills,
      status: "OPEN",
    },
  });

  revalidatePath("/jobs");
  revalidatePath("/admin/jobs");
  redirect("/admin/jobs");
}

export async function getJobs(status?: "OPEN" | "CLOSED" | "DRAFT") {
  return await db.job.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getJobBySlug(slug: string) {
  return await db.job.findUnique({
    where: { slug },
  });
}
