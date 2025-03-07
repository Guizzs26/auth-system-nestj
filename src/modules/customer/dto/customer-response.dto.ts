export class CustomerResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
