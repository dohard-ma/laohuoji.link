import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// 定义需要鉴权的路径配置
const AUTH_CONFIG = {
  pages: [
    "/courses/:path*", // 课程相关页面
    "/products/:path*", // 产品相关页面
    "/members", // 社群成员页面
  ],
  api: [
    "/api/comments/:path*", // 评论相关 API
  ],
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 检查是否需要鉴权（移除路径参数部分进行比较）
  const isAuthRoute = [...AUTH_CONFIG.pages, ...AUTH_CONFIG.api].some((route) => {
    const pattern = route.replace(/\/:path\*$/, "");
    return path.startsWith(pattern);
  });

  if (isAuthRoute && !token) {
    if (path.startsWith("/api")) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 使用相同的配置生成 matcher
export const config = {
  matcher: [...AUTH_CONFIG.pages, ...AUTH_CONFIG.api],
};
