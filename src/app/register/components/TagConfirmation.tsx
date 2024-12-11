"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { classifyTag } from "@/lib/ai";

interface TagSuggestion {
  tag: string;
  type: "specialty" | "need";
  confidence: number;
}

interface Props {
  suggestions: TagSuggestion[];
  onComplete: () => void;
}

export default function TagConfirmation({ suggestions, onComplete }: Props) {
  const { data: session } = useSession();
  const [selectedSkillTags, setSelectedSkillTags] = useState<string[]>(
    suggestions.filter((s) => s.type === "specialty").map((s) => s.tag)
  );
  const [selectedNeedTags, setSelectedNeedTags] = useState<string[]>(
    suggestions.filter((s) => s.type === "need").map((s) => s.tag)
  );
  const [newSkillTag, setNewSkillTag] = useState("");
  const [newNeedTag, setNewNeedTag] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${session.user.id}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillTags: selectedSkillTags,
          needTags: selectedNeedTags,
        }),
      });

      if (res.ok) {
        onComplete();
      }
    } catch (error) {
      console.error("更新标签失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (name: string, type: "skill" | "need") => {
    try {
      const classification = await classifyTag(name);

      const confidence = type === classification.category ? classification.confidence : 0.5;

      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category: type,
          level: 1,
          aiCategory: classification.category,
          aiConfidence: confidence,
        }),
      });

      if (!res.ok) {
        throw new Error("创建标签失败");
      }

      const tag = await res.json();
      return tag;
    } catch (error) {
      console.error("创建标签失败:", error);
      return null;
    }
  };

  const handleAddSkillTag = async () => {
    if (!newSkillTag.trim()) return;

    const tag = await createTag(newSkillTag.trim(), "skill");
    if (tag) {
      setSelectedSkillTags((prev) => [...prev, tag.name]);
      setNewSkillTag("");
    }
  };

  const handleAddNeedTag = async () => {
    if (!newNeedTag.trim()) return;

    const tag = await createTag(newNeedTag.trim(), "need");
    if (tag) {
      setSelectedNeedTags((prev) => [...prev, tag.name]);
      setNewNeedTag("");
    }
  };

  const skillSuggestions = suggestions.filter((s) => s.type === "specialty");
  const needSuggestions = suggestions.filter((s) => s.type === "need");

  return (
    <div className="space-y-8">
      {/* 技能标签部分 */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">技能标签</h2>
        <div className="flex flex-wrap gap-2">
          {skillSuggestions.map((suggestion) => (
            <Badge
              key={suggestion.tag}
              variant={selectedSkillTags.includes(suggestion.tag) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => {
                setSelectedSkillTags((prev) =>
                  prev.includes(suggestion.tag)
                    ? prev.filter((t) => t !== suggestion.tag)
                    : [...prev, suggestion.tag]
                );
              }}
            >
              {suggestion.tag}
              <span
                className={cn(
                  "ml-1 opacity-50",
                  selectedSkillTags.includes(suggestion.tag)
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                {(suggestion.confidence * 100).toFixed(0)}%
              </span>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkillTag}
            onChange={(e) => setNewSkillTag(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md"
            placeholder="添加新的技能标签..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkillTag();
              }
            }}
          />
          <Button onClick={handleAddSkillTag}>添加</Button>
        </div>
      </div>

      {/* 需求标签部分 */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">需求标签</h2>
        <div className="flex flex-wrap gap-2">
          {needSuggestions.map((suggestion) => (
            <Badge
              key={suggestion.tag}
              variant={selectedNeedTags.includes(suggestion.tag) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => {
                setSelectedNeedTags((prev) =>
                  prev.includes(suggestion.tag)
                    ? prev.filter((t) => t !== suggestion.tag)
                    : [...prev, suggestion.tag]
                );
              }}
            >
              {suggestion.tag}
              <span
                className={cn(
                  "ml-1 opacity-50",
                  selectedNeedTags.includes(suggestion.tag)
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                {(suggestion.confidence * 100).toFixed(0)}%
              </span>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newNeedTag}
            onChange={(e) => setNewNeedTag(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md"
            placeholder="添加新的需求标签..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddNeedTag();
              }
            }}
          />
          <Button onClick={handleAddNeedTag}>添加</Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "保存中..." : "完成"}
        </Button>
      </div>
    </div>
  );
}
