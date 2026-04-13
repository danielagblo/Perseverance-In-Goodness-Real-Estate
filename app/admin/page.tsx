"use client";

import { useState } from "react";
import { createProperty } from "@/lib/property-actions";
import { Plus, Image as ImageIcon, Video, X } from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    files.forEach((file) => formData.append("media", file));

    const result = await createProperty(formData);
    if (result.success) {
      setMessage("Property created successfully!");
      e.currentTarget.reset();
      setFiles([]);
      setPreviews([]);
    } else {
      setMessage("Error creating property.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#2C3E50]">Property Manager</h1>
            <p className="text-[#7F8C8D]">Upload new listings to the advertisement showcase.</p>
          </div>
        </header>

        <section className="bg-white rounded-3xl shadow-xl p-8 border border-[#E9E1D1]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#34495E]">Property Title (Optional)</label>
                <input
                  name="title"
                  placeholder="e.g. Modern Villa with Pool"
                  className="w-full px-4 py-3 rounded-xl border border-[#D5C9B1] focus:ring-2 focus:ring-[#2C3E50] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#34495E]">Price (Optional)</label>
                <input
                  name="price"
                  placeholder="e.g. $1,200,000"
                  className="w-full px-4 py-3 rounded-xl border border-[#D5C9B1] focus:ring-2 focus:ring-[#2C3E50] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#34495E]">Location (Optional)</label>
              <input
                name="location"
                placeholder="e.g. Beverly Hills, CA"
                className="w-full px-4 py-3 rounded-xl border border-[#D5C9B1] focus:ring-2 focus:ring-[#2C3E50] outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#34495E]">Description (Optional)</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe the luxury details..."
                className="w-full px-4 py-3 rounded-xl border border-[#D5C9B1] focus:ring-2 focus:ring-[#2C3E50] outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#34495E]">Beds</label>
                <input name="beds" type="number" className="w-full px-4 py-3 rounded-xl border border-[#D5C9B1]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#34495E]">Baths</label>
                <input name="baths" type="number" className="w-full px-4 py-3 rounded-xl border border-[#D5C9B1]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#34495E]">Area (sq ft)</label>
                <input name="area" placeholder="e.g. 4,500" className="w-full px-4 py-3 rounded-xl border border-[#D5C9B1]" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#34495E]">Media (Images & Videos)</label>
              <div className="border-2 border-dashed border-[#D5C9B1] rounded-2xl p-8 text-center hover:border-[#2C3E50] transition-colors cursor-pointer relative">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 bg-[#F0F2F5] rounded-full">
                    <Plus className="w-6 h-6 text-[#2C3E50]" />
                  </div>
                  <p className="text-[#7F8C8D] text-sm font-medium">Click or drag to upload media</p>
                </div>
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {previews.map((src, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden aspect-square border border-[#E9E1D1]">
                      {files[index].type.startsWith("video") ? (
                        <video src={src} className="w-full h-full object-cover" />
                      ) : (
                        <img src={src} alt="preview" className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#2C3E50] text-white rounded-2xl font-bold text-lg hover:bg-[#34495E] transition-all disabled:opacity-50 shadow-lg shadow-[#2C3E5033]"
              >
                {loading ? "Uploading to S3..." : "Publish Advertisement"}
              </button>
            </div>

            {message && (
              <p className={`text-center mt-4 font-semibold ${message.includes("Error") ? "text-red-500" : "text-green-600"}`}>
                {message}
              </p>
            )}
          </form> section
        </section>
      </div>
    </div>
  );
}
