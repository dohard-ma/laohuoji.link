"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold text-gray-800">
              姜胡说
            </Link>
            <Link href="/members" className="text-gray-600 hover:text-gray-900">
              社群成员
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              课程产品
            </Link>
            {session?.user?.email === "dohard@163.com" && (
              <Link href="/admin/products" className="text-gray-600 hover:text-gray-900">
                产品管理
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                  个人中心
                </Link>
                <button onClick={() => signOut()} className="text-gray-600 hover:text-gray-900">
                  退出
                </button>
              </>
            ) : (
              <Link href="/auth" className="text-gray-600 hover:text-gray-900">
                登录
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
