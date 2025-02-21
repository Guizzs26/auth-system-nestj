import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CustomerModule } from '../customer/customer.module';
import { SignUpController, SignUpService } from './v1/sign-up';
import { SignInController, SignInService } from './v1/sign-in';
import { JwtStrategy } from './jwt/passport-jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '28800s',
      },
    }),
    CustomerModule,
  ],
  controllers: [SignUpController, SignInController],
  providers: [SignUpService, SignInService, JwtStrategy],
})
export class AuthModule {}
