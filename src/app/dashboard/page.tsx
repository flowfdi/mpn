import { validateRequest } from "@/lib/auth";
import { getNotesByUser } from "@/lib/store";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const metadata = { title: "Dashboard — PatientNotes AI" };

export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const notes = getNotesByUser(user.id);

  return <DashboardClient user={user} initialNotes={notes} />;
}
