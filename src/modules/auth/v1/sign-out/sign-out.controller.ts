import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignOutService } from './sign-out.service';
import { ZodValidationPipe } from 'src/common/libs/core/pipes';
import { refreshTokenSchema } from '../refresh-token/schema/refresh-token.schema';
import { RefreshTokenDto } from '../refresh-token/dto/refresh-token.dto';

@ApiTags('Auth')
@Controller({ path: 'auth/signout' })
export class SignoutController {
  constructor(private readonly signoutService: SignOutService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(refreshTokenSchema))
  public async signOut(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ message: string }> {
    await this.signoutService.execute();
    return { message: 'Signout realizado com sucesso.' };
  }
}
