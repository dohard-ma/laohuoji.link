这个错误表明数据库中没有 User 表。我们需要运行 Prisma 命令来创建数据库表。

1. 首先确保 `prisma/schema.prisma` 文件内容正确：

```prisma:prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String?
  avatar        String?
  bio           String?
  specialties   String[]  // 擅长领域
  needs         String[]  // 需求领域
  tags          Tag[]     @relation("UserTags")
  badges        Badge[]   @relation("UserBadges")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  users     User[]   @relation("UserTags")
}

model Badge {
  id          String   @id @default(cuid())
  name        String
  description String
  imageUrl    String
  type        String   // 'course' | 'participation'
  users       User[]   @relation("UserBadges")
}
```

2. 然后运行以下命令来同步数据库：

```bash
# 生成 Prisma 客户端
npx prisma generate

# 重置数据库（如果需要）
npx prisma db push --force-reset

# 同步数据库结构
npx prisma db push
```

3. 可以使用 Prisma Studio 来验证数据库表是否创建成功：

```bash
npx prisma studio
```

4. 如果遇到权限问题，可以在 PostgreSQL 中手动创建数据库：

```sql
-- 使用 psql 连接数据库
psql -U postgres

-- 创建数据库
CREATE DATABASE jianghushuo;

-- 授予所有权限
GRANT ALL PRIVILEGES ON DATABASE jianghushuo TO postgres;
```

5. 如果还是有问题，可以检查数据库连接：

```bash
# 使用 psql 测试连接
psql "postgresql://postgres:D0hard%40ma@localhost:5432/jianghushuo"
```

需要我详细解释某个步骤吗？或者你遇到了其他问题？
