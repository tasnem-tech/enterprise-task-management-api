import { Body, ConflictException, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
class CredentialsDto { @IsEmail() email!: string; @IsString() @MinLength(8) password!: string; }
@ApiTags('auth')
@Controller('auth')
export class AuthController {
 constructor(private db: PrismaService, private jwt: JwtService) {}
 @Post('register')
 async register(@Body() dto: CredentialsDto) {
  if (await this.db.user.findUnique({ where: { email: dto.email } })) throw new ConflictException('Email already registered');
  const user = await this.db.user.create({ data: { email: dto.email, passwordHash: await bcrypt.hash(dto.password, 12) } });
  return { id: user.id, email: user.email, role: user.role };
 }
 @Post('login')
 async login(@Body() dto: CredentialsDto) {
  const user = await this.db.user.findUnique({ where: { email: dto.email } });
  if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new UnauthorizedException('Invalid credentials');
  return { access_token: await this.jwt.signAsync({ sub: user.id, role: user.role }) };
 }
}
