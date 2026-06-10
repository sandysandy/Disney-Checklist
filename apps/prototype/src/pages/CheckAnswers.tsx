import { useNavigate } from 'react-router-dom';
import { CheckYourAnswers } from '@govuk-mui/react';
import { useJourney } from '../journey/JourneyContext';

export function CheckAnswers() {
  const navigate = useNavigate();
  const { answers } = useJourney();

  const change = (path: string) => `${path}?from=check-answers`;

  return (
    <CheckYourAnswers
      onSubmit={() => navigate('/confirmation')}
      sections={[
        {
          heading: 'Personal details',
          rows: [
            {
              key: 'Name',
              value: answers.fullName,
              actions: [
                { href: change('/full-name'), children: 'Change', visuallyHiddenText: 'name' },
              ],
            },
            {
              key: 'Where you live',
              value: answers.whereYouLive,
              actions: [
                {
                  href: change('/where-do-you-live'),
                  children: 'Change',
                  visuallyHiddenText: 'where you live',
                },
              ],
            },
          ],
        },
        {
          heading: 'Application details',
          rows: [
            {
              key: 'How many balls can you juggle?',
              value: answers.jugglingBalls,
              actions: [
                {
                  href: change('/juggling-balls'),
                  children: 'Change',
                  visuallyHiddenText: 'how many balls you can juggle',
                },
              ],
            },
            {
              key: 'Your best juggling trick',
              value: answers.trickDescription,
              actions: [
                {
                  href: change('/juggling-trick'),
                  children: 'Change',
                  visuallyHiddenText: 'your best juggling trick',
                },
              ],
            },
          ],
        },
      ]}
    />
  );
}
