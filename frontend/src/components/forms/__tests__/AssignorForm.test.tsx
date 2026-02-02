import { render, screen } from '@testing-library/react';
import { AssignorForm } from '../AssignorForm';

describe('AssignorForm', () => {
  const mockOnSubmit = jest.fn();

  it('should render form with title', () => {
    render(<AssignorForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Cadastro de Cedente')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<AssignorForm onSubmit={mockOnSubmit} />);
    expect(
      screen.getByRole('button', { name: /Cadastrar/i })
    ).toBeInTheDocument();
  });

  it('should render clear button', () => {
    render(<AssignorForm onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('button', { name: /Limpar/i })).toBeInTheDocument();
  });

  it('should render all input fields', () => {
    render(<AssignorForm onSubmit={mockOnSubmit} />);

    expect(
      screen.getByPlaceholderText(/550e8400-e29b-41d4-a716-446655440000/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/12345678900/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/cedente@exemplo.com/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/11999999999/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Nome do Cedente/i)
    ).toBeInTheDocument();
  });

  it('should render helper texts', () => {
    render(<AssignorForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText(/UUID v4 válido/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Apenas números, máximo 30 caracteres/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Email válido, máximo 140 caracteres/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Máximo 20 caracteres/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Máximo 140 caracteres/i).length).toBe(2);
  });
});
