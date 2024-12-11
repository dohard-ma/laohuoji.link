"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tag } from "@prisma/client";
import TagSelection from "./TagSelection";

interface FormData {
  email: string;
  password: string;
  name?: string;
  bio?: string;
  specialties?: string;
  needs?: string;
}

export default function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<"form" | "tags">("form");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    bio: "",
    specialties: "",
    needs: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSkillTags, setSelectedSkillTags] = useState<Tag[]>([]);
  const [selectedNeedTags, setSelectedNeedTags] = useState<Tag[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
        } else if (result?.ok) {
          router.push("/");
          router.refresh();
        }
      } else {
        if (step === "form") {
          // 进入标签选择步骤
          setStep("tags");
        } else {
          // 完成注册
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              avatar: `/api/avatar?name=${formData.name}`,
              skillTags: selectedSkillTags,
              needTags: selectedNeedTags,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            setError(data.error);
          } else {
            // 注册成功后自动登录
            const result = await signIn("credentials", {
              email: formData.email,
              password: formData.password,
              redirect: false,
            });

            if (result?.ok) {
              router.push("/");
              router.refresh();
            }
          }
        }
      }
    } catch (err) {
      setError("操作失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  if (!isLogin && step === "tags") {
    return (
      <TagSelection
        onSubmit={handleSubmit}
        onBack={() => setStep("form")}
        onSkillTagsChange={setSelectedSkillTags}
        onNeedTagsChange={setSelectedNeedTags}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
                minLength={2}
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
                rows={3}
                minLength={10}
                maxLength={200}
                placeholder="简单介绍一下自己吧..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">擅长领域</label>
              <textarea
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="描述你的专长和可以提供的资源..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">需求领域</label>
              <textarea
                value={formData.needs}
                onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="描述你的需求和想学习的内容..."
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          disabled={loading}
        >
          {loading ? "处理中..." : isLogin ? "登录" : "注册"}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-500 hover:underline"
            disabled={loading}
          >
            {isLogin ? "没有账号？点击注册" : "已有账号？点击登录"}
          </button>
        </div>
      </form>
    </div>
  );
}
