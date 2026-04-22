import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { envSchema } from './config/env.config';
import { PrismaModule } from './common/modules/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AppModule as ApplicationModule } from './modules/app/app.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { RAGModule } from './modules/rag/rag.module';
import { SkillModule } from './modules/skill/skill.module';
import { AiModule } from './modules/ai/ai.module';
import { McpModule } from './modules/mcp/mcp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config: Record<string, any>) => {
        return envSchema.parse(config);
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule,
    UserModule,
    ApplicationModule,
    WorkflowModule,
    RAGModule,
    SkillModule,
    AiModule,
    McpModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
