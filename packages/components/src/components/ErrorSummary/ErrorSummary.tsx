import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface ErrorSummaryItem {
  /** Id of the form control the error relates to; renders a `#targetId` link. */
  targetId?: string;
  /** The error message. */
  message: ReactNode;
  /** Explicit link href, taking precedence over `targetId`. */
  href?: string;
}

export interface ErrorSummaryProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'title'
> {
  /** The summary heading. */
  title?: ReactNode;
  /** Optional content shown above the list of errors. */
  description?: ReactNode;
  /** The errors to list. */
  errors: ErrorSummaryItem[];
  /** Do not move focus to the error summary when it mounts. */
  disableAutoFocus?: boolean;
}

/**
 * Find the legend or label associated with an input, ported from
 * govuk-frontend's `ErrorSummary.getAssociatedLegendOrLabel`.
 *
 * Prefers the legend of the closest fieldset when the input is a radio or
 * checkbox, or when the legend is close enough that scrolling to it keeps
 * the input on screen; otherwise falls back to the input's label.
 */
function getAssociatedLegendOrLabel($input: HTMLElement): HTMLElement | null {
  const $fieldset = $input.closest('fieldset');
  if ($fieldset) {
    const $legends = $fieldset.getElementsByTagName('legend');
    if ($legends.length) {
      const $candidateLegend = $legends[0];

      // If the input type is radio or checkbox, always use the legend if
      // there is one.
      if (
        $input instanceof HTMLInputElement &&
        ($input.type === 'checkbox' || $input.type === 'radio')
      ) {
        return $candidateLegend;
      }

      // For other input types, only scroll to the fieldset's legend (instead
      // of the label associated with the input) if the input would not be in
      // view once the legend is scrolled into view.
      const legendTop = $candidateLegend.getBoundingClientRect().top;
      const inputRect = $input.getBoundingClientRect();
      if (inputRect.height && window.innerHeight) {
        const inputBottom = inputRect.top + inputRect.height;
        if (inputBottom - legendTop < window.innerHeight / 2) {
          return $candidateLegend;
        }
      }
    }
  }
  return (
    document.querySelector<HTMLElement>(`label[for='${$input.getAttribute('id')}']`) ??
    $input.closest('label')
  );
}

/**
 * Focus the form control an error summary link points at, ported from
 * govuk-frontend's `ErrorSummary.focusTarget`. Scrolls the associated legend
 * or label into view, then focuses the control without scrolling again.
 */
function focusTarget($target: HTMLAnchorElement): boolean {
  const inputId = $target.hash.replace('#', '');
  if (!inputId) {
    return false;
  }
  const $input = document.getElementById(inputId);
  if (!$input) {
    return false;
  }
  const $legendOrLabel = getAssociatedLegendOrLabel($input);
  if (!$legendOrLabel) {
    return false;
  }
  $legendOrLabel.scrollIntoView();
  $input.focus({ preventScroll: true });
  return true;
}

/**
 * GOV.UK Error summary, shown at the top of the page to summarise validation
 * errors and link to each problem field.
 *
 * Ports the govuk-frontend behaviour: the summary takes focus on mount for
 * an accessible announcement (unless `disableAutoFocus` is set), and clicking
 * an error link scrolls the field's legend or label into view before moving
 * focus to the field itself.
 *
 * @see https://design-system.service.gov.uk/components/error-summary/
 */
export const ErrorSummary = forwardRef<HTMLDivElement, ErrorSummaryProps>(function ErrorSummary(
  {
    title = 'There is a problem',
    description,
    errors,
    disableAutoFocus,
    className,
    onClick,
    ...rest
  },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (hasMountedRef.current) {
      return;
    }
    hasMountedRef.current = true;
    if (!disableAutoFocus) {
      rootRef.current?.focus();
    }
  }, [disableAutoFocus]);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const $target = event.target;
    if ($target instanceof HTMLAnchorElement && focusTarget($target)) {
      event.preventDefault();
    }
    onClick?.(event);
  }

  return (
    <div
      {...rest}
      ref={rootRef}
      className={classNames('govuk-error-summary', className)}
      data-module="govuk-error-summary"
      tabIndex={-1}
      onClick={handleClick}
    >
      {/*
        Keep the role="alert" in a separate child container to prevent a race
        condition between the focusing js and the alert, resulting in
        information getting missed in screen reader announcements.
      */}
      <div role="alert">
        <h2 className="govuk-error-summary__title">{title}</h2>
        <div className="govuk-error-summary__body">
          {description != null && <p>{description}</p>}
          {errors.length > 0 && (
            <ul className="govuk-list govuk-error-summary__list">
              {errors.map((error, index) => {
                const href =
                  error.href ?? (error.targetId != null ? `#${error.targetId}` : undefined);
                return (
                  <li key={error.targetId ?? error.href ?? index}>
                    {href != null ? <a href={href}>{error.message}</a> : error.message}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
});
