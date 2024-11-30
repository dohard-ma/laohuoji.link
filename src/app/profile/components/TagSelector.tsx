"use client";

import { useState, useEffect } from "react";
import { Tag } from "@prisma/client";

type TagSelectorProps = {
  category: string;
  selected: string[];
  onChange: (tags: string[]) => void;
};

export default function TagSelector({ category, selected, onChange }: TagSelectorProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  // 加载标签建议
  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const loadSuggestions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/tags?category=${category}&query=${encodeURIComponent(input)}`
        );
        if (res.ok) {
          const tags = await res.json();
          setSuggestions(tags);
        }
      } catch (error) {
        console.error("加载标签失败:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadSuggestions, 300);
    return () => clearTimeout(timer);
  }, [input, category]);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      const tagName = input.trim();

      // 如果标签已存在于选中列表，直接返回
      if (selected.includes(tagName)) {
        setInput("");
        return;
      }

      try {
        // 尝试创建新标签
        const res = await fetch("/api/tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: tagName, category }),
        });

        if (res.ok) {
          onChange([...selected, tagName]);
          setInput("");
        }
      } catch (error) {
        console.error("创建标签失败:", error);
      }
    }
  };

  const addTag = (tagName: string) => {
    if (!selected.includes(tagName)) {
      onChange([...selected, tagName]);
    }
    setInput("");
    setSuggestions([]);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(selected.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selected.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm flex items-center"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜索标签或按回车创建新标签"
          className="w-full px-3 py-2 border rounded-md"
        />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            {suggestions.map((tag) => (
              <button
                key={tag.id}
                onClick={() => addTag(tag.name)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
