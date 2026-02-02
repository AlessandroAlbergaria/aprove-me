export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  statusCode?: number;
  error?: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface IntegrationResponse {
  payable: {
    id: string;
    value: number;
    emissionDate: string;
    assignorId: string;
    createdAt: string;
    updatedAt: string;
  };
  assignor: {
    id: string;
    document: string;
    email: string;
    phone: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}
