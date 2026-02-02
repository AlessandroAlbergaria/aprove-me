export interface Assignor {
  id: string;
  document: string;
  email: string;
  phone: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAssignorDto {
  id: string;
  document: string;
  email: string;
  phone: string;
  name: string;
}

export interface UpdateAssignorDto {
  document?: string;
  email?: string;
  phone?: string;
  name?: string;
}
