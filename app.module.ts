import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsController } from './projects/projects.controller';
import { TasksController } from './tasks/tasks.controller';
@Module({ imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule], controllers: [ProjectsController, TasksController], providers: [PrismaService] })
export class AppModule {}
