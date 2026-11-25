import Sidebar from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const unread = await prisma.message.count({ where: { read: false } }).catch(() => 0);

  return (
    <div className="min-h-screen md:flex">
      <Sidebar email={session.email} unread={unread} />
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
