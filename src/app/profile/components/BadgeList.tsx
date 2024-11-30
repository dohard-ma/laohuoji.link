import { Badge } from "@prisma/client";
import Image from "next/image";

type BadgeListProps = {
  badges: Badge[];
};

export default function BadgeList({ badges = [] }: BadgeListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <div key={badge.id} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
          <div className="relative w-16 h-16 mb-2">
            <Image src={badge.imageUrl} alt={badge.name} fill className="object-contain" />
          </div>
          <h4 className="text-sm font-medium">{badge.name}</h4>
          <p className="text-xs text-gray-500">{badge.description}</p>
        </div>
      ))}
    </div>
  );
}
