import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { needsTagCompletion } from "@/lib/checkUserTags";
import TagsReminder from "@/components/TagsReminder";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "姜胡说",
  description: "姜胡说 导航站",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  let showTagsReminder = false;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        skillTags: {
          select: { id: true },
        },
        needTags: {
          select: { id: true },
        },
      },
    });

    showTagsReminder = !user || user.skillTags.length === 0 || user.needTags.length === 0;
  }

  return (
    <html lang="zh">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          {children}
          {showTagsReminder && <TagsReminder />}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
