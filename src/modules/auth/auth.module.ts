import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CustomerModule } from '../customer/customer.module';
import { SignUpController, SignUpService } from './v1/sign-up';
import { SignInController, SignInService } from './v1/sign-in';
import { AuthHelper } from './v1/auth-helper/jwt/auth-helper';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '8d',
      },
    }),
    CustomerModule,
  ],
  controllers: [SignUpController, SignInController],
  providers: [SignUpService, SignInService, AuthHelper],
})
export class AuthModule {}
