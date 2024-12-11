"use client";

import { useState, useEffect } from "react";
import { Tag } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void;
  onSkillTagsChange: (tags: Tag[]) => void;
  onNeedTagsChange: (tags: Tag[]) => void;
  loading: boolean;
  error?: string;
}

export default function TagSelection({
  onSubmit,
  onBack,
  onSkillTagsChange,
  onNeedTagsChange,
  loading,
  error,
}: Props) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedSkillTags, setSelectedSkillTags] = useState<Tag[]>([]);
  const [selectedNeedTags, setSelectedNeedTags] = useState<Tag[]>([]);

  useEffect(() => {
    // 获取可用标签
    fetch("/api/tags")
      .then((res) => res.json())
      .then((tags) => setAvailableTags(tags))
      .catch(console.error);
  }, []);

  const handleSkillTagToggle = (tag: Tag) => {
    setSelectedSkillTags((prev) => {
      const newTags = prev.some((t) => t.id === tag.id)
        ? prev.filter((t) => t.id !== tag.id)
        : [...prev, tag];
      onSkillTagsChange(newTags);
      return newTags;
    });
  };

  const handleNeedTagToggle = (tag: Tag) => {
    setSelectedNeedTags((prev) => {
      const newTags = prev.some((t) => t.id === tag.id)
        ? prev.filter((t) => t.id !== tag.id)
        : [...prev, tag];
      onNeedTagsChange(newTags);
      return newTags;
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold">选择你的标签</h2>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-6">{error}</div>}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">你擅长什么？</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedSkillTags.some((t) => t.id === tag.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleSkillTagToggle(tag)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">你想学什么？</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedNeedTags.some((t) => t.id === tag.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleNeedTagToggle(tag)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          onClick={onSubmit}
          disabled={loading || !selectedSkillTags.length || !selectedNeedTags.length}
          className="w-full"
        >
          {loading ? "注册中..." : "完成注册"}
        </Button>
      </div>
    </div>
  );
}
