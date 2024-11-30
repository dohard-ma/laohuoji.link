import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "删除产品失败" }, { status: 500 });
  }
}
