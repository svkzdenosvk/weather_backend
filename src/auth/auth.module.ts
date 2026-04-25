import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';

// ak bude rpoblem s tokenmi tak miesto jwtmodule.register .. toto:
// JwtModule.registerAsync({
//   imports: [ConfigModule],
//   useFactory: (configService: ConfigService) => ({
//     secret: configService.get('JWT_SECRET'),
//     signOptions: { expiresIn: '1d' },
//   }),
//   inject: [ConfigService],
// }),

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'supersecret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
