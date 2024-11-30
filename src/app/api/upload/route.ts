import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { storage } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    // 验证用户是否登录
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 获取上传的文件
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "没有文件上传" }, { status: 400 });
    }

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "只能上传图片文件" }, { status: 400 });
    }

    // 生成文件名
    const filename = `avatar-${session.user.id}-${Date.now()}`;

    // 保存文件
    const url = await storage.saveFile(file, filename);

    // 返回文件 URL
    return NextResponse.json({ url });
  } catch (error) {
    console.error("上传失败:", error);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
