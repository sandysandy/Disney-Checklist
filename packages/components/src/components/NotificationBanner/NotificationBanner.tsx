import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface NotificationBannerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'title'
> {
  /** The banner content. Plain strings are wrapped in the heading paragraph. */
  children: ReactNode;
  /**
   * The "success" variant renders the green banner with `role="alert"`,
   * announcing and focusing the banner when it appears.
   */
  type?: 'success';
  /** The banner title. Defaults to "Success" for success banners, otherwise "Important". */
  titleText?: ReactNode;
  /** Heading level for the title. */
  titleHeadingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Id for the title, referenced by `aria-labelledby`. */
  titleId?: string;
  /**
   * Do not focus the banner when it mounts. Only relevant when the banner has
   * `role="alert"` — in other cases it is never focused, regardless of this option.
   */
  disableAutoFocus?: boolean;
}

/**
 * GOV.UK Notification banner, used to tell users about something they need
 * to know about that's not directly related to the page content.
 *
 * Ports the govuk-frontend behaviour: success banners get `role="alert"`,
 * `tabindex="-1"` and are focused on mount so they are announced immediately,
 * unless `disableAutoFocus` is set. Other banners are `role="region"`
 * landmarks labelled by their title.
 *
 * @see https://design-system.service.gov.uk/components/notification-banner/
 */
export const NotificationBanner = forwardRef<HTMLDivElement, NotificationBannerProps>(
  function NotificationBanner(
    {
      children,
      type,
      titleText,
      titleHeadingLevel = 2,
      titleId = 'govuk-notification-banner-title',
      role,
      disableAutoFocus,
      className,
      ...rest
    },
    ref,
  ) {
    const isSuccess = type === 'success';
    const resolvedRole = role ?? (isSuccess ? 'alert' : 'region');
    const autoFocus = resolvedRole === 'alert' && !disableAutoFocus;

    const rootRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

    const hasMountedRef = useRef(false);
    useEffect(() => {
      if (hasMountedRef.current) {
        return;
      }
      hasMountedRef.current = true;
      if (autoFocus) {
        rootRef.current?.focus();
      }
    }, [autoFocus]);

    const TitleHeading = `h${titleHeadingLevel}` as const;

    return (
      <div
        {...rest}
        ref={rootRef}
        className={classNames(
          'govuk-notification-banner',
          isSuccess && 'govuk-notification-banner--success',
          className,
        )}
        role={resolvedRole}
        aria-labelledby={titleId}
        data-module="govuk-notification-banner"
        tabIndex={autoFocus ? -1 : undefined}
      >
        <div className="govuk-notification-banner__header">
          <TitleHeading className="govuk-notification-banner__title" id={titleId}>
            {titleText ?? (isSuccess ? 'Success' : 'Important')}
          </TitleHeading>
        </div>
        <div className="govuk-notification-banner__content">
          {typeof children === 'string' ? (
            <p className="govuk-notification-banner__heading">{children}</p>
          ) : (
            children
          )}
        </div>
      </div>
    );
  },
);
