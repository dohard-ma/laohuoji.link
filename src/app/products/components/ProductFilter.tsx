"use client";

import { Tag } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

type TagWithCount = {
  id: string;
  name: string;
  count: number;
};

type ProductFilterProps = {
  tags: TagWithCount[];
};

export default function ProductFilter({ tags }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const selectedTag = searchParams.get("tag") || "";

  const debouncedSearch = useDebounce((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("query", value);
      params.delete("tag");
    } else {
      params.delete("query");
    }
    router.push(`/products?${params.toString()}`);
  }, 300);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleTagChange = (tagId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tagId) {
      params.set("tag", tagId);
      params.delete("query");
      setSearchQuery("");
    } else {
      params.delete("tag");
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">搜索</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="搜索课程和产品..."
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">标签筛选</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleTagChange("")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
              !selectedTag ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
            }`}
          >
            全部
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagChange(tag.id)}
              className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedTag === tag.id ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
              }`}
            >
              {tag.name}
              <span className="text-sm text-gray-500 ml-2">({tag.count})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
