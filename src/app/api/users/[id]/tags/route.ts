import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.id !== params.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { skillTags, needTags } = await request.json();

    // 创建或获取技能标签
    const skillTagRecords = await Promise.all(
      skillTags.map(async (tagName: string) => {
        return await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: {
            name: tagName,
            category: "skill",
            level: 2,
          },
        });
      })
    );

    // 创建或获取需求标签
    const needTagRecords = await Promise.all(
      needTags.map(async (tagName: string) => {
        return await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: {
            name: tagName,
            category: "need",
            level: 2,
          },
        });
      })
    );

    // 更新用户标签关系
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        skillTags: {
          set: skillTagRecords.map((tag) => ({ id: tag.id })),
        },
        needTags: {
          set: needTagRecords.map((tag) => ({ id: tag.id })),
        },
      },
      include: {
        skillTags: true,
        needTags: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("更新标签失败:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
