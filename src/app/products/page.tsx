import prisma from "@/lib/prisma";
import ProductList from "./components/ProductList";
import ProductFilter from "./components/ProductFilter";
import { Metadata } from "next";
import { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "课程与产品 - 姜胡说",
  description: "浏览姜胡说的课程和产品",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { query?: string; tag?: string };
}) {
  // 获取所有标签及其使用次数
  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          products: true, // 统计关联的产品数量
        },
      },
    },
    orderBy: {
      products: {
        _count: "desc", // 按产品数量排序
      },
    },
  });

  // 转换数据格式，添加 count 属性
  const tagsWithCount = tags.map((tag) => ({
    ...tag,
    count: tag._count.products,
  }));

  // 构建查询条件
  const where: Prisma.ProductWhereInput = {
    OR: [
      // 1. 标签匹配（最高优先级）
      {
        tags: {
          some: {
            name: {
              contains: searchParams.query,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
        },
      },
      // 2. 标题匹配（中等优先级）
      {
        title: {
          contains: searchParams.query,
          mode: "insensitive" as Prisma.QueryMode,
        },
      },
      // 3. 简介匹配（最低优先级）
      {
        description: {
          contains: searchParams.query,
          mode: "insensitive" as Prisma.QueryMode,
        },
      },
    ].filter(Boolean), // 移除空条件
    // 标签筛选条件保持不变
    ...(searchParams.tag
      ? {
          tags: {
            some: {
              id: searchParams.tag,
            },
          },
        }
      : {}),
  };

  // 获取产品列表，按匹配优先级排序
  const products = await prisma.product.findMany({
    where,
    include: {
      tags: true,
    },
    orderBy: [
      // 标签匹配的排在最前面
      {
        tags: {
          _count: "desc",
        },
      },
      // 然后是创建时间
      {
        createdAt: "desc",
      },
    ],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">课程与产品</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex-shrink-0">
          <ProductFilter tags={tagsWithCount} />
        </div>
        <div className="flex-grow">
          <ProductList products={products} />
        </div>
      </div>
    </div>
  );
}
