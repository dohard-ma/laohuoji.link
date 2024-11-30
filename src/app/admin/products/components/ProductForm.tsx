"use client";

import { Tag } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type ProductFormProps = {
  tags: Tag[];
};

export default function ProductForm({ tags }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "course",
    tagIds: [] as string[],
  });

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cover" | "qrcode"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 创建预览
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "cover") {
        setImagePreview(reader.result as string);
      } else {
        setQrCodePreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      const coverInput = e.currentTarget.querySelector('input[name="cover"]') as HTMLInputElement;
      const qrCodeInput = e.currentTarget.querySelector('input[name="qrcode"]') as HTMLInputElement;

      // 添加封面图片
      if (coverInput.files?.[0]) {
        formDataToSend.append("cover", coverInput.files[0]);
      }

      // 添加二维码图片
      if (qrCodeInput.files?.[0]) {
        formDataToSend.append("qrcode", qrCodeInput.files[0]);
      }

      // 添加其他数据
      formDataToSend.append(
        "data",
        JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        })
      );

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) throw new Error("提交失败");

      // 重置表单
      setFormData({
        title: "",
        description: "",
        price: "",
        type: "course",
        tagIds: [],
      });
      setImagePreview(null);
      setQrCodePreview(null);
      if (coverInput) coverInput.value = "";
      if (qrCodeInput) qrCodeInput.value = "";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">价格</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="course">课程</option>
              <option value="product">产品</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
            <select
              multiple
              value={formData.tagIds}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tagIds: Array.from(e.target.selectedOptions, (option) => option.value),
                })
              }
              className="w-full px-3 py-2 border rounded-md"
              size={5}
            >
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">封面图片</label>
            <input
              type="file"
              name="cover"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "cover")}
              className="w-full"
              required
            />
            {imagePreview && (
              <div className="mt-4 relative aspect-video">
                <Image src={imagePreview} alt="预览" fill className="object-cover rounded-md" />
              </div>
            )}
          </div>

          {formData.type === "course" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">微信群二维码</label>
              <input
                type="file"
                name="qrcode"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "qrcode")}
                className="w-full"
              />
              {qrCodePreview && (
                <div className="mt-4 relative aspect-square w-48 mx-auto">
                  <Image
                    src={qrCodePreview}
                    alt="二维码预览"
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
              )}
            </div>
          )}
        </div>
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
