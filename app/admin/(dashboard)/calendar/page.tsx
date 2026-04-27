import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CalendarView } from "@/components/admin/CalendarView";

export const metadata = {
  title: "Calendar | Maple HRMS",
  description: "View and manage your Google Calendar events from the admin dashboard.",
};

export default async function CalendarPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.id as string },
    select: { googleEmail: true, googleAccessToken: true },
  });

  const isConnected = !!user?.googleAccessToken;
  const googleEmail = user?.googleEmail || null;

  return (
    <div className="p-6 md:p-10 space-y-8 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-primary shadow-sm">
            <span
              className="material-symbols-outlined text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              calendar_month
            </span>
          </div>
          <div>
            <h1 className="font-headline text-4xl font-black tracking-tighter text-on-surface">
              Calendar
            </h1>
            <p className="text-on-surface-variant font-body text-sm font-medium opacity-70">
              {isConnected
                ? `Synced with ${googleEmail}`
                : "Connect a Google account to view events"}
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Client Component */}
      <CalendarView isConnected={isConnected} />
    </div>
  );
}
