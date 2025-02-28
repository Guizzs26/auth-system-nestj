import {
  Controller,
  Post,
  Headers,
  UnauthorizedException,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignOutService } from './sign-out.service';
import { ZodValidationPipe } from 'src/common/libs/core/pipes';
import { signOutSchema } from './schemas/sign-out.schema';
import { JwtAuthGuard } from '../../auth.guard';

@ApiTags('Auth')
@Controller({ path: 'auth/signout' })
export class SignOutController {
  constructor(private readonly signOutService: SignOutService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(signOutSchema))
  public async signOut(
    @Headers('authorization') authHeader: string,
    @Headers('refresh-token') refreshToken: string,
  ) {
    const accessToken = authHeader.split(' ')[1];
    await this.signOutService.execute(accessToken, refreshToken);

    return { message: 'Successfully signed out' };
  }
}
