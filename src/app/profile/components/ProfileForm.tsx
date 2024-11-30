"use client";

import { useState } from "react";
import { User, Tag, Badge } from "@prisma/client";
import Image from "next/image";
import TagSelector from "./TagSelector";
import BadgeList from "./BadgeList";
import { useRouter } from "next/navigation";

type ProfileFormProps = {
  user: User & {
    tags: Tag[];
    badges: Badge[];
  };
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    specialties: user.specialties || [],
    needs: user.needs || [],
  });
  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "上传失败");
      }

      const data = await res.json();
      await updateProfile({ avatar: data.url });
      router.refresh();
    } catch (error) {
      console.error("上传失败:", error);
      alert(error instanceof Error ? error.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("更新失败:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24">
            <Image
              src={user.avatar || "/default-avatar.png"}
              alt="头像"
              fill
              className="rounded-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md">
            <span>更换头像</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {isEditing ? "取消" : "编辑"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          ) : (
            <p>{formData.name || "未设置"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          ) : (
            <p>{formData.bio || "未设置"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">擅长领域</label>
          {isEditing ? (
            <TagSelector
              category="specialty"
              selected={formData.specialties}
              onChange={(tags) => setFormData({ ...formData, specialties: tags })}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {formData.specialties.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">需求领域</label>
          {isEditing ? (
            <TagSelector
              category="need"
              selected={formData.needs}
              onChange={(tags) => setFormData({ ...formData, needs: tags })}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {formData.needs.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">勋章</h3>
          <BadgeList badges={user.badges} />
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              保存
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
