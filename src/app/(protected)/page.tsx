"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function ContentAdminPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [infografis, setInfografis] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState<"article" | "infografis" | null>(
    null
  );
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    image: null,
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const [aRes, iRes] = await Promise.all([
        fetch("/api/articles").then((r) => r.json()),
        fetch("/api/infografis").then((r) => r.json()),
      ]);
      setArticles(aRes);
      setInfografis(iRes);
    };
    fetchData();
  }, []);

  // Handle delete
  const handleDelete = async (type: "article" | "infografis", id: string) => {
    setLoading(true);
    await fetch(`/api/${type}/${id}`, { method: "DELETE" });
    if (type === "article") {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } else {
      setInfografis((prev) => prev.filter((i) => i.id !== id));
    }
    setLoading(false);
  };

  // Handle create (upload to Cloudinary + save to DB)
  const handleCreate = async (type: "article" | "infografis") => {
    setLoading(true);

    let imageUrl = "";
    if (form.image) {
      const formData = new FormData();
      formData.append("file", form.image);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
      );

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env
          .NEXT_PUBLIC_CLOUDINARY_CLOUD!}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await uploadRes.json();
      imageUrl = data.secure_url;
    }

    const body: any = { title: form.title, imageUrl };
    if (type === "infografis") body.description = form.description;

    const res = await fetch(`/api/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const newItem = await res.json();

    if (type === "article") setArticles((prev) => [...prev, newItem]);
    else setInfografis((prev) => [...prev, newItem]);

    setForm({ title: "", description: "", image: null });
    setOpenModal(null);
    setLoading(false);
  };

  return (
    <section className="w-full min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Konten</h1>

        <Tabs defaultValue="articles" className="w-full">
          <TabsList>
            <TabsTrigger value="articles">Artikel</TabsTrigger>
            <TabsTrigger value="infografis">Infografis</TabsTrigger>
          </TabsList>

          {/* === Artikel === */}
          <TabsContent value="articles">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setOpenModal("article")}>
                + Tambah Artikel
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <Card key={a.id} className="rounded-2xl shadow">
                  <CardContent className="p-4 space-y-3">
                    {a.imageUrl && (
                      <Image
                        src={a.imageUrl}
                        alt={a.title}
                        width={400}
                        height={200}
                        className="rounded-xl object-cover"
                      />
                    )}
                    <h3 className="font-semibold text-lg">{a.title}</h3>
                    <div className="flex justify-between">
                      <Button variant="outline">Edit</Button>
                      <Button
                        variant="destructive"
                        disabled={loading}
                        onClick={() => handleDelete("article", a.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* === Infografis === */}
          <TabsContent value="infografis">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setOpenModal("infografis")}>
                + Tambah Infografis
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {infografis.map((i) => (
                <Card key={i.id} className="rounded-2xl shadow">
                  <CardContent className="p-4 space-y-3">
                    <Image
                      src={i.imageUrl}
                      alt={i.title}
                      width={400}
                      height={200}
                      className="rounded-xl object-cover"
                    />
                    <h3 className="font-semibold text-lg">{i.title}</h3>
                    <p className="text-sm text-gray-600">{i.description}</p>
                    <div className="flex justify-between">
                      <Button variant="outline">Edit</Button>
                      <Button
                        variant="destructive"
                        disabled={loading}
                        onClick={() => handleDelete("infografis", i.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Tambah */}
      <Dialog open={!!openModal} onOpenChange={() => setOpenModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Tambah {openModal === "article" ? "Artikel" : "Infografis"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Judul"
              className="w-full border p-2 rounded"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            {openModal === "infografis" && (
              <textarea
                placeholder="Deskripsi"
                className="w-full border p-2 rounded"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, image: e.target.files?.[0] || null })
              }
            />
            <Button disabled={loading} onClick={() => handleCreate(openModal!)}>
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
