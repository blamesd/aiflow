import { z } from 'zod';
export declare const envSchema: z.ZodObject<{
    PORT: z.ZodDefault<z.ZodString>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    FRONTEND_URL: z.ZodDefault<z.ZodString>;
    JWT_SECRET: z.ZodString;
    JWT_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    QWEN_API_KEY: z.ZodString;
    QWEN_BASE_URL: z.ZodDefault<z.ZodString>;
    UPLOAD_PATH: z.ZodDefault<z.ZodString>;
    MAX_FILE_SIZE: z.ZodDefault<z.ZodString>;
    DATABASE_URL: z.ZodString;
}, "strip", z.ZodTypeAny, {
    PORT: string;
    NODE_ENV: "development" | "production" | "test";
    FRONTEND_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    QWEN_API_KEY: string;
    QWEN_BASE_URL: string;
    UPLOAD_PATH: string;
    MAX_FILE_SIZE: string;
    DATABASE_URL: string;
}, {
    JWT_SECRET: string;
    QWEN_API_KEY: string;
    DATABASE_URL: string;
    PORT?: string | undefined;
    NODE_ENV?: "development" | "production" | "test" | undefined;
    FRONTEND_URL?: string | undefined;
    JWT_EXPIRES_IN?: string | undefined;
    QWEN_BASE_URL?: string | undefined;
    UPLOAD_PATH?: string | undefined;
    MAX_FILE_SIZE?: string | undefined;
}>;
export type EnvConfig = z.infer<typeof envSchema>;
