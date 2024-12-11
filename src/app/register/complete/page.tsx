"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { analyzeProfile } from "@/lib/ai";
import TagConfirmation from "../components/TagConfirmation";
import { Tag } from "@prisma/client";

interface TagSuggestion {
  tag: string;
  type: "specialty" | "need";
  confidence: number;
}

export default function RegisterCompletePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([]);
  const [step, setStep] = useState<"analyzing" | "confirming">("analyzing");

  // 在组件加载时分析用户资料
  useEffect(() => {
    if (!session?.user?.id) {
      router.push("/auth");
      return;
    }

    async function analyzeTags() {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${session.user.id}`);
        if (!res.ok) {
          throw new Error("获取用户信息失败");
        }

        const user = await res.json();

        // 分析用户描述，生成标签建议
        const analysis = await analyzeProfile({
          bio: user.bio,
          specialties: user.specialties,
          needs: user.needs,
        });

        // 确保返回的标签类型正确
        const typedSuggestions: TagSuggestion[] = analysis.suggestions.map((s) => ({
          ...s,
          type: s.type as "specialty" | "need", // 类型断言
        }));

        setSuggestions(typedSuggestions);
        setStep("confirming");
      } catch (error) {
        console.error("分析失败:", error);
      } finally {
        setLoading(false);
      }
    }

    analyzeTags();
  }, [session?.user?.id, router]);

  if (loading || step === "analyzing") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">正在分析你的资料...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">完善你的标签</h1>
      <TagConfirmation
        suggestions={suggestions}
        onComplete={() => {
          router.push("/members");
          router.refresh();
        }}
      />
    </div>
  );
}
