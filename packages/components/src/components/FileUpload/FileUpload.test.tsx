import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { FileUpload } from './FileUpload';

describe('FileUpload', () => {
  it('renders a file input associated with its label', () => {
    render(<FileUpload label="Upload a file" name="file-upload" />);
    const input = screen.getByLabelText('Upload a file');
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveClass('govuk-file-upload');
  });

  it('wires hint and error into aria-describedby and applies error styling', () => {
    render(
      <FileUpload
        label="Upload a file"
        name="file-upload"
        hint="Files must be smaller than 2MB"
        errorMessage="The CSV must be smaller than 2MB"
      />,
    );
    const input = screen.getByLabelText('Upload a file');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    const [hintId, errorId] = describedBy.split(' ');
    expect(document.getElementById(hintId)).toHaveTextContent('Files must be smaller than 2MB');
    expect(document.getElementById(errorId)).toHaveTextContent(
      'Error: The CSV must be smaller than 2MB',
    );
    expect(input).toHaveClass('govuk-file-upload--error');
    expect(input.closest('.govuk-form-group')).toHaveClass('govuk-form-group--error');
  });

  it('accepts a selected file', async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Upload a file" name="file-upload" />);
    const input = screen.getByLabelText<HTMLInputElement>('Upload a file');
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    await user.upload(input, file);
    expect(input.files).toHaveLength(1);
    expect(input.files?.[0].name).toBe('hello.txt');
  });

  it('supports the multiple attribute', () => {
    render(<FileUpload label="Upload your evidence" name="evidence" multiple />);
    expect(screen.getByLabelText('Upload your evidence')).toHaveAttribute('multiple');
  });

  it('has no axe violations with hint and error', async () => {
    const { container } = render(
      <FileUpload label="Upload a file" name="file-upload" hint="Hint" errorMessage="Too big" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
