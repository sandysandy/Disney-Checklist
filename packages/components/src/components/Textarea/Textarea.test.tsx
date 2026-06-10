import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('associates the label with the textarea and defaults to 5 rows', () => {
    render(<Textarea label="Can you provide more detail?" name="more-detail" />);
    const textarea = screen.getByLabelText('Can you provide more detail?');
    expect(textarea).toHaveClass('govuk-textarea');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('allows overriding the number of rows', () => {
    render(<Textarea label="More detail" name="more-detail" rows={8} />);
    expect(screen.getByLabelText('More detail')).toHaveAttribute('rows', '8');
  });

  it('wires hint and error into aria-describedby', () => {
    render(
      <Textarea
        label="More detail"
        name="more-detail"
        hint="Do not include personal information"
        errorMessage="Enter more detail"
      />,
    );
    const textarea = screen.getByLabelText('More detail');
    const describedBy = textarea.getAttribute('aria-describedby') ?? '';
    const [hintId, errorId] = describedBy.split(' ');
    expect(document.getElementById(hintId)).toHaveTextContent(
      'Do not include personal information',
    );
    expect(document.getElementById(errorId)).toHaveTextContent('Error: Enter more detail');
    expect(textarea).toHaveClass('govuk-textarea--error');
    expect(textarea.closest('.govuk-form-group')).toHaveClass('govuk-form-group--error');
  });

  it('accepts typed input', async () => {
    const user = userEvent.setup();
    render(<Textarea label="More detail" name="more-detail" />);
    const textarea = screen.getByLabelText('More detail');
    await user.type(textarea, 'Some detail');
    expect(textarea).toHaveValue('Some detail');
  });

  it('renders the label as a page heading when requested', () => {
    render(<Textarea label="More detail" name="more-detail" labelIsPageHeading labelSize="l" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('govuk-label-wrapper');
  });

  it('has no axe violations with hint and error', async () => {
    const { container } = render(
      <Textarea label="More detail" name="more-detail" hint="Hint" errorMessage="Enter detail" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
