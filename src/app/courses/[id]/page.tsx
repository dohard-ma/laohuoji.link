// 实现：
// - 课程详细信息展示
// - 微信群二维码展示
// - 评论系统
// - 每日内容摘要
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import CommentSection from "./components/CommentSection";
import CourseContent from "./components/CourseContent";
import { Metadata } from "next";

type Props = {
  params: { id: string };
};

// 动态生成页面元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!course) {
    return {
      title: "课程不存在",
    };
  }

  return {
    title: `${course.title} - 姜胡说`,
    description: course.description,
  };
}

export default async function CoursePage({ params }: Props) {
  const course = await prisma.product.findUnique({
    where: {
      id: params.id,
      type: "course", // 确保是课程类型
    },
    include: {
      tags: true,
      comments: {
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧主要内容 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 课程封面 */}
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={course.imageUrl || "/default-course.jpg"}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>

          {/* 课程标题和描述 */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {course.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <p className="text-gray-600 whitespace-pre-line">{course.description}</p>
          </div>

          {/* 课程大纲 */}
          <CourseContent syllabus={course.syllabus} />

          {/* 评论区 */}
          <CommentSection comments={course.comments} courseId={course.id} />
        </div>

        {/* 右侧信息栏 */}
        <div className="space-y-6">
          {/* 价格信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600 mb-4">¥{course.price.toFixed(2)}</div>
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
              立即购买
            </button>
          </div>

          {/* 微信群二维码 */}
          {course.qrCode && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">加入学习群</h3>
              <div className="relative aspect-square">
                <Image src={course.qrCode} alt="微信群二维码" fill className="object-contain" />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">扫码加入课程微信群</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
