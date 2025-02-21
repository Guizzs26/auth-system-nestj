export class SignUpResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}
