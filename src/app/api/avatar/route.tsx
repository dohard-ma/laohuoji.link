import { NextResponse } from "next/server";
import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const width = parseInt(searchParams.get("w") || "128", 10);
    const height = width; // 保持正方形

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // 随机背景色
    const colors = [
      "#F87171", // red-400
      "#60A5FA", // blue-400
      "#34D399", // green-400
      "#FBBF24", // yellow-400
      "#A78BFA", // purple-400
      "#F472B6", // pink-400
    ];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];

    // 获取缩写
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    // 使用 ImageResponse 生成图片
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: bgColor,
            fontSize: Math.round(width * 0.4),
            fontWeight: 600,
            color: "white",
          }}
        >
          {initials}
        </div>
      ),
      {
        width,
        height,
      }
    );
  } catch (error) {
    console.error("Avatar generation failed:", error);
    return NextResponse.json({ error: "Failed to generate avatar" }, { status: 500 });
  }
}

export const runtime = "edge";
