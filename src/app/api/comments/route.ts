import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. 验证会话
    const session = await getServerSession(authOptions);
    console.log("当前会话:", {
      userId: session?.user?.id,
      email: session?.user?.email,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    // 2. 获取请求数据
    const { content, productId } = await request.json();
    console.log("请求数据:", { content, productId });

    // 3. 验证内容
    if (!content?.trim()) {
      console.log("评论内容为空");
      return NextResponse.json({ error: "评论内容不能为空" }, { status: 400 });
    }

    // 4. 验证产品是否存在
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    console.log("查找产品结果:", product);

    if (!product) {
      console.log("产品不存在:", productId);
      return NextResponse.json({ error: "产品不存在" }, { status: 404 });
    }

    // 新增：验证用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      console.log("用户不存在:", session.user.id);
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 5. 创建评论
    console.log("准备创建评论:", {
      content: content.trim(),
      userId: session.user.id,
      productId,
    });

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        productId,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    console.log("评论创建成功:", comment);
    return NextResponse.json(comment);
  } catch (error) {
    // 6. 错误处理
    console.error("创建评论失败，详细错误:", {
      error,
      message: error instanceof Error ? error.message : "未知错误",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // 如果是 Prisma 错误，输出更多信息
    if (error && typeof error === "object" && "code" in error) {
      console.error("Prisma 错误代码:", (error as any).code);
      console.error("Prisma 错误详情:", {
        meta: (error as any).meta,
        message: (error as any).message,
      });
    }

    return NextResponse.json(
      {
        error: "评论失败",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}
