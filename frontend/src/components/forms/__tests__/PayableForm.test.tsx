import { render, screen } from '@testing-library/react';
import { PayableForm } from '../PayableForm';

describe('PayableForm', () => {
  const mockOnSubmit = jest.fn();

  it('should render form with title', () => {
    render(<PayableForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Cadastro de Recebível')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<PayableForm onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('button', { name: /Cadastrar/i })).toBeInTheDocument();
  });

  it('should render clear button', () => {
    render(<PayableForm onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('button', { name: /Limpar/i })).toBeInTheDocument();
  });

  it('should render all input fields', () => {
    render(<PayableForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByPlaceholderText(/550e8400-e29b-41d4-a716-446655440000/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/1000.00/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/550e8400-e29b-41d4-a716-446655440001/i)).toBeInTheDocument();
  });

  it('should render helper texts', () => {
    render(<PayableForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText(/UUID v4 válido/i)).toBeInTheDocument();
    expect(screen.getByText(/Valor em reais/i)).toBeInTheDocument();
    expect(screen.getByText(/Data de emissão do recebível/i)).toBeInTheDocument();
    expect(screen.getByText(/UUID v4 do cedente/i)).toBeInTheDocument();
  });
});
