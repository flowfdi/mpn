import Link from "next/link";
import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FileText, Shield, Zap, Brain } from "lucide-react";

export default async function LandingPage() {
  const { user } = await validateRequest();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">PatientNotes</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-sm text-blue-700 mb-8">
          <Brain className="h-4 w-4" />
          AI-Assisted Clinical Documentation
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
          Clinical notes that{" "}
          <span className="text-blue-600">write themselves.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          PatientNotes helps healthcare providers capture, organize, and
          summarize patient encounters in seconds — with AI doing the heavy
          lifting.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup">
            <Button size="lg" className="text-base px-8">
              Get Started Free
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-base px-8">
              Log in
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              icon: <FileText className="h-8 w-8 text-blue-600" />,
              title: "Structured Notes",
              desc: "Capture SOAP notes, follow-ups, and referrals in a clean, searchable format.",
            },
            {
              icon: <Brain className="h-8 w-8 text-blue-600" />,
              title: "AI Summarization",
              desc: "One click to generate a concise clinical summary from your raw notes.",
            },
            {
              icon: <Shield className="h-8 w-8 text-blue-600" />,
              title: "Private & Secure",
              desc: "Your data stays yours. No third-party auth, no data sharing.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col gap-4"
            >
              {f.icon}
              <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="bg-blue-600 rounded-3xl p-12 text-white">
          <Zap className="h-10 w-10 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-3">Ready to save hours a week?</h2>
          <p className="text-blue-100 mb-8">
            Join clinicians already using PatientNotes to spend less time documenting
            and more time with patients.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              variant="secondary"
              className="text-blue-700 font-semibold px-10"
            >
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>PatientNotes</span>
          </div>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
