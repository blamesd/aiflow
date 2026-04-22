# 🚀 FlowAI Studio - NestJS 后端全景架构与源码级学习手册 (终极扩充版)

这份文档是对前一份大纲的**数倍级深度扩充**。我们将不仅停留在“是什么”，而是深入带你了解“底层是怎么运行的”、“为什么要这样设计”，以及“在项目中如何阅读和编写真实业务代码”。

---

## 一、 NestJS 核心设计哲学 (IoC 与生命周期)

NestJS 最大的魅力在于它极其硬核和稳健的架构，它强制把代码关在“笼子”里，使得系统再庞大也不容易腐化。

### 1.1 依赖注入 (DI) 与控制反转 (IoC)
在传统的 Express 项目里，我们往往随意 `require` 文件，然后直接 `new` 出对象。这会导致高度耦合。
而在 NestJS 中，你**永远不该去 `new` 一个服务**，而是交给框架去打理。

* **如何写一个被框架接管的服务 (Provider)**
```typescript
import { Injectable } from '@nestjs/common';

@Injectable() // 这个装饰器就是把类交给 NestJS 的 IoC 容器去托管的钥匙
export class UserService {
  findOne(id: string) {
    return `返回了用户 ${id}`;
  }
}
```

* **如何在控制器 (Controller) 里面拿到它**
```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  // 注意！你不是在构造函数里写 this.userService = new UserService()
  // 你只是声明了你需要什么，Nest 框架会在启动时，自动帮你把实例 "注入" 进来
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
```

### 1.2 Nest 请求生命周期（绝对核心核心！）
当一个 HTTP 请求打到你的系统上，在它真正到达你的 Controller 代码之前，它要经过层层关卡，顺序如下。**必须死记硬背这个顺序：**

`客户端请求` ➡️ **Middleware (中间件)** ➡️ **Guard (守卫)** ➡️ **Interceptor (请求体拦截器)** ➡️ **Pipe (管道/校验)** ➡️ `【到达你的 Controller 层】` ➡️ **Interceptor (响应拦截器)** ➡️ `返回客户端` 
*(如果在任何环节报错，直接被 **Exception Filter (异常过滤器)** 捕获接管)*。

---

## 二、 参数过滤防线：Class Validator 与 Pipe

在复杂的 AI 编排系统里，前端传来的参数如同“来自互联网的脏水”，必须清洗干净。

**1. 定义 DTO (Data Transfer Object)**
DTO 是前后端交流的明确契约，结合类特性，我们利用 `class-validator` 强化它。
```typescript
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateNodeDto {
  @IsString({ message: "节点名称必须是字符串" }) 
  @IsNotEmpty()
  nodeName: string;

  @IsOptional()
  @MaxLength(500)
  description?: string;
}
```

**2. 在拦截口使用 ValidationPipe**
如果参数传来的时候 `nodeName` 传了个整数 `123`，会在 `ValidationPipe` 这个管道节点直接被拦截掉抛出错误 400（Bad Request），连进入 Controller 的资格都没有。

---

## 三、 数据持久层深度剖析模型：Prisma ORM

Prisma 是整个 TypeScript 生态目前最火的类型安全连库工具。它抛弃了传统的代码建表模式。

### 3.1 从 Schema 洞悉数据库灵魂
在 `prisma/schema.prisma` 文件中定义模型，就像是用最纯粹的语法搭建数据城堡：

```prisma
// 例如：知识库表
model KnowledgeBase {
  id        String     @id @default(uuid()) // 主键，自动生成 UUID
  name      String
  ownerId   String
  // 一对多关系，外键绑定
  owner     User       @relation(fields: [ownerId], references: [id])
  documents Document[] // 反向反查的虚拟字段
  createdAt DateTime   @default(now())
}
```

### 3.2 真正完美的智能推导
在你执行 `npx prisma generate` 之后，你在执行数据库操作时会有非常极其变态的类型提示：
```typescript
const kb = await this.prisma.knowledgeBase.findUnique({
  where: { id: "xx-xx-xx" },
  include: {
    owner: true // 如果不加这个，kb 打印出来不带 User 的信息；加了，类型会帮你挂载关联对象。
  }
});
```

---

## 四、 JWT、Passport 与鉴权攻防

系统的登录态是怎么维持和受保护的？

### 4.1 登录颁发：为什么用 JWT
由于服务器想做“无状态（不用存 session 把服务器内存撑爆）”，当用户登录时，服务器用自己的 `JWT_SECRET` 对用户的 `userId` 加上过期时间，用哈希算法加密为一长串无意义 Base64 字符串（即 JWT），返回给前台。前台以后每次请求都把它塞进 HTTP 的 `Authorization: Bearer <Token>` 请求头里。

### 4.2 AuthGuard：守卫把关
你可以自己写一个策略（Strategy），去解析头部的 JWT：
```typescript
import { JwtAuthGuard } from '@nestjs/passport';

@UseGuards(JwtAuthGuard) // 这一句加在接口上，就会立刻调用你的策略去解析 Header 里的令牌是否造假或过期
@Get('profile')
getProfile(@Request() req) {
  // 如果执行到这里，说明一定是个活着的正常人，并且能在 req.user 取到对应解开后的人名信息
  return req.user;
}
```

### 4.3 bcrypt 怎么存密码
这绝对是行业标准：
**存入时**： `const hash = bcrypt.hashSync("admin123", 10);` （10是盐轮数，越高越难暴力破解）。最终存进数据库的可能是 `$2a$10$xyz....` 的天书。
**比对时**： `bcrypt.compareSync("admin123", hash);` （只要是对的，就是 true）。即便是泄露了数据库，黑客也无法用彩虹表反向查出原来密码叫 `admin123`，这就是**单向散列**的美学。

---

## 五、 超深层环境变量保护：Zod

为了防止部署的时候有人敲烂了 `.env` 文件。
本项目用到了 `Zod` 来验证环境文件，比原生的 Joi 或自定义校验更具有 TS 支持性：
```typescript
import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().transform(Number).default('3000'), // 能把字符串转正数字
  DATABASE_URL: z.string().url(), // 必须符合 URL 格式
  JWT_SECRET: z.string().min(10), // 秘钥不能少于 10 个字母不然不安全
});

// 如果解析 .env 时没过关，进程在启动的 0.1 毫秒就会直接 panic 崩溃退出并报错。
```

---

## 六、 应对高级业务：Multer 与 RxJS 之谜

### 6.1 Multer 上传模块揭秘
你要接管类似知识库的 PDF：
```typescript
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Post('upload')
@UseInterceptors(FileInterceptor('file')) // 拦截这个属性名叫'file'的多重表单数据
uploadFile(@UploadedFile() file: Express.Multer.File) {
  // file.buffer 就是在内存里切碎好的二进制文件本身，或者如果是落盘模式存的就是服务器上的路径
  console.log(file); 
}
```

### 6.2 RxJS (流与异步通信的艺术)
普通的 `async/await` 虽然好用，但它只能处理 "去一下，回一次" 的请求。
对于系统底层的 HTTP 请求和事件监听，NestJS 采用强大的 RxJS：
* **Observable (可观察对象)**：你可以把它当成一台在某个远端不停往你这里下雨的造雨机。
* **在 Axios 中的转化**：调用 `this.httpService.get()` 不会返回 Promise，而是给你一个 `Observable<Response>`。
通常在简单的使用中，你只需要写 `firstValueFrom(this.httpService.get(...))` 将流的第一滴雨水硬生生塞进 Promise，就可以兼容你以前所有熟悉的 `await` 操作了。

---

## 终极建议
学习这套技术栈最好的办法是：**跟踪一条完整的数据流向**。
1. 在浏览器随便触发一条修改用户信息的接口，打开控制台看 Network 发了什么。
2. 找到 Nest 里的 `user.controller.ts`，打个 `console.log`，看看怎么流进 Controller。
3. 进入对应的 `user.service.ts` 看看它是怎么通过 `PrismaClient` 把你刚传的名字更新进数据库的。
4. 去找打在这条全链条旁边的 `@UseGuards` 或 `Dto` 看他们是怎么保驾护航的。

这套架构理解了，你可以徒手搭出淘宝一样的任何大中型后台服务！
