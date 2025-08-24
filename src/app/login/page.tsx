"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Sedang login...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setMessage("Login berhasil! Mengarahkan...");
        router.push("/"); // redirect ke beranda
      } else {
        setMessage(data.error || "Login gagal");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan, coba lagi");
    }
  };

  return (
    <section className="w-full min-h-screen flex justify-center items-center bg-white px-6 md:px-16 lg:px-[128px] text-blue-950">
      <div className="w-full max-w-md py-12 px-6 md:px-12 bg-white/40 rounded-[24px] md:rounded-[40px] shadow space-y-6">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Email"
            type="email"
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg shadow-md transition"
          >
            Login
          </button>
        </form>
        {message && (
          <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
        )}
      </div>
    </section>
  );
}
