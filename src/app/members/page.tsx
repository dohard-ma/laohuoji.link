import prisma from "@/lib/prisma";
import MemberList from "./components/MemberList";
import MemberFilter from "./components/MemberFilter";
import { Metadata } from "next";
import { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "社群成员 - 姜胡说",
  description: "浏览姜胡说社群的所有成员",
};

export default async function MembersPage({
  searchParams,
}: {
  searchParams: { query?: string; tags?: string };
}) {
  // 获取所有标签
  const tags = await prisma.tag.findMany({
    orderBy: [{ id: "desc" }],
  });

  // 构建查询条件
  const where: Prisma.UserWhereInput = {
    AND: [
      // 搜索条件
      searchParams.query
        ? {
            OR: [
              {
                name: {
                  contains: searchParams.query,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
              {
                bio: {
                  contains: searchParams.query,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
            ],
          }
        : {},
      // 标签筛选
      searchParams.tags
        ? {
            OR: [
              {
                specialties: {
                  has: searchParams.tags,
                },
              },
              {
                needs: {
                  has: searchParams.tags,
                },
              },
              {
                tags: {
                  some: {
                    name: searchParams.tags,
                  },
                },
              },
            ],
          }
        : {},
    ],
  };

  // 获取成员列表
  const members = await prisma.user.findMany({
    where,
    include: {
      tags: true,
      badges: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">社群成员</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex-shrink-0">
          <MemberFilter tags={tags} />
        </div>
        <div className="flex-grow">
          <MemberList members={members} />
        </div>
      </div>
    </div>
  );
}
