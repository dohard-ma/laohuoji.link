import prisma from "@/lib/prisma";
import MemberList from "./components/MemberList";
import MemberFilter from "./components/MemberFilter";
import { Prisma } from "@prisma/client";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // 处理过滤条件
  const filters: Prisma.UserWhereInput[] = [];

  // 处理搜索
  const search = searchParams.search?.toString();
  if (search) {
    filters.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  // 处理标签过滤
  const tagIds = searchParams.tags?.toString().split(",").filter(Boolean);
  if (tagIds?.length) {
    filters.push({
      OR: [
        {
          skillTags: {
            some: {
              id: { in: tagIds },
            },
          },
        },
        {
          needTags: {
            some: {
              id: { in: tagIds },
            },
          },
        },
      ],
    });
  }

  // 获取成员列表
  const members = await prisma.user.findMany({
    where: {
      AND: filters,
    },
    include: {
      skillTags: true,
      needTags: true,
      badges: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // 获取所有标签供过滤使用
  const tags = await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">社群成员</h1>
      <MemberFilter tags={tags} />
      <MemberList members={members} />
    </div>
  );
}
