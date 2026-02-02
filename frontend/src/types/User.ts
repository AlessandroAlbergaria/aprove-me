export interface User {
  id: string;
  login: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface CreateUserDto {
  login: string;
  password: string;
}

export interface UpdateUserDto {
  login?: string;
  password?: string;
}
