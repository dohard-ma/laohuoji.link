"use client";

import { useState } from "react";
import { User, Tag, Badge } from "@prisma/client";
import Image from "next/image";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import BadgeList from "./BadgeList";
import { useRouter } from "next/navigation";
import TagSelector from "./TagSelector";

type UserWithRelations = User & {
  skillTags: Tag[];
  needTags: Tag[];
  badges: Badge[];
};

interface Props {
  user: UserWithRelations;
  availableTags: Tag[];
  readOnly?: boolean;
}

export default function ProfileForm({ user, availableTags, readOnly = false }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    specialties: user.specialties || "",
    needs: user.needs || "",
    skillTags: user.skillTags || [],
    needTags: user.needTags || [],
  });
  const [openSkills, setOpenSkills] = useState(false);
  const [openNeeds, setOpenNeeds] = useState(false);

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
              sizes="(max-width: 96px) 100vw, 96px"
              priority
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
        {!readOnly && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {isEditing ? "取消" : "编辑"}
          </button>
        )}
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

        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">擅长领域描述</label>
            {isEditing ? (
              <textarea
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="描述你的专长和可以提供的资源..."
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-line">{formData.specialties}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">技能标签</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skillTags.map((tag) => (
                <UIBadge key={tag.id} variant="default" className="text-sm">
                  {tag.name}
                  {isEditing && (
                    <button
                      className="ml-1 hover:text-red-500"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          skillTags: formData.skillTags.filter((t) => t.id !== tag.id),
                        });
                      }}
                    >
                      ×
                    </button>
                  )}
                </UIBadge>
              ))}
            </div>
            {isEditing && (
              <TagSelector
                availableTags={availableTags}
                selectedTags={formData.skillTags}
                onSelect={(tag) => {
                  setFormData((prev) => ({
                    ...prev,
                    skillTags: [...prev.skillTags, tag],
                  }));
                }}
                open={openSkills}
                onOpenChange={setOpenSkills}
                placeholder="选择技能标签..."
              />
            )}
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">需求领域描述</label>
            {isEditing ? (
              <textarea
                value={formData.needs}
                onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="描述你的需求和想学习的内容..."
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-line">{formData.needs}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">需求标签</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.needTags.map((tag) => (
                <UIBadge key={tag.id} variant="secondary" className="text-sm">
                  {tag.name}
                  {isEditing && (
                    <button
                      className="ml-1 hover:text-red-500"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          needTags: formData.needTags.filter((t) => t.id !== tag.id),
                        });
                      }}
                    >
                      ×
                    </button>
                  )}
                </UIBadge>
              ))}
            </div>
            {isEditing && (
              <TagSelector
                availableTags={availableTags}
                selectedTags={formData.needTags}
                onSelect={(tag) => {
                  setFormData((prev) => ({
                    ...prev,
                    needTags: [...prev.needTags, tag],
                  }));
                }}
                open={openNeeds}
                onOpenChange={setOpenNeeds}
                placeholder="选择需求标签..."
              />
            )}
          </div>
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
