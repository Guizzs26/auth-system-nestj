import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The unique identifier of the customer',
  })
  id: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the customer',
  })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the customer' })
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the customer',
  })
  email: string;
  @ApiProperty({
    example: 'USER',
    description: 'The role of the customer',
    enum: ['ADMIN', 'EMPLOYEE', 'USER'],
  })
  role: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: "The URL of the customer's avatar",
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    example: '2023-10-01T00:00:00.000Z',
    description: 'The date the customer was created',
    required: false,
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-01T00:00:00.000Z',
    description: 'The date the customer was last updated',
    required: false,
  })
  updatedAt: Date;
}
