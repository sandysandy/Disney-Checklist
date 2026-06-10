import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';
import { Tag } from '../Tag/Tag';
import type { TagColour } from '../Tag/Tag';

export interface PhaseBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The phase shown in the tag, e.g. "Alpha" or "Beta". */
  tag: ReactNode;
  /** Colour variant for the tag. */
  tagColour?: TagColour;
  /** The banner message, e.g. a feedback link. */
  children: ReactNode;
}

/**
 * GOV.UK Phase banner, used to show users the service is still being worked
 * on, e.g. while in alpha or beta.
 *
 * @see https://design-system.service.gov.uk/components/phase-banner/
 */
export function PhaseBanner({ tag, tagColour, children, className, ...rest }: PhaseBannerProps) {
  return (
    <div {...rest} className={classNames('govuk-phase-banner', 'govuk-width-container', className)}>
      <p className="govuk-phase-banner__content">
        <Tag colour={tagColour} className="govuk-phase-banner__content__tag">
          {tag}
        </Tag>
        <span className="govuk-phase-banner__text">{children}</span>
      </p>
    </div>
  );
}
