import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export type TagColour =
  | 'grey'
  | 'green'
  | 'turquoise'
  | 'blue'
  | 'light-blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow';

export interface TagProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The text or content shown inside the tag. */
  children: ReactNode;
  /** Colour variant, mirroring the `govuk-tag--<colour>` modifier classes. */
  colour?: TagColour;
}

/**
 * GOV.UK Tag, used to show users the status of something.
 *
 * @see https://design-system.service.gov.uk/components/tag/
 */
export function Tag({ children, colour, className, ...rest }: TagProps) {
  return (
    <strong
      {...rest}
      className={classNames('govuk-tag', colour != null && `govuk-tag--${colour}`, className)}
    >
      {children}
    </strong>
  );
}
