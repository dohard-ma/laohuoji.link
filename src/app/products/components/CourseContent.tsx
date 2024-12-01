"use client";

import { useState } from "react";

type Syllabus = {
  title: string;
  content: string;
  date?: string;
}[];

type Props = {
  syllabus: Syllabus | null;
};

export default function CourseContent({ syllabus }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!syllabus) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">课程大纲</h2>
      <div className="border rounded-lg overflow-hidden">
        {syllabus.map((item, index) => (
          <div key={index} className="border-b last:border-b-0">
            <button
              onClick={() => setActiveIndex(index)}
              className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500">Day {index + 1}</span>
                  <span className="font-medium">{item.title}</span>
                </div>
                {item.date && <span className="text-sm text-gray-500">{item.date}</span>}
              </div>
            </button>
            {activeIndex === index && (
              <div className="px-6 py-4 bg-gray-50">
                <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
