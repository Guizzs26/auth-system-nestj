import { Injectable } from '@nestjs/common';
import { CustomerService } from 'src/modules/customer/customer.service';
import { SignUpDto } from './dto/sign-up.dto';
import { EmailAlreadyInUseException } from 'src/common/libs/core/exceptions';
import { hash } from 'bcrypt';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { SALT_ROUNDS } from './constants';

@Injectable()
export class SignUpService {
  constructor(private readonly customerService: CustomerService) {}

  public async execute({
    firstName,
    lastName,
    email,
    password,
    role,
    avatar,
  }: SignUpDto): Promise<SignUpResponseDto> {
    const emailTaken = await this.customerService.findCustomerByEmail(email);

    if (emailTaken) {
      throw new EmailAlreadyInUseException();
    }

    const hashedPassword = await hash(password, SALT_ROUNDS);

    const newCustomer = await this.customerService.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      avatar,
    });

    const { password: _, ...customerWithoutPassword } = newCustomer;

    return customerWithoutPassword;
  }
}
