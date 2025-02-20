import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [CustomerModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
