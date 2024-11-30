import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// 生成随机颜色
function getRandomColor() {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 生成文字头像
function generateAvatarUrl(name: string) {
  const color = getRandomColor();
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // 这里可以使用外部服务生成头像，或者使用 Canvas 生成
  // 这里我们暂时返回一个占位符
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color.replace("bg-", "").replace("-500", "")}&color=fff`;
}

export async function POST(req: Request) {
  try {
    const { email, password, name, bio } = await req.json();

    // 验证必填字段
    if (!name?.trim()) {
      return NextResponse.json({ error: "昵称不能为空" }, { status: 400 });
    }

    if (!bio?.trim() || bio.length < 10) {
      return NextResponse.json({ error: "个人简介不能少于10个字符" }, { status: 400 });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json({ error: "密码长度至少为6位" }, { status: 400 });
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "邮箱已被注册" }, { status: 400 });
    }

    // 生成头像 URL
    const avatar = `/api/avatar?name=${encodeURIComponent(name)}`;

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
      },
    });

    return NextResponse.json({ message: "注册成功" }, { status: 201 });
  } catch (error) {
    console.error("注册失败:", error);
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
