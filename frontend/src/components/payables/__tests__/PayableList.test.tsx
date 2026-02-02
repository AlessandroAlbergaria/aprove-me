import React from 'react';
import { render, screen } from '@testing-library/react';
import { PayableList } from '../PayableList';
import type { Payable } from '@/types';

const mockPayables: Payable[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    value: 1000.50,
    emissionDate: '2024-01-15',
    assignor: 'assignor-id-1',
  },
  {
    id: '223e4567-e89b-12d3-a456-426614174001',
    value: 2500.75,
    emissionDate: '2024-01-20',
    assignor: 'assignor-id-2',
  },
];

describe('PayableList', () => {
  it('should render loading state', () => {
    render(<PayableList payables={[]} isLoading={true} />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render empty state', () => {
    render(<PayableList payables={[]} isLoading={false} />);
    
    expect(screen.getByText('Nenhum recebível cadastrado')).toBeInTheDocument();
    expect(screen.getByText('Cadastrar Primeiro Recebível')).toBeInTheDocument();
  });

  it('should render payables list', () => {
    render(<PayableList payables={mockPayables} isLoading={false} />);
    
    const idElements = screen.getAllByText(/123e4567/);
    expect(idElements.length).toBeGreaterThan(0);
    
    const valueElements = screen.getAllByText(/R\$ 1\.000,50/);
    expect(valueElements.length).toBeGreaterThan(0);
    
    const dateElements = screen.getAllByText(/14\/01\/2024/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('should render action buttons when callbacks provided', () => {
    const onViewDetails = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <PayableList
        payables={mockPayables}
        isLoading={false}
        onViewDetails={onViewDetails}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    
    const verButtons = screen.getAllByText('Ver');
    const editarButtons = screen.getAllByText('Editar');
    const excluirButtons = screen.getAllByText('Excluir');
    
    expect(verButtons.length).toBeGreaterThan(0);
    expect(editarButtons.length).toBeGreaterThan(0);
    expect(excluirButtons.length).toBeGreaterThan(0);
  });
});
