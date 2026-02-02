export interface Payable {
  id: string;
  value: number;
  emissionDate: string;
  assignor: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePayableDto {
  id: string;
  value: number;
  emissionDate: string;
  assignor: string;
}

export interface UpdatePayableDto {
  value?: number;
  emissionDate?: string;
  assignor?: string;
}
