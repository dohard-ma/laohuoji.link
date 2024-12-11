import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import ProfileForm from "../components/ProfileForm";

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
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
    },
  });

  if (!user) {
    notFound();
  }

  // 获取所有可用标签供编辑使用
  const availableTags = await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const isOwnProfile = session.user.id === user.id;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isOwnProfile ? "个人信息" : `${user.name || "用户"}的资料`}
      </h1>
      <ProfileForm user={user} availableTags={availableTags} readOnly={!isOwnProfile} />
    </div>
  );
}
