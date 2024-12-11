import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const data = await request.json();
    const { skillTags, needTags, ...userData } = data;

    // 更新用户基本信息
    const updateData: any = { ...userData };

    // 只有当提供了标签数据时才更新标签关系
    if (skillTags) {
      updateData.skillTags = {
        set: [], // 先清空现有关系
        connect: skillTags.map((tag: { id: string }) => ({ id: tag.id })),
      };
    }

    if (needTags) {
      updateData.needTags = {
        set: [], // 先清空现有关系
        connect: needTags.map((tag: { id: string }) => ({ id: tag.id })),
      };
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      include: {
        skillTags: true,
        needTags: true,
        badges: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("更新用户资料失败:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
