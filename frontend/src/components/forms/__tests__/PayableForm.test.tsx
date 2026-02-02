import { render, screen, waitFor } from '@testing-library/react';
import { PayableForm } from '../PayableForm';
import { assignorsService } from '@/lib/api';

jest.mock('@/lib/api', () => ({
  assignorsService: {
    getAll: jest.fn(),
  },
}));

const mockedAssignorsService = assignorsService as jest.Mocked<
  typeof assignorsService
>;

describe('PayableForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAssignorsService.getAll.mockResolvedValue([
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        document: '12345678900',
        email: 'test@test.com',
        phone: '11999999999',
        name: 'Test Assignor',
      },
    ]);
  });

  it('should render form with title', async () => {
    render(<PayableForm onSubmit={mockOnSubmit} />);
    await waitFor(() => {
      expect(screen.getByText('Cadastro de Recebível')).toBeInTheDocument();
    });
  });

  it('should render submit button', async () => {
    render(<PayableForm onSubmit={mockOnSubmit} />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Cadastrar/i })).toBeInTheDocument();
    });
  });

  it('should render clear button', async () => {
    render(<PayableForm onSubmit={mockOnSubmit} />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Limpar/i })).toBeInTheDocument();
    });
  });

  it('should render all input fields', async () => {
    render(<PayableForm onSubmit={mockOnSubmit} />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/550e8400-e29b-41d4-a716-446655440000/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/1000.00/i)).toBeInTheDocument();
    });
  });

  it('should load and display assignors in select', async () => {
    render(<PayableForm onSubmit={mockOnSubmit} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Test Assignor - 12345678900/i)).toBeInTheDocument();
    });
  });
});
