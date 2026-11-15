import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
class CreateTaskDto { @IsString() @MinLength(1) title!: string; @IsOptional() @IsString() description?: string; }
class UpdateTaskDto { @IsOptional() @IsString() @MinLength(1) title?: string; @IsOptional() @IsEnum(TaskStatus) status?: TaskStatus; }
@ApiTags('tasks') @ApiBearerAuth() @UseGuards(AuthGuard('jwt')) @Controller('projects/:projectId/tasks')
export class TasksController {
 constructor(private db: PrismaService) {}
 private async check(projectId: string, ownerId: string) {
  const project = await this.db.project.findFirst({ where: { id: projectId, ownerId } });
  if (!project) throw new NotFoundException('Project not found');
 }
 @Get() async list(@Req() req: any, @Param('projectId') projectId: string) { await this.check(projectId, req.user.id); return this.db.task.findMany({ where: { projectId } }); }
 @Post() async create(@Req() req: any, @Param('projectId') projectId: string, @Body() dto: CreateTaskDto) { await this.check(projectId, req.user.id); return this.db.task.create({ data: { ...dto, projectId } }); }
 @Patch(':id') async update(@Req() req: any, @Param('projectId') projectId: string, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
  await this.check(projectId, req.user.id);
  const result = await this.db.task.updateMany({ where: { id, projectId }, data: dto });
  if (!result.count) throw new NotFoundException('Task not found');
  return this.db.task.findUnique({ where: { id } });
 }
 @Delete(':id') async remove(@Req() req: any, @Param('projectId') projectId: string, @Param('id') id: string) {
  await this.check(projectId, req.user.id);
  const result = await this.db.task.deleteMany({ where: { id, projectId } });
  if (!result.count) throw new NotFoundException('Task not found');
  return { deleted: true };
 }
}
