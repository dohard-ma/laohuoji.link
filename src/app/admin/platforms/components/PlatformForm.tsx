"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PlatformForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 创建预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      const iconInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;

      if (iconInput.files?.[0]) {
        formDataToSend.append("icon", iconInput.files[0]);
      }

      formDataToSend.append("data", JSON.stringify(formData));

      const res = await fetch("/api/admin/platforms", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) throw new Error("提交失败");

      // 重置表单
      setFormData({ name: "" });
      setImagePreview(null);
      if (iconInput) iconInput.value = "";

      // 刷新列表
      router.refresh();
    } catch (error) {
      console.error("提交失败:", error);
      alert("提交失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">平台名称</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">平台图标</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
          required
        />
        {imagePreview && (
          <div className="mt-4 relative w-20 h-20">
            <Image src={imagePreview} alt="预览" fill className="object-contain rounded-md" />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white ${
            loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "提交中..." : "提交"}
        </button>
      </div>
    </form>
  );
}
