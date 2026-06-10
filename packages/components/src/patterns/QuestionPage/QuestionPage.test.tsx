import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { QuestionPage } from './QuestionPage';
import { TextInput } from '../../components/TextInput/TextInput';

function Page({ errors }: { errors?: { targetId: string; message: string }[] }) {
  return (
    <QuestionPage errors={errors} onSubmit={() => {}}>
      <TextInput
        id="full-name"
        name="full-name"
        label="What is your full name?"
        labelIsPageHeading
        labelSize="l"
        errorMessage={errors?.length ? errors[0].message : undefined}
      />
    </QuestionPage>
  );
}

describe('QuestionPage', () => {
  it('renders the question inside a form with a Continue button', () => {
    render(<Page />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('What is your full name?');
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveAttribute('type', 'submit');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('prevents native submission and calls onSubmit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <QuestionPage onSubmit={onSubmit}>
        <TextInput name="q" label="Question" />
      </QuestionPage>,
    );
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows a focused error summary linking to the field when errors appear', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Page />);
    rerender(<Page errors={[{ targetId: 'full-name', message: 'Enter your full name' }]} />);

    // govuk-frontend focuses the outer .govuk-error-summary container.
    expect(document.activeElement).toHaveClass('govuk-error-summary');
    const link = screen.getByRole('link', { name: 'Enter your full name' });
    expect(link).toHaveAttribute('href', '#full-name');
    await user.click(link);
    expect(screen.getByLabelText('What is your full name?')).toHaveFocus();
  });

  it('has no axe violations in the error state', async () => {
    const { container } = render(
      <Page errors={[{ targetId: 'full-name', message: 'Enter your full name' }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
