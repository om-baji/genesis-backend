import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminService } from './admin/admin.service';
import { ProxyService } from './proxy/proxy.service';
import { AnalyticsService } from './analytics/analytics.service';
import { InputService } from './input/input.service';
import { ExportsService } from './exports/exports.service';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './utils';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

@Module({
  imports : [AuthModule],
  controllers: [AppController],
  providers: [AppService, AdminService, ProxyService, AnalyticsService, InputService, ExportsService, AuthService, PrismaService, JwtService],
})
export class AppModule { }
