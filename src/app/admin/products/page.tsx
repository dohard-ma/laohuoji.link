import prisma from "@/lib/prisma";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "产品管理 - 姜胡说",
  description: "管理课程和产品",
};

export default async function AdminProductsPage() {
  const [products, tags, platforms] = await Promise.all([
    prisma.product.findMany({
      include: {
        tags: true,
        platform: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.platform.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">产品管理</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">添加新产品</h2>
        <ProductForm tags={tags} platforms={platforms} />
      </div>

      <div className="bg-white rounded-lg shadow">
        <ProductTable products={products} />
      </div>
    </div>
  );
}
