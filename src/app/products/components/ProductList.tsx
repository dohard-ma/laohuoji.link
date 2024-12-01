import { Product, Tag, Platform } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type ProductListProps = {
  products: (Product & {
    tags: Tag[];
    platform: Platform;
  })[];
};

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
        >
          {product.imageUrl && (
            <div className="relative h-48">
              <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <div className="flex items-center gap-2">
                <Image
                  src={product.platform.icon}
                  alt={product.platform.name}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <span className="text-sm text-gray-500">{product.platform.name}</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
