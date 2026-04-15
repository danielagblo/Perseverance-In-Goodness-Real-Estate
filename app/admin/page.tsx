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
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-(--border)/20 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-(--foreground) tracking-tighter uppercase">Administration</h1>
            <p className="text-(--muted) text-xs font-bold tracking-[0.2em] uppercase mt-2">Manage your exclusive portfolio</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={handleFixPermissions}
              disabled={fixingPermissions}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 border-[1px] border-(--foreground) text-(--foreground) rounded-none hover:bg-(--foreground) hover:text-[#FDFBF7] transition-all font-bold text-[10px] tracking-widest uppercase disabled:opacity-50"
              title="Fix 403 Forbidden errors"
            >
              {fixingPermissions ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
              FIX PERMISSIONS
            </button>
            <button 
              onClick={() => handleOpenModal()}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-(--foreground) text-[#FDFBF7] border-[1px] border-(--foreground) rounded-none hover:bg-transparent hover:text-(--foreground) transition-all font-bold text-[10px] tracking-widest uppercase"
            >
              <Plus className="w-4 h-4" />
              NEW {activeTab === "properties" ? "LISTING" : "PERFUME"}
            </button>
          </div>
        </header>

        <div className="flex gap-8 mb-10 border-b border-(--border)/10">
          <button
            onClick={() => setActiveTab("properties")}
            className={`pb-4 text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'properties' ? 'text-(--foreground) border-b-2 border-(--foreground)' : 'text-(--muted) hover:text-(--foreground)'}`}
          >
            <HomeIcon className="w-4 h-4" /> Properties
          </button>
          <button
            onClick={() => setActiveTab("perfumes")}
            className={`pb-4 text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'perfumes' ? 'text-(--foreground) border-b-2 border-(--foreground)' : 'text-(--muted) hover:text-(--foreground)'}`}
          >
            <Droplet className="w-4 h-4" /> Perfumes
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
                    className="bg-transparent border-[1px] border-(--border)/30 group cursor-pointer hover:border-(--foreground) transition-all flex flex-col"
                    onClick={() => handleOpenModal(item)}
                  >
                    <div className="aspect-square relative overflow-hidden bg-white/50 border-b border-(--border)/30 p-2">
                      {item.media?.[0] ? (
                        item.media[0].type === "video" ? (
                          <video src={item.media[0].url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={item.media[0].url} alt={item.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.03] transition-transform duration-700" />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon className="w-8 h-8" strokeWidth={1} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleOpenModal(item); }}
                          className="p-4 bg-[#FDFBF7] text-(--foreground) hover:bg-(--foreground) hover:text-[#FDFBF7] border border-(--foreground) transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(item._id, e)}
                          className="p-4 bg-[#FDFBF7] text-red-500 hover:bg-red-500 hover:text-[#FDFBF7] border border-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-black text-(--foreground) text-lg line-clamp-1 mb-1 uppercase tracking-tight">{item.title || "UNTITLED"}</h3>
                      {activeTab === "properties" && (
                        <p className="text-(--muted) text-[10px] uppercase font-bold tracking-widest line-clamp-1 mb-4">{item.location || "LOCATION NOT SPECIFIED"}</p>
                      )}
                      <div className="mt-auto pt-4 flex justify-between items-center border-t border-(--border)/20">
                        {item.price && <span className="text-(--foreground) font-light tracking-wide">{item.price}</span>}
                        <span className="text-[9px] text-(--muted) font-bold tracking-[0.2em] uppercase cursor-pointer hover:text-(--foreground)">Edit Details</span>
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
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="relative bg-[#FDFBF7] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-none shadow-2xl p-8 md:p-14 border-[1px] border-(--border)/20"
              >
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 p-2 text-(--foreground) hover:opacity-50 transition-opacity"
                >
                  <X className="w-8 h-8" strokeWidth={1} />
                </button>

                <div className="mb-12 border-b border-(--border)/20 pb-6">
                  <h2 className="text-3xl font-black text-(--foreground) tracking-tighter uppercase">
                    {editingItem ? `Update ${activeTab === "properties" ? "Advertisement" : "Product"}` : `New ${activeTab === "properties" ? "Advertisement" : "Product"}`}
                  </h2>
                  <p className="text-(--muted) font-bold text-[10px] tracking-[0.2em] uppercase mt-2">
                    {editingItem ? "Modify the existing details." : "Populate the fields to showcase a new asset."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-(--muted) tracking-[0.2em] uppercase">Title</label>
                      <input
                        name="title"
                        defaultValue={editingItem?.title || ""}
                        placeholder={activeTab === "properties" ? "e.g. Modern Villa with Pool" : "e.g. Midnight Oud"}
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-(--border)/30 focus:border-(--foreground) focus:ring-0 outline-none transition-colors font-light text-xl"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-(--muted) tracking-[0.2em] uppercase">Price</label>
                      <input
                        name="price"
                        defaultValue={editingItem?.price || ""}
                        placeholder={activeTab === "properties" ? "e.g. $1,200,000" : "e.g. $150"}
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-(--border)/30 focus:border-(--foreground) focus:ring-0 outline-none transition-colors font-light text-xl"
                      />
                    </div>
                  </div>

                  {activeTab === "properties" && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-(--muted) tracking-[0.2em] uppercase">Location</label>
                      <input
                        name="location"
                        defaultValue={editingItem?.location || ""}
                        placeholder="e.g. Beverly Hills, CA"
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-(--border)/30 focus:border-(--foreground) focus:ring-0 outline-none transition-colors font-light text-xl"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-(--muted) tracking-[0.2em] uppercase">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={editingItem?.description || ""}
                      placeholder={activeTab === "properties" ? "Describe the luxury details..." : "Describe the scent profile..."}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-(--border)/30 focus:border-(--foreground) focus:ring-0 outline-none transition-colors font-light text-lg resize-none"
                    />
                  </div>

                  {activeTab === "properties" && (
                    <div className="grid grid-cols-3 gap-8 md:gap-12 pt-4">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-(--muted) tracking-[0.2em] uppercase">Beds</label>
                        <input name="beds" type="number" defaultValue={editingItem?.specs?.beds || ""} className="w-full px-0 py-2 bg-transparent border-0 border-b border-(--border)/30 focus:border-(--foreground) focus:ring-0 outline-none font-light text-2xl" />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-(--muted) tracking-[0.2em] uppercase">Baths</label>
                        <input name="baths" type="number" defaultValue={editingItem?.specs?.baths || ""} className="w-full px-0 py-2 bg-transparent border-0 border-b border-(--border)/30 focus:border-(--foreground) focus:ring-0 outline-none font-light text-2xl" />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-(--muted) tracking-[0.2em] uppercase">Area (sq ft)</label>
                        <input name="area" placeholder="e.g. 4,500" defaultValue={editingItem?.specs?.area || ""} className="w-full px-0 py-2 bg-transparent border-0 border-b border-(--border)/30 focus:border-(--foreground) focus:ring-0 outline-none font-light text-2xl" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 pt-4">
                    <label className="text-[10px] font-bold text-(--muted) tracking-[0.2em] uppercase flex items-center justify-between border-b border-(--border)/20 pb-2">
                      <span>{editingItem ? "Media Library" : "Attach Media"}</span>
                      <span className="font-light text-(--muted)">Images & Videos</span>
                    </label>
                    <div className="border-[1px] border-dashed border-(--foreground)/30 p-12 text-center hover:border-(--foreground) transition-all cursor-pointer relative bg-transparent">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center space-y-4">
                        <Plus className="w-8 h-8 text-(--foreground) opacity-50" strokeWidth={1} />
                        <p className="text-(--foreground) text-[10px] font-bold tracking-[0.2em] uppercase">Click or drag media</p>
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

                  <div className="pt-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-(--foreground) border-[1px] border-(--foreground) text-[#FDFBF7] font-bold text-[10px] tracking-[0.3em] hover:bg-transparent hover:text-(--foreground) transition-all disabled:opacity-50 uppercase"
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
