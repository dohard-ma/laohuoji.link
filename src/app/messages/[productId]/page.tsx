import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import MessagesClient from "./MessagesClient";

export default async function MessagesPage({ params }: { params: { productId: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
      },
      platform: true,
    },
  });

  if (!product) {
    notFound();
  }

  return <MessagesClient product={product} />;
}
