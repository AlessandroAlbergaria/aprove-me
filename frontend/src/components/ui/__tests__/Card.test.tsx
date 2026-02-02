import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('should render card with children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should render card with title', () => {
    render(<Card title="Card Title">Content</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('should render card with subtitle', () => {
    render(<Card title="Title" subtitle="Subtitle">Content</Card>);
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('should render card with footer', () => {
    render(<Card footer={<div>Footer content</div>}>Content</Card>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('should render without padding when noPadding is true', () => {
    const { container } = render(<Card noPadding>Content</Card>);
    const contentDiv = container.querySelector('div > div:last-child');
    expect(contentDiv).not.toHaveClass('px-6');
  });
});
