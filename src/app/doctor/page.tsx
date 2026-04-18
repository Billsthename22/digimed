"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  Mail,
  Lock,
  ShieldCheck,
  Loader2,
  Stethoscope,
} from "lucide-react";

export default function StaffAuthPage() {
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // ================= LOGIN =================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data?.user) {
      setErrorMsg(error?.message || "Invalid email or password");
      setLoading(false);
      return;
    }

    // SAFE PROFILE FETCH (no assumptions about columns)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) {
      setErrorMsg("Failed to load profile");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (!profile) {
      setErrorMsg("Profile not found. Contact admin.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // STRICT DOCTOR CHECK
    if ((profile.role || "").toUpperCase() !== "DOCTOR") {
      setErrorMsg("Access denied: Doctor portal only");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    router.push("/doctordashboard");
    router.refresh();
  };

  // ================= REGISTER =================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (authError || !data?.user) {
      setErrorMsg(authError?.message || "Signup failed");
      setLoading(false);
      return;
    }

    // CREATE DOCTOR PROFILE ONLY (NO STUDENT FIELDS)
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        full_name: fullName,
        role: "DOCTOR",
      });

    if (profileError) {
      console.error(profileError);
      setErrorMsg("Profile creation failed");
      setLoading(false);
      return;
    }

    setErrorMsg("Doctor account created! You can now log in.");
    setIsLogin(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-6">

      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="bg-blue-500 p-2 rounded-lg text-white">
          <ShieldCheck size={24} />
        </div>
        <span className="text-2xl font-black text-white">
          DigiMed <span className="text-blue-400">Doctors</span>
        </span>
      </Link>

      <div className="w-full max-w-md bg-slate-800 rounded-[2.5rem] p-8 border border-slate-700">

        <div className="text-center mb-8">
          <Stethoscope className="mx-auto text-blue-400 mb-2" />
          <h1 className="text-xl font-black text-white">
            {isLogin ? "Doctor Login" : "Doctor Registration"}
          </h1>
        </div>

        {/* Toggle */}
        <div className="flex mb-6 bg-slate-900 rounded-xl p-1 border border-slate-700">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 font-bold rounded-lg ${
              isLogin ? "bg-blue-500 text-white" : "text-slate-400"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 font-bold rounded-lg ${
              !isLogin ? "bg-blue-500 text-white" : "text-slate-400"
            }`}
          >
            Register
          </button>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-bold text-center ${
            errorMsg.includes("created")
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name (Dr. ...)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-700"
              required
            />
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="email"
              placeholder="Medical Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 p-4 rounded-xl bg-slate-900 text-white border border-slate-700"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 p-4 rounded-xl bg-slate-900 text-white border border-slate-700"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-500 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : isLogin ? (
              "Login to Staff Portal"
            ) : (
              "Create Doctor Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}