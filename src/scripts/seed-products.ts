const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");
const prisma = new PrismaClient();

// 添加类型定义
type TagCount = {
  tags: {
    id: string;
  }[];
};

async function main() {
  // 清理现有数据
  await prisma.comment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 创建测试用户
  const users = [
    {
      email: "test1@example.com",
      password: await hash("123456", 12),
      name: "测试用户1",
      avatar: "/api/avatar?name=测试用户1",
    },
    {
      email: "test2@example.com",
      password: await hash("123456", 12),
      name: "测试用户2",
      avatar: "/api/avatar?name=测试用户2",
    },
  ];

  for (const userData of users) {
    await prisma.user.create({ data: userData });
  }

  // 创建测试数据
  const products = [
    {
      title: "产品经理入门课程",
      description: "从零开始学习产品经理必备知识和技能，包含需求分析、产品设计、项目管理等内容。",
      price: 299.0,
      type: "course",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
      qrCode: "/qrcodes/course-1.png",
      syllabus: [
        {
          title: "产品经理的角色与职责",
          content: "1. 什么是产品经理\n2. 产品经理的日常工作\n3. 必备技能和工具",
          date: "2024-03-20",
        },
        {
          title: "需求分析与管理",
          content: "1. 需求收集方法\n2. 需求分析框架\n3. 需求文档撰写",
          date: "2024-03-21",
        },
        {
          title: "产品设计基础",
          content: "1. 用户体验设计\n2. 产品原型设计\n3. 交互设计原则",
          date: "2024-03-22",
        },
      ],
      tags: {
        connect: [{ name: "产品经理" }, { name: "入门课程" }],
      },
    },
    {
      title: "设计思维工作坊",
      description: "通过实践学习设计思维方法论，解决实际业务问题。为期两天的线下工作坊。",
      price: 1999.0,
      type: "course",
      imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12",
      tags: {
        connect: [{ name: "设计思维" }, { name: "工作坊" }],
      },
    },
    {
      title: "产品复盘模板",
      description: "帮助产品经理进行项目复盘的模板工具，包含多个维度的分析框架。",
      price: 29.0,
      type: "product",
      imageUrl: "https://images.unsplash.com/photo-1572021335469-31706a17aaef",
      tags: {
        connect: [{ name: "产品工具" }, { name: "模板" }],
      },
    },
    {
      title: "用户研究实战手册",
      description: "系统介绍用户研究方法和工具，包含实际案例分析和操作指南。",
      price: 99.0,
      type: "product",
      imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
      tags: {
        connect: [{ name: "用户研究" }, { name: "实战指南" }],
      },
    },
  ];

  // 先创建标签
  const tags = [
    "产品经理",
    "入门课程",
    "设计思维",
    "工作坊",
    "产品工具",
    "模板",
    "用户研究",
    "实战指南",
  ];

  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
  }

  // 创建产品
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  // 创建评论
  const comments = [
    {
      content: "课程内容很实用，讲解也很清晰",
      userId: (await prisma.user.findUnique({ where: { email: "test1@example.com" } }))!.id,
      productId: (await prisma.product.findFirst({ where: { title: "产品经理入门课程" } }))!.id,
    },
    {
      content: "非常适合入门学习，期待更多内容",
      userId: (await prisma.user.findUnique({ where: { email: "test2@example.com" } }))!.id,
      productId: (await prisma.product.findFirst({ where: { title: "产品经理入门课程" } }))!.id,
    },
    {
      content: "工作坊的形式很好，能学到很多实践经验",
      userId: (await prisma.user.findUnique({ where: { email: "test1@example.com" } }))!.id,
      productId: (await prisma.product.findFirst({ where: { title: "设计思维工作坊" } }))!.id,
    },
  ];

  for (const comment of comments) {
    await prisma.comment.create({ data: comment });
  }

  console.log("测试数据添加成功！");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
