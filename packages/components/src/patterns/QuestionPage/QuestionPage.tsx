import type { FormEvent, FormHTMLAttributes, ReactNode } from 'react';
import { Button } from '../../components/Button/Button';
import { ErrorSummary } from '../../components/ErrorSummary/ErrorSummary';
import type { ErrorSummaryItem } from '../../components/ErrorSummary/ErrorSummary';

export interface QuestionPageProps extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'children' | 'title'
> {
  /**
   * The question itself: form components whose label or legend is the page
   * heading (one thing per page).
   */
  children: ReactNode;
  /**
   * Validation errors. When non-empty, the error summary is rendered above
   * the question and receives focus.
   */
  errors?: ErrorSummaryItem[];
  /** Section name shown as a caption above the question, e.g. the service name. */
  caption?: ReactNode;
  /** Text of the submit button. Defaults to "Continue". */
  submitButtonText?: ReactNode;
  /** Hide the submit button to supply your own actions. */
  hideSubmitButton?: boolean;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

/**
 * GOV.UK Question page: a single question per page inside a two-thirds
 * column, with the error summary pattern wired up — on failed submission,
 * pass `errors` and the summary appears, is focused, and links each error to
 * its field.
 *
 * Make the question the page heading via `labelIsPageHeading` /
 * `legendIsPageHeading` on the form component.
 *
 * @see https://design-system.service.gov.uk/patterns/question-pages/
 */
export function QuestionPage({
  children,
  errors,
  caption,
  submitButtonText = 'Continue',
  hideSubmitButton,
  onSubmit,
  ...rest
}: QuestionPageProps) {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        {errors != null && errors.length > 0 && (
          // Re-mounting on each new set of errors re-runs the auto-focus.
          <ErrorSummary errors={errors} key={errors.map((e) => String(e.targetId)).join()} />
        )}
        {caption != null && <span className="govuk-caption-l">{caption}</span>}
        <form
          noValidate
          {...rest}
          onSubmit={(event) => {
            if (onSubmit) {
              event.preventDefault();
              onSubmit(event);
            }
          }}
        >
          {children}
          {!hideSubmitButton && <Button>{submitButtonText}</Button>}
        </form>
      </div>
    </div>
  );
}
