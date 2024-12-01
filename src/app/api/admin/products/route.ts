import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { storage } from "@/lib/storage";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        tags: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "加载产品失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const formData = await request.formData();
    const coverFile = formData.get("cover") as File;
    const qrCodeFile = formData.get("qrcode") as File;
    const data = JSON.parse(formData.get("data") as string);

    // 保存封面图片
    const imageUrl = await storage.saveFile(coverFile, `product-${Date.now()}`);

    // 保存二维码图片（如果有）
    let qrCode = null;
    if (qrCodeFile) {
      qrCode = await storage.saveFile(qrCodeFile, `qrcode-${Date.now()}`);
    }

    // 创建产品
    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        platformId: data.platformId,
        platformUrl: data.platformUrl,
        imageUrl,
        qrCode,
        tags: {
          connect: data.tagIds.map((id: string) => ({ id })),
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("创建产品失败:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, tags, ...data } = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        tags: {
          set: [], // 先清除所有标签
          connect: tags.map((tagName: string) => ({ name: tagName })),
        },
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "更新产品失败" }, { status: 500 });
  }
}

// 添加删除产品的处理
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // 直接删除产品即可
    const product = await prisma.product.delete({
      where: { id: params.id },
      include: { tags: true }, // 可选：如果需要返回被删除的产品信息
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("删除产品失败:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
