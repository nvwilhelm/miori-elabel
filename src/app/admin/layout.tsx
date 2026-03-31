import { validateSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/login");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isValid = await validateSession();
  if (!isValid) {
    redirect("/login?redirect=/admin");
  }

  return (
    <div data-admin className="min-h-screen bg-[var(--admin-bg)]">
      <AdminSidebar logoutAction={logoutAction} />
      <main className="pl-60 min-h-screen">
        <div className="px-8 py-6">{children}</div>
      </main>
    </div>
  );
}
