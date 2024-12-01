"use client";

import { Product, Tag } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ProductTableProps = {
  products: (Product & {
    tags: Tag[];
    platform: {
      id: string;
      name: string;
      icon: string;
    };
  })[];
};

export default function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个产品吗？")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              封面
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              标题
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              平台
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              标签
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {product.imageUrl && (
                  <div className="relative w-20 h-20">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </td>
              <td className="px-6 py-4">{product.title}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={product.platform.icon}
                    alt={product.platform.name}
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <span>{product.platform.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
