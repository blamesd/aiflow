"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const env_config_1 = require("./config/env.config");
const prisma_module_1 = require("./common/modules/prisma.module");
const user_module_1 = require("./modules/user/user.module");
const app_module_1 = require("./modules/app/app.module");
const workflow_module_1 = require("./modules/workflow/workflow.module");
const rag_module_1 = require("./modules/rag/rag.module");
const skill_module_1 = require("./modules/skill/skill.module");
const ai_module_1 = require("./modules/ai/ai.module");
const mcp_module_1 = require("./modules/mcp/mcp.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: (config) => {
                    return env_config_1.envSchema.parse(config);
                },
            }),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
                },
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            prisma_module_1.PrismaModule,
            user_module_1.UserModule,
            app_module_1.AppModule,
            workflow_module_1.WorkflowModule,
            rag_module_1.RAGModule,
            skill_module_1.SkillModule,
            ai_module_1.AiModule,
            mcp_module_1.McpModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map