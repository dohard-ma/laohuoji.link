import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import CommentSection from "@/app/courses/[id]/components/CommentSection";
import CourseContent from "@/app/courses/[id]/components/CourseContent";
import { Metadata } from "next";
import { Product, Tag, Comment } from "@prisma/client";

type Props = {
  params: { id: string };
};

type ProductWithRelations = Product & {
  tags: Tag[];
  comments: (Comment & {
    user: {
      name: string | null;
      avatar: string | null;
    };
  })[];
  syllabus?: any;
  qrCode?: string | null;
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

          {/* 课程大纲（仅课程显示） */}
          {product.type === "course" && <CourseContent syllabus={product.syllabus} />}

          {/* 评论区 */}
          <CommentSection comments={product.comments} courseId={product.id} />
        </div>

        {/* 右侧信息栏 */}
        <div className="space-y-6">
          {/* 价格信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600 mb-4">¥{product.price.toFixed(2)}</div>
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
              立即购买
            </button>
          </div>

          {/* 微信群二维码（仅课程显示） */}
          {product.type === "course" && product.qrCode && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">加入学习群</h3>
              <div className="relative aspect-square">
                <Image src={product.qrCode} alt="微信群二维码" fill className="object-contain" />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">扫码加入课程微信群</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
