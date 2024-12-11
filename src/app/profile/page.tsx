import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import ProfileForm from "./components/ProfileForm";
import { User, Tag, Badge, Comment } from "@prisma/client";

type UserWithRelations = User & {
  skillTags: Tag[];
  needTags: Tag[];
  badges: Badge[];
  comments: Comment[];
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const user = (await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      bio: true,
      specialties: true,
      needs: true,
      skillTags: {
        select: {
          id: true,
          name: true,
          level: true,
        },
      },
      needTags: {
        select: {
          id: true,
          name: true,
          level: true,
        },
      },
      badges: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          type: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      },
    },
  })) as UserWithRelations;

  // 获取所有可用标签
  const availableTags = await prisma.tag.findMany({});

  if (!user) {
    return <div>用户不存在</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">个人信息</h1>
      <ProfileForm user={user} availableTags={availableTags} />
    </div>
  );
}
