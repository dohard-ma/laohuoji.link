import { Product, Tag } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type ProductListProps = {
  products: (Product & {
    tags: Tag[];
  })[];
};

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={product.type === "course" ? `/courses/${product.id}` : `/products/${product.id}`}
          className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          {product.imageUrl && (
            <div className="relative h-48">
              <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <span className="text-blue-600 font-medium">¥{product.price.toFixed(2)}</span>
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
