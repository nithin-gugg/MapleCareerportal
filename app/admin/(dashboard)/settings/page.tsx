import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingsContent } from "@/components/admin/SettingsContent";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.id as string },
    select: {
      googleEmail: true,
      googleAccessToken: true,
    },
  });

  return (
    <div className="p-6 md:p-10 space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-4xl font-black tracking-tight text-on-surface uppercase">
          Settings
        </h1>
        <p className="text-sm font-medium text-on-surface-variant opacity-70">
          Configure your administrative environment and integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <SettingsContent user={user} />
        </div>
        
        <div className="space-y-6">
          <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-8 space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">info</span>
             </div>
             <h3 className="font-headline text-xl font-bold text-on-surface uppercase tracking-tight">System Status</h3>
             <p className="text-sm text-on-surface-variant leading-relaxed">
               Your Google integration is used for synchronization of interview schedules and generation of Google Meet links.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
