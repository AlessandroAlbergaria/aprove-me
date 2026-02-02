import { render, screen } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('should render input with label', () => {
    render(<Input label="Nome" />);
    expect(screen.getByText('Nome')).toBeInTheDocument();
  });

  it('should render input with error message', () => {
    render(<Input label="Email" error="Email inválido" />);
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render input with helper text', () => {
    render(<Input label="Senha" helperText="Mínimo 6 caracteres" />);
    expect(screen.getByText('Mínimo 6 caracteres')).toBeInTheDocument();
  });

  it('should show required asterisk when required', () => {
    render(<Input label="Campo obrigatório" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should apply disabled styles when disabled', () => {
    render(<Input label="Campo" disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});
