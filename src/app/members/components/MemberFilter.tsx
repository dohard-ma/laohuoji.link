"use client";

import { Tag } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

type MemberFilterProps = {
  tags: Tag[];
};

export default function MemberFilter({ tags }: MemberFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const selectedTag = searchParams.get("tags") || "";

  const debouncedSearch = useDebounce((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    router.push(`/members?${params.toString()}`);
  }, 300);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleTagChange = (tagName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tagName) {
      params.set("tags", tagName);
    } else {
      params.delete("tags");
    }
    router.push(`/members?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">搜索</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="搜索成员..."
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">标签筛选</h3>
        <select
          value={selectedTag}
          onChange={(e) => handleTagChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-white"
        >
          <option value="">全部标签</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.name}>
              {tag.name}
              {tag.count > 0 && ` (${tag.count})`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
