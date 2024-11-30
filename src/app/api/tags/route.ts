import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// 获取标签列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  const where = query
    ? {
        name: {
          contains: query,
          mode: "insensitive" as const,
        },
      }
    : {};

  const tags = await prisma.tag.findMany({
    where,
    orderBy: [{ id: "desc" }, { name: "asc" }] as const,
    take: 50,
  });

  return NextResponse.json(tags);
}

// 创建标签
export async function POST(request: Request) {
  const data = await request.json();

  try {
    // 先查找是否存在
    const existingTag = await prisma.tag.findUnique({
      where: { name: data.name },
    });

    if (existingTag) {
      return NextResponse.json(existingTag);
    }

    // 创建新标签
    const tag = await prisma.tag.create({
      data: {
        name: data.name,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("创建标签失败:", error);
    return NextResponse.json({ error: "创建标签失败" }, { status: 500 });
  }
}
