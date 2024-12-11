import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 清理现有数据
  await prisma.tag.deleteMany();

  // 预设标签
  const tags = [
    // 技能领域
    { name: "技术", level: 1 },
    { name: "前端开发", level: 2, parentName: "技术" },
    { name: "React", level: 3, parentName: "前端开发" },
    { name: "Vue", level: 3, parentName: "前端开发" },
    { name: "后端开发", level: 2, parentName: "技术" },
    { name: "Python", level: 3, parentName: "后端开发" },
    { name: "Node.js", level: 3, parentName: "后端开发" },

    { name: "设计", level: 1 },
    { name: "UI设计", level: 2, parentName: "设计" },
    { name: "UX设计", level: 2, parentName: "设计" },
    { name: "Figma", level: 3, parentName: "UI设计" },
    { name: "Sketch", level: 3, parentName: "UI设计" },

    { name: "产品", level: 1 },
    { name: "产品经理", level: 2, parentName: "产品" },
    { name: "用户研究", level: 2, parentName: "产品" },
    { name: "数据分析", level: 2, parentName: "产品" },

    // 方法论
    { name: "产品方法论", level: 1 },
    { name: "设计思维", level: 2, parentName: "产品方法论" },
    { name: "精益创业", level: 2, parentName: "产品方法论" },
    { name: "敏捷开发", level: 2, parentName: "产品方法论" },
  ];

  // 创建标签时处理父子关系
  const tagMap = new Map();

  for (const tag of tags) {
    const { name, level, parentName } = tag;
    const created = await prisma.tag.create({
      data: {
        name,
        level,
        ...(parentName && tagMap.has(parentName)
          ? { parent: { connect: { id: tagMap.get(parentName) } } }
          : {}),
      },
    });
    tagMap.set(name, created.id);
  }

  console.log("标签数据添加成功！");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
