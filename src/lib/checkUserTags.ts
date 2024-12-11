import { Tag } from "@prisma/client";

interface UserWithTags {
  skillTags: Tag[];
  needTags: Tag[];
}

export function needsTagCompletion(user: UserWithTags | null) {
  if (!user) return false;
  return user.skillTags.length === 0 || user.needTags.length === 0;
}
