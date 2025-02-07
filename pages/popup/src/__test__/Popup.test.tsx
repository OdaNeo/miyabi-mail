import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Popup } from '../Popup';
import { vi } from 'vitest';

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Header component correctly', () => {
    render(<Popup />);

    expect(document.body).toMatchSnapshot();
  });
});
