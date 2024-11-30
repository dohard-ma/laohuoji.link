"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AuthForm from "./components/AuthForm";

export default function AuthPage() {
  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   const formData = new FormData(e.currentTarget);
  //   const email = formData.get("email") as string;
  //   const password = formData.get("password") as string;

  //   try {
  //     const result = await signIn("credentials", {
  //       email,
  //       password,
  //       redirect: false,
  //     });

  //     if (result?.error) {
  //       setError("邮箱或密码错误");
  //       return;
  //     }

  //     // 获取回调 URL，如果没有则跳转到首页
  //     const callbackUrl = searchParams.get("callbackUrl") || "/";
  //     router.push(callbackUrl);
  //     router.refresh();
  //   } catch (error) {
  //     setError("登录失败，请重试");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="max-w-md w-full mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">欢迎加入姜胡说</h1>
        <p className="text-gray-600 mt-2">登录或注册以继续</p>
      </div>
      <AuthForm />
    </div>
  );
}
