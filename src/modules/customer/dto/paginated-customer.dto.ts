import { CustomerResponseDto } from './customer-response.dto';

export class PaginatedCustomerResponseDto {
  data: CustomerResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
