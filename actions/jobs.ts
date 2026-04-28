"use server";

import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML coming from the RichTextEditor before persisting.
 * Strips script tags, on* handlers, and other XSS vectors.
 */
function sanitizeHtml(raw: string): string {
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "a", "hr",
      "pre", "code",
      "blockquote",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

export async function createJobAction(formData: FormData, skills: string[]) {
  const title = formData.get("title") as string;
  const rawDescription = formData.get("description") as string;
  const type = formData.get("type") as string;

  if (!title || !rawDescription) {
    throw new Error("Title and description are required");
  }

  const description = sanitizeHtml(rawDescription).trim();

  if (!description) {
    throw new Error("Description is empty after sanitization");
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
