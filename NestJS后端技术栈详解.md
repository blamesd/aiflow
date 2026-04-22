# FlowAI Studio - NestJS 后端技术栈核心学习指南

本指南梳理了 `aiflow-studio` 后端项目所涉及的核心技术栈体系，不仅涵盖独立知识点，还指出了它们到底在这个 AI 编排应用中是用来解决什么问题的，帮助您快速掌控企业级 Node.js 架构的全局视野。

## 1. 核心框架与基础设施层

### 1.1 NestJS (底层骨架)
NestJS 是一套深受 Angular 启发的框架，自带高度规范的 IoC (控制反转) 与依赖注入 (DI) 系统，完美解决大型项目越写越乱的问题。
- **模块化 (Modules)**：项目中所有的代码不是散落的，而是被归档拼装在不同的 `xxxx.module.ts` 中（例如用来处理 AI 聊天的 AI 模块、处理用户的 User 模块）。
- **请求派发 (Controllers)**：控制器只管接客。学习利用装饰器（如 `@Get('list')`, `@Post()`, `@Body()`, `@Query()`），将前端的 HTTP 协议包切分成标准的参数分配给业务层处理。
- **业务中枢 (Providers/Services)**：业务逻辑的栖息地。所有的逻辑单元应该被前缀 `@Injectable()` 包裹，从而让框架在任意环节替你查找到它并注入（如在控制器内通过 `constructor(___Service)`直接使用）。

### 1.2 TypeScript 高阶特性
作为构建底层坚不可摧防线的武器，您需要彻底熟悉：
- **Decorator (装饰器)**：Nest 几乎一切都离不开装饰器（元数据反射机制实现）。例如如何自己写一个 `@Roles()` 装饰器来绑定特权角色。
- **类型映射**：Partial, Omit, Pick 等泛型工具。

---

## 2. 数据层操作指南

### 2.1 Prisma ORM (数据大脑)
在这个架构中，放弃了直接写 SQL 代码，转为使用了 Prisma，这带来了代码补全体验上的巨大提升。
- **配置结构模式 (Schema)**：在 `prisma/schema.prisma` 文件中利用直观易懂的 DSL 语言描述数据库的轮廓（模型、表关系如一对多 / 多对多）。
- **生成强类型客户端**：了解当你运行 `prisma generate` 时，是如何通过内省数据库反向构建出绝对无死角的 Client 提示器的。
- **实战数据库操作**：调用 `prisma.xxxx.findUnique()` / `create()` / `update()` 等实现高内聚的连表查（include / select 手法）。
- **同步迁移 (Migrate/Push)**：了解如何用指令将你在 Schema 中的变动自动落地成为数据库真正的变更。

### 2.2 SQLite
作为本项目的轻量化基石存储配置，它作为应用外挂单一文件引擎提供强大的支持。无需在开发机器上像挂载 MySQL 或 PostgreSQL 那样启动服务即可完成全特性实战。

---

## 3. 安全防护与认证流派

### 3.1 JWT (JSON Web Tokens) 与 Passport
用于做状态无关的身份卡牌签发以及核验引擎。
- **加密签发机制**：用户传入账号密码鉴权成功后，利用 `@nestjs/jwt` 给它盖章签发一张内含身份信息的令牌（Token）发放给前端。
- **Passport 护卫兵**：配置和编写并激活对应的验证策略文件（JwtStrategy）。拦截前端发送的所有 `Bearer {Token}` 头结构，并识别此人是谁。
- **AuthGuard**：写好的守卫只需在特定的必须登录的接口加一句 `@UseGuards(JwtAuthGuard)` 即可防住非法请求。

### 3.2 密码不可逆保护机制 (bcryptjs)
绝对不能明文存密码！学习密码库的基本常识：
- 认识使用 `bcrypt.hashSync()` 或者 `bcrypt.hash()` 如何通过加入随机碎片（打盐 Salt）来对一段密码产生单向哈希，甚至连站长也反推不出对方具体写了啥。
- 利用 `bcrypt.compare()` 进行客户端密码与数据库暗文撞对。

---

## 4. 全面的输入防护兵团

### 4.1 Class Validator & Class Transformer (表单守门员)
前端丢过来的不可信数据在送到给 Services 处理之前就应该被无情盘查。
- 掌握写一个数据传输对象（DTO, Data Transfer Object）的类格式。
- 直接在你关心的类属性上打上 `@IsString()`, `@IsOptional()`, `@IsNumber()`, `@Length()` 等注解。
- 让 Nest 开启一个全局拦截的 `ValidationPipe`（验证管道），它如果发现不合规字段，会直接抛出含有错误文案的 `HTTP 400 Bad Request` 并退回，连进入内层操作的机会都没有。

### 4.2 Zod (环境变量审计)
环境配置决定服务能不能在正确地状态跑起来。如果在开发人员忘写 `QWEN_API_KEY` 或连接字符串等致命关键 `.env` 字段时，Zod 能在项目启动的非常早期瞬间察觉：
- 通过极其声明式的手法定义出必须存在的属性约束，如果不合规，立刻拒绝服务器上线并提供非常详尽的调试日志。

---

## 5. 项目中的特殊业务生态位

### 5.1 Multer 文件抓捕手
因为这是一个带 RAG（检索增强知识库）概念的平台，必然涉及到用户在上面上传 `PDF` 或者 `Word` 并切割：
- 需要去熟悉 `FileInterceptor` 这个特殊的上传文件拦截器。
- 学习如何在接口用 `@UploadedFile()` 剥离并获取到用户上传那个大型实体文件，并安全地保存下发到系统特定的解析通道里。

### 5.2 Axios 与 RxJS
在这里重点作用不在于提供接口，在于 **访问别人的接口**。
- **Axios** 用于与外围世界如 LLM 的 API 提供商建立直接通信连接。
- **RxJS 基本盘**：因为 Nest 自带的 Http 服务包装往往会丢回一个叫 `Observable` （流 / 可观察层）的东西。在简单的通讯里，往往会经常需要去用 `lastValueFrom()` 或者 `firstValueFrom()` 将这种源源不断的流强制扁平化处理转换成开发者熟悉的 `Promise` 去 `await`。
