"use client";

import { useState, useEffect } from "react";
import { createProperty, getProperties, deleteProperty, updateProperty, makeBucketPublic } from "@/lib/property-actions";
import { createPerfume, getPerfumes, deletePerfume, updatePerfume } from "@/lib/perfume-actions";
import { Plus, Image as ImageIcon, Video, X, Trash2, ExternalLink, Loader2, Edit3, ShieldAlert, Home as HomeIcon, Droplet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"properties" | "perfumes">("properties");
  const [items, setItems] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [fixingPermissions, setFixingPermissions] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingMedia, setExistingMedia] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setFetching(true);
    if (activeTab === "properties") {
      const data = await getProperties();
      setItems(data);
    } else {
      const data = await getPerfumes();
      setItems(data);
    }
    setFetching(false);
  };

  const handleFixPermissions = async () => {
    if (confirm("This will attempt to make your whole bucket public so images can be viewed. Continue?")) {
      setFixingPermissions(true);
      const result = await makeBucketPublic();
      if (result.success) {
        alert("Permissions updated! Your images should be visible now.");
      } else {
        alert("Failed to update permissions: " + result.error + "\n\nYou may need to set this manually in your Railway/S3 dashboard.");
      }
      setFixingPermissions(false);
    }
  };

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setExistingMedia(item.media || []);
      setPreviews([]);
      setFiles([]);
    } else {
      setEditingItem(null);
      setExistingMedia([]);
      setPreviews([]);
      setFiles([]);
    }
    setIsModalOpen(true);
  };

  const removeExistingMedia = (index: number) => {
    setExistingMedia((prev) => prev.filter((_, i) => i !== index));
  };

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
    // Pass remaining existing media keys so server knows what to keep
    formData.append("existingMedia", JSON.stringify(existingMedia));

    let result;
    if (activeTab === "properties") {
      if (editingItem) {
        result = await updateProperty(editingItem._id, formData);
      } else {
        result = await createProperty(formData);
      }
    } else {
      if (editingItem) {
        result = await updatePerfume(editingItem._id, formData);
      } else {
        result = await createPerfume(formData);
      }
    }

    if (result?.success) {
      setMessage(editingItem ? "Updated successfully!" : "Created successfully!");
      setTimeout(() => {
        setIsModalOpen(false);
        setMessage("");
        fetchData();
      }, 1500);
    } else {
      setMessage(result?.error || "Operation failed.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this?")) {
      let result;
      if (activeTab === "properties") {
        result = await deleteProperty(id);
      } else {
        result = await deletePerfume(id);
      }
      if (result?.success) {
        fetchData();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-(--foreground) tracking-tight">PORTAL</h1>
            <p className="text-(--muted) font-medium">Manage your portfolio of premium assets.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleFixPermissions}
              disabled={fixingPermissions}
              className="flex items-center gap-2 px-6 py-4 border-2 border-[var(--border)] text-[var(--foreground)] rounded-2xl font-bold transition-all hover:bg-red-50 disabled:opacity-50"
              title="Fix 403 Forbidden errors"
            >
              {fixingPermissions ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldAlert className="w-5 h-5 text-red-500" />}
              FIX PERMISSIONS
            </button>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-8 py-4 bg-(--foreground) text-white rounded-2xl font-bold transition-all hover:bg-(--foreground)/90 shadow-xl shadow-(--foreground)/20"
            >
              <Plus className="w-5 h-5 text-(--accent)" />
              NEW {activeTab === "properties" ? "LISTING" : "PERFUME"}
            </button>
          </div>
        </header>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("properties")}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'properties' ? 'bg-(--accent) text-white shadow-lg' : 'bg-white text-(--muted) hover:bg-gray-50 border border-(--border)'}`}
          >
            <HomeIcon className="w-5 h-5" /> Properties
          </button>
          <button
            onClick={() => setActiveTab("perfumes")}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'perfumes' ? 'bg-(--accent) text-white shadow-lg' : 'bg-white text-(--muted) hover:bg-gray-50 border border-(--border)'}`}
          >
            <Droplet className="w-5 h-5" /> Perfumes
          </button>
        </div>

        <section>
          {fetching ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-12 h-12 text-(--accent) animate-spin" />
              <p className="text-(--muted) font-bold tracking-widest text-xs">SYNCHRONIZING...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-(--border)">
              <p className="text-(--muted) font-medium italic">No active {activeTab === "properties" ? "advertisements" : "perfumes"}. Click "New" to begin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <motion.div 
                  layout
                  key={item._id}
                  className="bg-white rounded-3xl overflow-hidden border border-(--border) shadow-sm hover:shadow-xl transition-all group cursor-pointer"
                  onClick={() => handleOpenModal(item)}
                >
                  <div className="aspect-16/10 bg-gray-100 relative overflow-hidden">
                    {item.media?.[0] ? (
                      item.media[0].type === "video" ? (
                        <video src={item.media[0].url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={item.media[0].url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleOpenModal(item); }}
                          className="p-3 bg-white text-(--foreground) rounded-full hover:bg-(--accent) transition-colors shadow-lg"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(item._id, e)}
                          className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-black text-(--foreground) text-lg line-clamp-1 mb-1">{item.title || "UNTITLED"}</h3>
                    {activeTab === "properties" && (
                      <p className="text-(--muted) text-sm font-bold tracking-wide mb-4">{item.location || "LOCATION NOT SPECIFIED"}</p>
                    )}
                    <div className={`flex justify-between items-center ${activeTab === 'properties' ? 'pt-4 border-t border-(--border)' : 'pt-2'}`}>
                      {item.price && <span className="text-(--accent) font-black">{item.price}</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-(--foreground)/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white/20"
              >
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-(--foreground)" />
                </button>

                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-black text-(--foreground) tracking-tight uppercase">
                    {editingItem ? `Update ${activeTab === "properties" ? "Advertisement" : "Perfume"}` : `New ${activeTab === "properties" ? "Advertisement" : "Perfume"}`}
                  </h2>
                  <p className="text-(--muted) font-medium mt-1">
                    {editingItem ? "Modify the existing details." : "Populate the fields to showcase a new asset."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-(--foreground) tracking-widest uppercase ml-1">Title</label>
                      <input
                        name="title"
                        defaultValue={editingItem?.title || ""}
                        placeholder={activeTab === "properties" ? "e.g. Modern Villa with Pool" : "e.g. Midnight Oud"}
                        className="w-full px-6 py-4 rounded-2xl border border-(--border) focus:ring-2 focus:ring-(--accent) outline-none transition-all font-semibold"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-(--foreground) tracking-widest uppercase ml-1">Price</label>
                      <input
                        name="price"
                        defaultValue={editingItem?.price || ""}
                        placeholder={activeTab === "properties" ? "e.g. $1,200,000" : "e.g. $150"}
                        className="w-full px-6 py-4 rounded-2xl border border-(--border) focus:ring-2 focus:ring-(--accent) outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>

                  {activeTab === "properties" && (
                    <div className="space-y-3">
                      <label className="text-xs font-black text-(--foreground) tracking-widest uppercase ml-1">Location</label>
                      <input
                        name="location"
                        defaultValue={editingItem?.location || ""}
                        placeholder="e.g. Beverly Hills, CA"
                        className="w-full px-6 py-4 rounded-2xl border border-(--border) focus:ring-2 focus:ring-(--accent) outline-none transition-all font-semibold"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-xs font-black text-(--foreground) tracking-widest uppercase ml-1">Description</label>
                    <textarea
                      name="description"
                      rows={4}
                      defaultValue={editingItem?.description || ""}
                      placeholder={activeTab === "properties" ? "Describe the luxury details..." : "Describe the scent profile..."}
                      className="w-full px-6 py-4 rounded-2xl border border-(--border) focus:ring-2 focus:ring-(--accent) outline-none transition-all font-semibold"
                    />
                  </div>

                  {activeTab === "properties" && (
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-(--foreground) tracking-widest uppercase ml-1">Beds</label>
                        <input name="beds" type="number" defaultValue={editingItem?.specs?.beds || ""} className="w-full px-6 py-4 rounded-2xl border border-(--border) font-semibold" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-(--foreground) tracking-widest uppercase ml-1">Baths</label>
                        <input name="baths" type="number" defaultValue={editingItem?.specs?.baths || ""} className="w-full px-6 py-4 rounded-2xl border border-(--border) font-semibold" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-(--foreground) tracking-widest uppercase ml-1">Area (sq ft)</label>
                        <input name="area" placeholder="e.g. 4,500" defaultValue={editingItem?.specs?.area || ""} className="w-full px-6 py-4 rounded-2xl border border-(--border) font-semibold" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-xs font-black text-(--foreground) tracking-widest uppercase ml-1">
                      {editingItem ? "Add More Media (Optional)" : "Media (Images & Videos)"}
                    </label>
                    <div className="border-2 border-dashed border-(--border) rounded-4xl p-12 text-center hover:border-(--accent) transition-all cursor-pointer relative bg-gray-50/50">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-white rounded-full shadow-md">
                          <Plus className="w-8 h-8 text-(--accent)" />
                        </div>
                        <p className="text-(--muted) text-sm font-bold tracking-widest uppercase">Click or drag media</p>
                      </div>
                    </div>

                    {existingMedia.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <p className="text-xs font-black text-(--foreground) uppercase tracking-widest">
                          Existing Media — Click ✕ to Remove
                        </p>
                        <div className="grid grid-cols-4 gap-4">
                          {existingMedia.map((item: any, index: number) => (
                            <div key={index} className="relative group rounded-2xl overflow-hidden aspect-square border-2 border-(--border) shadow-sm">
                              {item.type === "video" ? (
                                <video src={item.url} className="w-full h-full object-cover" />
                              ) : (
                                <img src={item.url} alt={`existing-${index}`} className="w-full h-full object-cover" />
                              )}
                              <button
                                type="button"
                                onClick={() => removeExistingMedia(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {previews.length > 0 && (
                      <div className="grid grid-cols-4 gap-4 mt-6">
                        {previews.map((src, index) => (
                          <div key={index} className="relative group rounded-2xl overflow-hidden aspect-square border border-(--border) shadow-sm">
                            {files[index]?.type?.startsWith("video") ? (
                              <video src={src} className="w-full h-full object-cover" />
                            ) : (
                              <img src={src} alt="preview" className="w-full h-full object-cover" />
                            )}
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg"
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
                      className="w-full py-5 bg-(--foreground) text-(--accent) rounded-2xl font-black text-xs tracking-[0.3em] hover:opacity-90 transition-all disabled:opacity-50 shadow-2xl shadow-(--foreground)/20 uppercase"
                    >
                      {loading ? "TRANSMITTING DATA..." : editingItem ? "SAVE CHANGES" : "PUBLISH"}
                    </button>
                  </div>

                  {message && (
                    <p className={`text-center mt-6 font-bold tracking-widest text-xs uppercase ${message.includes("Error") || message.includes("failed") ? "text-red-500" : "text-(--accent)"}`}>
                      {message}
                    </p>
                  )}
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
