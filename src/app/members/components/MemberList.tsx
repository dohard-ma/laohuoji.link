import { User, Tag, Badge } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Badge as UIBadge } from "@/components/ui/badge";

type MemberWithRelations = User & {
  skillTags: Tag[];
  needTags: Tag[];
  badges: Badge[];
};

interface Props {
  members: MemberWithRelations[];
}

export default function MemberList({ members }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <div key={member.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16">
              <Image
                src={member.avatar || "/default-avatar.png"}
                alt={member.name || "用户头像"}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium">
                <Link href={`/profile/${member.id}`} className="hover:text-blue-500">
                  {member.name}
                </Link>
              </h3>
              <p className="text-sm text-gray-500">{member.bio}</p>
            </div>
          </div>

          {/* 技能标签 */}
          {member.skillTags.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">擅长领域</h4>
              <div className="flex flex-wrap gap-2">
                {member.skillTags.map((tag) => (
                  <UIBadge key={tag.id} variant="default">
                    {tag.name}
                  </UIBadge>
                ))}
              </div>
            </div>
          )}

          {/* 需求标签 */}
          {member.needTags.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">需求领域</h4>
              <div className="flex flex-wrap gap-2">
                {member.needTags.map((tag) => (
                  <UIBadge key={tag.id} variant="secondary">
                    {tag.name}
                  </UIBadge>
                ))}
              </div>
            </div>
          )}

          {/* 勋章 */}
          {member.badges.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">获得的勋章</h4>
              <div className="flex flex-wrap gap-2">
                {member.badges.map((badge) => (
                  <div key={badge.id} className="relative w-8 h-8 group" title={badge.name}>
                    <Image src={badge.imageUrl} alt={badge.name} fill className="object-contain" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
