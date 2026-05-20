"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('3001'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    FRONTEND_URL: zod_1.z.string().default('http://localhost:5173'),
    JWT_SECRET: zod_1.z.string().min(1, 'JWT_SECRET is required'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    QWEN_API_KEY: zod_1.z.string().min(1, 'QWEN_API_KEY is required'),
    QWEN_BASE_URL: zod_1.z.string().default('https://dashscope.aliyuncs.com/compatible-mode/v1'),
    UPLOAD_PATH: zod_1.z.string().default('./uploads'),
    MAX_FILE_SIZE: zod_1.z.string().default('10485760'),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
});
//# sourceMappingURL=env.config.js.map