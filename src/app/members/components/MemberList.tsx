import { User, Tag, Badge } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type MemberListProps = {
  members: (User & {
    tags: Tag[];
    badges: Badge[];
  })[];
};

export default function MemberList({ members }: MemberListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <div
          key={member.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={member.avatar || "/default-avatar.png"}
                  alt={member.name || "用户头像"}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium">{member.name || "未设置昵称"}</h3>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-600 line-clamp-2">
                {member.bio || "这个人很懒，什么都没写~"}
              </p>
            </div>

            {member.specialties.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">擅长领域</h4>
                <div className="flex flex-wrap gap-2">
                  {member.specialties.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {member.needs.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">需求领域</h4>
                <div className="flex flex-wrap gap-2">
                  {member.needs.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {member.badges.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">获得的勋章</h4>
                <div className="flex flex-wrap gap-2">
                  {member.badges.map((badge) => (
                    <div key={badge.id} className="relative w-6 h-6" title={badge.name}>
                      <Image
                        src={badge.imageUrl}
                        alt={badge.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
