import type { FormEvent, FormHTMLAttributes, ReactNode } from 'react';
import { Button } from '../../components/Button/Button';
import { SummaryList } from '../../components/SummaryList/SummaryList';
import type { SummaryListRow } from '../../components/SummaryList/SummaryList';

export interface CheckYourAnswersSection {
  /** Optional section heading, for journeys with multiple groups of answers. */
  heading?: ReactNode;
  rows: SummaryListRow[];
}

export interface CheckYourAnswersProps extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'children' | 'title'
> {
  /** Page heading. Defaults to the GOV.UK recommended wording. */
  title?: ReactNode;
  /** The user's answers, each with a "Change" action wired by the caller. */
  sections: CheckYourAnswersSection[];
  /** Declaration or extra content between the answers and the submit button. */
  children?: ReactNode;
  /** Heading above the submit area. Defaults to "Now send your application". */
  submitHeading?: ReactNode;
  /** Text of the submit button. Defaults to "Accept and send". */
  submitButtonText?: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

/**
 * GOV.UK Check answers page: lets users check and change their answers
 * before submitting. Give every row a "Change" action with visually hidden
 * text naming the answer it changes.
 *
 * @see https://design-system.service.gov.uk/patterns/check-answers/
 */
export function CheckYourAnswers({
  title = 'Check your answers before sending your application',
  sections,
  children,
  submitHeading = 'Now send your application',
  submitButtonText = 'Accept and send',
  onSubmit,
  ...rest
}: CheckYourAnswersProps) {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-l">{title}</h1>
        {sections.map((section, index) => (
          <div key={index}>
            {section.heading != null && <h2 className="govuk-heading-m">{section.heading}</h2>}
            <SummaryList rows={section.rows} />
          </div>
        ))}
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
          <h2 className="govuk-heading-m">{submitHeading}</h2>
          {children ?? (
            <p className="govuk-body">
              By submitting this application you are confirming that, to the best of your knowledge,
              the details you are providing are correct.
            </p>
          )}
          <Button preventDoubleClick>{submitButtonText}</Button>
        </form>
      </div>
    </div>
  );
}
