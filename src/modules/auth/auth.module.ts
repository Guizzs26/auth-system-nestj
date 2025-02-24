import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CustomerModule } from '../customer/customer.module';
import { SignUpController, SignUpService } from './v1/sign-up';
import { SignInController, SignInService } from './v1/sign-in';
import {
  RefreshTokenController,
  RefreshTokenService,
} from './v1/refresh-token';
import { AuthHelper } from './v1/auth-helper/jwt/auth-helper';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    CustomerModule,
  ],
  controllers: [SignUpController, SignInController, RefreshTokenController],
  providers: [SignUpService, SignInService, RefreshTokenService, AuthHelper],
})
export class AuthModule {}
