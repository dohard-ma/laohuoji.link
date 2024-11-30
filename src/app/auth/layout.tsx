import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登录 - 姜胡说",
  description: "登录到姜胡说线上共创平台",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50 flex flex-col justify-center">{children}</div>;
}
