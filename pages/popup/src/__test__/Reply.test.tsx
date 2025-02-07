import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Reply } from '../components/Reply';
import { vi } from 'vitest';

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Header component correctly', () => {
    render(<Reply />);

    expect(document.body).toMatchSnapshot();
  });
});
