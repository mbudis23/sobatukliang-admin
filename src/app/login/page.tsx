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
    <div className="p-8">
      <h1 className="text-xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          placeholder="Email"
          type="email"
          required
          className="border p-2 w-full"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          required
          className="border p-2 w-full"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded w-full"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
