
NextAuth.js 在内部自动处理了 JWT 的生成和存储。让我详细解释这个过程：

1. JWT 生成过程：

当用户登录成功后（通过 `signIn` 函数），NextAuth 会：

```typescript:src/app/api/auth/[...nextauth]/route.ts
export const authOptions: NextAuthOptions = {
  // ... 其他配置

  callbacks: {
    // 1. 首先调用 jwt 回调，这里可以自定义 JWT 的内容
    async jwt({ token, user }) {
      if (user) {
        // user 对象来自 authorize 函数的返回值
        token.id = user.id;  // 将用户ID加入到 token 中
        // 可以添加其他信息
        // token.role = user.role;
        // token.permissions = user.permissions;
      }
      return token;
    },

    // 2. 然后调用 session 回调，这里决定了客户端可以访问的会话信息
    async session({ session, token }) {
      if (session.user) {
        // 将 token 中的信息同步到 session 中
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  // 3. JWT 配置
  jwt: {
    // secret: process.env.NEXTAUTH_SECRET, // JWT 加密密钥
    // maxAge: 60 * 60 * 24 * 7, // JWT 过期时间
  },

  // 4. Cookie 配置
  cookies: {
    // sessionToken: {
    //   name: `__Secure-next-auth.session-token`,
    //   options: {
    //     httpOnly: true,
    //     sameSite: 'lax',
    //     path: '/',
    //     secure: true
    //   }
    // }
  },
};
```

2. JWT 生成和存储的具体流程：

```typescript
// 当用户调用 signIn 时
const result = await signIn("credentials", {
  email,
  password,
  redirect: false,
});

// NextAuth 内部处理流程：
// 1. 调用 authorize 函数验证凭证
async authorize(credentials) {
  // ... 验证逻辑
  return {
    id: user.id,
    email: user.email,
    // ... 其他用户信息
  };
}

// 2. 生成 JWT
// node_modules/next-auth/src/jwt/index.ts
async function encode({
  token,  // 来自 authorize 返回的用户信息
  secret, // NEXTAUTH_SECRET
  maxAge  // token 有效期
}) {
  // 使用 jose 库加密 token
  const encodedToken = await new SignJWT(token)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(maxAge)
    .sign(secret)

  return encodedToken
}

// 3. 设置 Cookie
// node_modules/next-auth/src/core/lib/cookie.ts
function setCookie(res, cookie) {
  res.setHeader("Set-Cookie", cookie)
}
```

3. Cookie 的默认配置：

```typescript
// node_modules/next-auth/src/core/lib/cookie.ts
const defaultCookieOptions = {
  // 仅服务器可读取
  httpOnly: true,

  // 仅相同域名可用
  sameSite: "lax" as const,

  // Cookie 路径
  path: "/",

  // 仅 HTTPS
  secure: process.env.NODE_ENV === "production",

  // Cookie 有效期
  maxAge: 30 * 24 * 60 * 60 // 30 days
}
```

4. JWT 的验证过程：

```typescript
// 当请求受保护的路由时
// node_modules/next-auth/src/jwt/index.ts
async function decode({
  token,  // 从 Cookie 中获取的 token
  secret  // NEXTAUTH_SECRET
}) {
  // 验证 token 签名和过期时间
  const verified = await jwtVerify(token, secret)
  return verified.payload
}
```

NextAuth 会：

1. 从请求的 Cookie 中读取 JWT
2. 验证 JWT 的签名（使用 NEXTAUTH_SECRET）
3. 检查 JWT 是否过期
4. 如果验证通过，将解密后的用户信息注入到请求中

这就是为什么我们只需要配置 `NEXTAUTH_SECRET`，而不需要手动处理 JWT 的生成、存储和验证过程。NextAuth 在内部使用了安全的最佳实践来处理这些事情。

需要我详细解释某个部分吗？
