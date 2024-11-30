import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const data = await req.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("更新失败:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
