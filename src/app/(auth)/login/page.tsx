import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata = { title: "Log In — PatientNotes" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <FileText className="h-6 w-6 text-blue-600" />
        <span className="text-xl font-bold text-slate-900">PatientNotes</span>
      </Link>
      <LoginForm />
    </div>
  );
}
