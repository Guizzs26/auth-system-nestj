import { Injectable } from '@nestjs/common';

@Injectable()
export class SignOutService {
  async execute(accessToken: string, refreshToken: string): Promise<void> {}
}
