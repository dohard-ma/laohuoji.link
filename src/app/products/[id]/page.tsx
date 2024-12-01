import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import CommentSection from "../components/CommentSection";
import CourseContent from "../components/CourseContent";
import { Metadata } from "next";
import { Product, Tag, Comment, Platform } from "@prisma/client";
import GroupMessages from "../components/GroupMessages";

type Props = {
  params: { id: string };
};

type ProductWithRelations = Product & {
  tags: Tag[];
  platform: Platform;
  comments: (Comment & {
    user: {
      name: string | null;
      avatar: string | null;
    };
  })[];
  syllabus?: any;
  qrCode?: string | null;
  messages: any[];
};

// 动态生成页面元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return {
      title: "产品不存在",
    };
  }

  return {
    title: `${product.title} - 姜胡说`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = (await prisma.product.findUnique({
    where: {
      id: params.id,
    },
    include: {
      tags: true,
      platform: true,
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
      messages: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })) as ProductWithRelations;

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧主要内容 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 产品封面 */}
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl || "/default-product.jpg"}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          {/* 产品标题和描述 */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>

          {/* 课程大纲 */}
          <CourseContent syllabus={product.syllabus} />

          {/* 评论区 */}
          <CommentSection comments={product.comments} courseId={product.id} />
        </div>

        {/* 右侧信息栏 */}
        <div className="space-y-6">
          {/* 购买按钮 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Image
                src={product.platform.icon}
                alt={product.platform.name}
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-lg text-gray-600">{product.platform.name}</span>
            </div>
            <a
              href={product.platformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 text-center"
            >
              前往购买
            </a>
          </div>

          {/* 微信群二维码 */}
          {product.qrCode && (
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">加入学习群</h3>
                <div className="relative aspect-square">
                  <Image src={product.qrCode} alt="微信群二维码" fill className="object-contain" />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">扫码加入课程微信群</p>
              </div>

              {product.messages.length > 0 && (
                <GroupMessages
                  messages={product.messages.slice(0, 3)}
                  allMessages={product.messages}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
