const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");
const prisma = new PrismaClient();

// 添加类型定义
interface CreatedPlatforms {
  [key: string]: {
    id: string;
    name: string;
    icon: string;
  };
}

async function main() {
  // 清理现有数据
  await prisma.groupMessage.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.platform.deleteMany();
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

  // 创建平台
  const platforms = [
    {
      name: "知识星球",
      icon: "/platforms/zsxq.png",
    },
    {
      name: "小报童",
      icon: "/platforms/xbt.png",
    },
    {
      name: "飞书",
      icon: "/platforms/feishu.png",
    },
  ] as const;

  const createdPlatforms: CreatedPlatforms = {};
  for (const platform of platforms) {
    const created = await prisma.platform.create({ data: platform });
    createdPlatforms[platform.name] = created;
  }

  // 创建测试数据
  const products = [
    {
      title: "产品经理入门课程",
      description: "从零开始学习产品经理必备知识和技能，包含需求分析、产品设计、项目管理等内容。",
      platformId: createdPlatforms["知识星球"].id,
      platformUrl: "https://zsxq.com/example1",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
      qrCode: "/qrcodes/zsxq-group.png",
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
      ],
      tags: {
        connect: [{ name: "产品经理" }, { name: "入门课程" }],
      },
      messages: {
        create: [
          {
            content:
              "大家好，欢迎加入产品经理入门课程学习群！我是课程讲师姜胡说。这里会分享一些课程补充内容和实践案例。",
            createdAt: new Date("2024-03-10T10:00:00Z"),
          },
          {
            content:
              "今天我们来聊聊如何做好用户调研。\n\n1. 确定调研目标\n2. 选择合适的调研方法\n3. 设计调研问题\n4. 招募合适的受访者\n5. 执行调研\n6. 整理和分析数据\n\n大家在实践中有遇到什么问题，欢迎在群里讨论。",
            createdAt: new Date("2024-03-11T14:30:00Z"),
          },
          {
            content:
              "分享一个实用的产品需求文档模板，适合刚入门的同学使用：https://example.com/prd-template\n\n包含了：\n- 产品概述\n- 用户场景\n- 功能需求\n- 交互设计\n- 数据指标",
            createdAt: new Date("2024-03-12T09:15:00Z"),
          },
          {
            content:
              "本周六下午3点，我们会在线上进行第一次直播答疑，主要解答大家在学习过程中遇到的问题。欢迎准备问题，到时见！",
            createdAt: new Date("2024-03-13T11:00:00Z"),
          },
          {
            content:
              "推荐一本产品经理必读的书籍：《用户思维+》\n\n这本书对理解用户需求和产品思维很有帮助，建议大家找时间读一读。",
            createdAt: new Date("2024-03-14T16:45:00Z"),
          },
        ],
      },
    },
    {
      title: "设计思维工作坊",
      description: "通过实践学习设计思维方法论，解决实际业务问题。为期两天的线下工作坊。",
      platformId: createdPlatforms["小报童"].id,
      platformUrl: "https://xbt.com/example2",
      imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12",
      qrCode: "/qrcodes/xbt-group.png",
      tags: {
        connect: [{ name: "设计思维" }, { name: "工作坊" }],
      },
      messages: {
        create: [
          {
            content:
              "工作坊微信群开通啦！请大家提前预习设计思维的基础概念，下周的工作坊会直接进入实践环节。",
            createdAt: new Date("2024-03-01T10:00:00Z"),
          },
          {
            content:
              "设计思维五个阶段：\n1. 同理心\n2. 定义问题\n3. 头脑风暴\n4. 原型设计\n5. 测试验证\n\n我们的工作坊会围绕这些阶段展开实践。",
            createdAt: new Date("2024-03-02T15:20:00Z"),
          },
          {
            content:
              "请大家准备好便利贴和记号笔，工作坊上会用到很多这些工具进行头脑风暴和原型设计。",
            createdAt: new Date("2024-03-03T09:30:00Z"),
          },
        ],
      },
    },
    {
      title: "产品复盘模板",
      description: "帮助产品经理进行项目复盘的模板工具，包含多个维度的分析框架。",
      platformId: createdPlatforms["飞书"].id,
      platformUrl: "https://feishu.com/example3",
      imageUrl: "https://images.unsplash.com/photo-1572021335469-31706a17aaef",
      qrCode: "/qrcodes/feishu-group.png",
      tags: {
        connect: [{ name: "产品工具" }, { name: "模板" }],
      },
    },
  ];

  // 先创建标签
  const tags = ["产品经理", "入门课程", "设计思维", "工作坊", "产品工具", "模板"];

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
