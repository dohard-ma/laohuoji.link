import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

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
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { name, category, level, aiCategory, aiConfidence } = await request.json();

    // 检查标签是否已存在
    const existingTag = await prisma.tag.findUnique({
      where: { name },
    });

    if (existingTag) {
      // 如果标签已存在，可以更新 AI 分类信息
      const updatedTag = await prisma.tag.update({
        where: { id: existingTag.id },
        data: {
          aiCategory,
          aiConfidence,
        },
      });
      return NextResponse.json(updatedTag);
    }

    // 创建新标签
    const tag = await prisma.tag.create({
      data: {
        name,
        category,
        level,
        aiCategory,
        aiConfidence,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("创建标签失败:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
