import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface CookieBannerMessageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Heading of the message, e.g. "Cookies on [name of service]". */
  heading?: ReactNode;
  /** Body content. Strings are wrapped in a `govuk-body` paragraph. */
  children: ReactNode;
  /**
   * Actions, rendered in a button group — typically `Button` components
   * ("Accept analytics cookies", "Reject analytics cookies") and a
   * "View cookies" link.
   */
  actions?: ReactNode;
}

/**
 * A single message within a cookie banner. Give confirmation messages
 * `role="alert"` and move focus to the banner so the confirmation is
 * announced, per the GOV.UK guidance.
 */
export function CookieBannerMessage({
  heading,
  children,
  actions,
  className,
  ...rest
}: CookieBannerMessageProps) {
  return (
    <div
      {...rest}
      className={classNames('govuk-cookie-banner__message', className, 'govuk-width-container')}
    >
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          {heading != null && (
            <h2 className="govuk-cookie-banner__heading govuk-heading-m">{heading}</h2>
          )}
          <div className="govuk-cookie-banner__content">
            {typeof children === 'string' ? <p className="govuk-body">{children}</p> : children}
          </div>
        </div>
      </div>
      {actions != null && <div className="govuk-button-group">{actions}</div>}
    </div>
  );
}

export interface CookieBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** One or more `CookieBannerMessage` elements. */
  children: ReactNode;
  /** Accessible name of the banner region. Defaults to "Cookie banner". */
  'aria-label'?: string;
  /** Hide the whole banner, e.g. once the user's choice has been actioned. */
  hidden?: boolean;
}

/**
 * GOV.UK Cookie banner, shown until the user accepts or rejects cookies.
 * Compose `CookieBannerMessage`s and manage which one is visible in state:
 * question message first, then a confirmation message (with `role="alert"`
 * and focus) containing a "Hide cookie message" action.
 *
 * Show the banner before anything else on the page (before the skip link),
 * and don't use it for anything except cookies.
 *
 * @see https://design-system.service.gov.uk/components/cookie-banner/
 */
export function CookieBanner({
  children,
  className,
  'aria-label': ariaLabel = 'Cookie banner',
  ...rest
}: CookieBannerProps) {
  return (
    <div
      {...rest}
      className={classNames('govuk-cookie-banner', className)}
      data-nosnippet=""
      role="region"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
