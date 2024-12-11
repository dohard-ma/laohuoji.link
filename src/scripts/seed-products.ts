const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");
const prisma = new PrismaClient();

// 添加类型定义
interface CreatedPlatforms {
  [key: string]: any;
}

async function main() {
  // 清理现有数据
  await prisma.groupMessage.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.platform.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tag.deleteMany();

  // 1. 创建标签
  const parentTags = [
    { name: "产品", category: "skill", level: 1 },
    { name: "技术", category: "skill", level: 1 },
    { name: "设计", category: "skill", level: 1 },
    { name: "产品方法论", category: "method", level: 1 },
  ];

  const tagMap = new Map();

  for (const tag of parentTags) {
    const created = await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
    tagMap.set(tag.name, created.id);
  }

  const childTags = [
    { name: "产品经理", category: "skill", level: 2, parentName: "产品" },
    { name: "用户研究", category: "skill", level: 2, parentName: "产品" },
    { name: "数据分析", category: "skill", level: 2, parentName: "产品" },
    { name: "前端开发", category: "skill", level: 2, parentName: "技术" },
    { name: "React", category: "skill", level: 3, parentName: "前端开发" },
    { name: "Vue", category: "skill", level: 3, parentName: "前端开发" },
    { name: "设计思维", category: "method", level: 2, parentName: "产品方法论" },
  ];

  for (const tag of childTags) {
    const { parentName, ...tagData } = tag;
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: {
        ...tagData,
        ...(parentName && tagMap.has(parentName)
          ? { parent: { connect: { id: tagMap.get(parentName) } } }
          : {}),
      },
    });
  }

  // 2. 创建用户
  const users = [
    {
      email: "test1@example.com",
      password: await hash("123456", 12),
      name: "测试用户1",
      avatar: "/api/avatar?name=测试用户1",
      specialties: "产品设计、用户研究、数据分析",
      needs: "想学习前端开发和设计思维",
      skillTags: {
        connect: [
          { name: "产品" },
          { name: "产品经理" },
          { name: "用户研究" },
          { name: "数据分析" },
        ],
      },
      needTags: {
        connect: [{ name: "技术" }, { name: "前端开发" }, { name: "设计思维" }],
      },
    },
    {
      email: "test2@example.com",
      password: await hash("123456", 12),
      name: "测试用户2",
      avatar: "/api/avatar?name=测试用户2",
      specialties: "前端开发、React、Vue",
      needs: "想提升产品思维和用户研究能力",
      skillTags: {
        connect: [{ name: "技术" }, { name: "前端开发" }, { name: "React" }, { name: "Vue" }],
      },
      needTags: {
        connect: [{ name: "产品" }, { name: "产品经理" }, { name: "用户研究" }],
      },
    },
  ];

  for (const userData of users) {
    await prisma.user.create({
      data: userData,
      include: {
        skillTags: true,
        needTags: true,
      },
    });
  }

  // 3. 创建平台和产品
  const platforms = [
    { name: "知识星球", icon: "/platforms/zsxq.png" },
    { name: "小报童", icon: "/platforms/xbt.png" },
    { name: "飞书", icon: "/platforms/feishu.png" },
  ];

  const createdPlatforms: CreatedPlatforms = {};
  for (const platform of platforms) {
    const created = await prisma.platform.create({ data: platform });
    createdPlatforms[platform.name] = created;
  }

  // 创建产品数据
  const productData = [
    {
      title: "产品经理入门课程",
      description: "从零开始学习产品经理必备技能，包括用户研究、需求分析、产品规划等内容。",
      platformId: createdPlatforms["知识星球"].id,
      platformUrl: "https://zsxq.com/example1",
      imageUrl: "/products/product1.png",
      qrCode: "/qrcodes/group1.png",
      syllabus: [
        { title: "产品经理概述", content: "什么是产品经理，职责和技能要求", date: "2024-03-01" },
        { title: "用户研究方法", content: "用户访谈、问卷调查、用户画像", date: "2024-03-02" },
        { title: "需求分析", content: "需求收集、分析和优先级排序", date: "2024-03-03" },
        { title: "产品规划", content: "产品路线图、版本规划、特性规划", date: "2024-03-04" },
      ],
      tags: {
        connect: [
          { name: "产品" },
          { name: "产品经理" },
          { name: "用户研究" },
          { name: "产品方法论" },
        ],
      },
    },
    {
      title: "前端开发实战",
      description: "深入学习现代前端开发技术，包括React、Vue等主流框架的实践应用。",
      platformId: createdPlatforms["小报童"].id,
      platformUrl: "https://xbt.com/example2",
      imageUrl: "/products/product2.png",
      qrCode: "/qrcodes/group2.png",
      syllabus: [
        { title: "现代前端概述", content: "前端发展历史和技术栈介绍", date: "2024-03-10" },
        { title: "React基础", content: "React核心概念和基本使用", date: "2024-03-11" },
        { title: "Vue基础", content: "Vue核心概念和基本使用", date: "2024-03-12" },
        { title: "实战项目", content: "综合项目实践", date: "2024-03-13" },
      ],
      tags: {
        connect: [{ name: "技术" }, { name: "前端开发" }, { name: "React" }, { name: "Vue" }],
      },
    },
    {
      title: "设计思维工作坊",
      description: "通过实践学习设计思维方法，解决实际产品问题。",
      platformId: createdPlatforms["飞书"].id,
      platformUrl: "https://feishu.com/example3",
      imageUrl: "/products/product3.png",
      qrCode: "/qrcodes/group3.png",
      syllabus: [
        { title: "设计思维简介", content: "设计思维的基本概念和应用场景", date: "2024-03-20" },
        { title: "共情与定义", content: "用户共情和问题定义方法", date: "2024-03-21" },
        { title: "创意与原型", content: "创意发散和原型制作", date: "2024-03-22" },
        { title: "测试与迭代", content: "原型测试和迭代优化", date: "2024-03-23" },
      ],
      tags: {
        connect: [{ name: "设计" }, { name: "产品方法论" }, { name: "设计思维" }],
      },
    },
  ];

  // 创建产品
  const createdProducts = [];
  for (const data of productData) {
    const product = await prisma.product.create({
      data: {
        ...data,
        syllabus: JSON.stringify(data.syllabus),
      },
    });
    createdProducts.push(product);
  }

  // 创建群消息历史记录
  const messages = [
    {
      content: "大家好，欢迎加入课程群！",
      createdAt: new Date("2024-03-01T10:00:00Z"),
    },
    {
      content: "请大家先做一下自我介绍吧",
      createdAt: new Date("2024-03-01T10:05:00Z"),
    },
    {
      content: "我是小王，是一名产品经理，希望通过这个课程提升设计思维",
      createdAt: new Date("2024-03-01T10:10:00Z"),
    },
    {
      content: "大家好，我叫小李，是一名前端开发，想学习一下产品思维",
      createdAt: new Date("2024-03-01T10:15:00Z"),
    },
    {
      content: "今天的课程主题是「用户研究方法」",
      createdAt: new Date("2024-03-02T14:00:00Z"),
    },
    {
      content: "课程会从基础的用户访谈方法开始讲起",
      createdAt: new Date("2024-03-02T14:05:00Z"),
    },
    {
      content: "请大家准备好笔记工具",
      createdAt: new Date("2024-03-02T14:10:00Z"),
    },
    {
      content: "课程结束后我们会有一个小作业",
      createdAt: new Date("2024-03-02T15:55:00Z"),
    },
    {
      content: "大家记得完成并提交哦",
      createdAt: new Date("2024-03-02T16:00:00Z"),
    },
    {
      content: "我的作业已经提交了，请老师查看",
      createdAt: new Date("2024-03-03T09:00:00Z"),
    },
  ];

  // 为每个产品创建群消息
  for (const product of createdProducts) {
    await prisma.groupMessage.createMany({
      data: messages.map((msg) => ({
        ...msg,
        productId: product.id,
      })),
    });
  }

  console.log("群消息创建成功");

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
