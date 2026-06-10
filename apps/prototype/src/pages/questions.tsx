import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BackLink, CharacterCount, QuestionPage, Radios, TextInput } from '@govuk-mui/react';
import type { ErrorSummaryItem } from '@govuk-mui/react';
import { useJourney } from '../journey/JourneyContext';

/**
 * Shared shape of every question page: track local input state, validate on
 * submit, then go to the next page — or straight back to check-answers when
 * the user arrived via a "Change" link (?from=check-answers).
 */
function useQuestionPage(nextPath: string) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromCheckAnswers = searchParams.get('from') === 'check-answers';
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([]);
  return {
    errors,
    backLink: (
      <BackLink
        href={fromCheckAnswers ? '/check-answers' : '#'}
        onClick={(e) => {
          e.preventDefault();
          if (fromCheckAnswers) navigate('/check-answers');
          else navigate(-1);
        }}
      />
    ),
    submit(validationErrors: ErrorSummaryItem[]) {
      setErrors(validationErrors);
      if (validationErrors.length === 0) {
        navigate(fromCheckAnswers ? '/check-answers' : nextPath);
      }
    },
  };
}

export function FullName() {
  const { answers, setAnswer } = useJourney();
  const { errors, backLink, submit } = useQuestionPage('/where-do-you-live');
  return (
    <>
      {backLink}
      <QuestionPage
        caption="Apply for a juggling licence"
        errors={errors}
        onSubmit={() =>
          submit(
            answers.fullName.trim()
              ? []
              : [{ targetId: 'full-name', message: 'Enter your full name' }],
          )
        }
      >
        <TextInput
          id="full-name"
          name="fullName"
          label="What is your full name?"
          labelIsPageHeading
          labelSize="l"
          autoComplete="name"
          value={answers.fullName}
          onChange={(event) => setAnswer('fullName', event.target.value)}
          errorMessage={errors.length ? errors[0].message : undefined}
        />
      </QuestionPage>
    </>
  );
}

export function WhereDoYouLive() {
  const { answers, setAnswer } = useJourney();
  const { errors, backLink, submit } = useQuestionPage('/juggling-balls');
  return (
    <>
      {backLink}
      <QuestionPage
        errors={errors}
        onSubmit={() =>
          submit(
            answers.whereYouLive
              ? []
              : [{ targetId: 'where-you-live', message: 'Select where you live' }],
          )
        }
      >
        <Radios
          idPrefix="where-you-live"
          name="whereYouLive"
          legend="Where do you live?"
          legendIsPageHeading
          legendSize="l"
          value={answers.whereYouLive}
          onChange={(value) => setAnswer('whereYouLive', value)}
          errorMessage={errors.length ? errors[0].message : undefined}
          items={[
            { value: 'England', label: 'England' },
            { value: 'Scotland', label: 'Scotland' },
            { value: 'Wales', label: 'Wales' },
            { value: 'Northern Ireland', label: 'Northern Ireland' },
          ]}
        />
      </QuestionPage>
    </>
  );
}

export function JugglingBalls() {
  const { answers, setAnswer } = useJourney();
  const { errors, backLink, submit } = useQuestionPage('/juggling-trick');
  return (
    <>
      {backLink}
      <QuestionPage
        errors={errors}
        onSubmit={() =>
          submit(
            answers.jugglingBalls
              ? []
              : [
                  {
                    targetId: 'juggling-balls',
                    message: 'Select how many balls you can juggle',
                  },
                ],
          )
        }
      >
        <Radios
          idPrefix="juggling-balls"
          name="jugglingBalls"
          legend="How many balls can you juggle?"
          legendIsPageHeading
          legendSize="l"
          hint="Include any item you can juggle with, not just balls"
          value={answers.jugglingBalls}
          onChange={(value) => setAnswer('jugglingBalls', value)}
          errorMessage={errors.length ? errors[0].message : undefined}
          items={[
            { value: '3 or more', label: '3 or more' },
            { value: '1 or 2', label: '1 or 2' },
            { value: 'None - I cannot juggle', label: 'None - I cannot juggle' },
          ]}
        />
      </QuestionPage>
    </>
  );
}

export function JugglingTrick() {
  const { answers, setAnswer } = useJourney();
  const { errors, backLink, submit } = useQuestionPage('/check-answers');
  return (
    <>
      {backLink}
      <QuestionPage
        errors={errors}
        onSubmit={() =>
          submit(
            answers.trickDescription.trim()
              ? []
              : [
                  {
                    targetId: 'juggling-trick',
                    message: 'Enter details of your best juggling trick',
                  },
                ],
          )
        }
      >
        <CharacterCount
          id="juggling-trick"
          name="trickDescription"
          maxLength={200}
          label="Tell us about your best juggling trick"
          labelIsPageHeading
          labelSize="l"
          hint="Do not include personal or financial information"
          value={answers.trickDescription}
          onChange={(event) => setAnswer('trickDescription', event.target.value)}
          errorMessage={errors.length ? errors[0].message : undefined}
        />
      </QuestionPage>
    </>
  );
}
