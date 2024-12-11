import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password, name, bio, avatar, specialties, needs } = await request.json();

    // 验证必填字段
    if (!email || !password || !name || !bio || !specialties || !needs) {
      return NextResponse.json({ error: "请填写所有必填字段" }, { status: 400 });
    }

    // 检查邮箱是否已注册
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 400 });
    }

    // 密码加密
    const hashedPassword = await hash(password, 12);

    // 创建新用户
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        bio,
        avatar,
        specialties, // 添加擅长领域
        needs, // 添加需求领域
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error("注册失败:", error);
    return NextResponse.json({ error: "注册失败，请稍后重试" }, { status: 500 });
  }
}
