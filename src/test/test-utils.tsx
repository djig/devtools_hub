/**
 * Test utilities for rendering components with providers
 * Re-exports testing library utilities for convenience
 */

import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

interface WrapperProps {
  children: ReactNode;
}

/**
 * Wrapper component that provides all necessary contexts
 * Add more providers here as needed (e.g., ThemeProvider, Redux, etc.)
 */
function AllProviders({ children }: WrapperProps) {
  return (
    <BrowserRouter>
      <Toaster />
      {children}
    </BrowserRouter>
  );
}

/**
 * Custom render function that wraps component with providers
 *
 * @example
 * import { render, screen } from '@/test/test-utils';
 *
 * test('renders component', () => {
 *   render(<MyComponent />);
 *   expect(screen.getByText('Hello')).toBeInTheDocument();
 * });
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Override render with custom render
export { customRender as render };
