"use client";

import { useMemo } from "react";

interface SyllabusItem {
  title: string;
  content: string;
  date?: string;
}

interface Props {
  syllabus: string | null;
}

export default function CourseContent({ syllabus }: Props) {
  const syllabusData = useMemo(() => {
    if (!syllabus) return [];
    try {
      return JSON.parse(syllabus) as SyllabusItem[];
    } catch (error) {
      console.error("解析课程大纲失败:", error);
      return [];
    }
  }, [syllabus]);

  if (!syllabusData.length) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">课程大纲</h2>
        <p className="text-gray-500">暂无课程大纲</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">课程大纲</h2>
      <div className="border rounded-lg overflow-hidden divide-y">
        {syllabusData.map((item, index) => (
          <div key={index} className="p-4 bg-white hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">{item.title}</h3>
              {item.date && <span className="text-sm text-gray-500">{item.date}</span>}
            </div>
            <p className="text-gray-600">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
