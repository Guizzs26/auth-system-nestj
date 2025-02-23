import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CustomerModule } from '../customer/customer.module';
import { SignUpController, SignUpService } from './v1/sign-up';
import { SignInController, SignInService } from './v1/sign-in';
import { SignoutController, SignOutService } from './v1/sign-out';
import {
  RefreshTokenController,
  RefreshTokenService,
} from './v1/refresh-token';
import { AuthHelper } from './v1/helpers/jwt/auth.helper';
import { RefreshTokenHelper } from './v1/helpers/jwt/refresh-token.helper';

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
  controllers: [
    SignUpController,
    SignInController,
    SignoutController,
    RefreshTokenController,
  ],
  providers: [
    SignUpService,
    SignInService,
    SignOutService,
    RefreshTokenService,
    AuthHelper,
    RefreshTokenHelper,
  ],
})
export class AuthModule {}
