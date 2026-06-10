import { forwardRef, useRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

const DEBOUNCE_TIMEOUT_MS = 1000;

interface ButtonCommonProps {
  children: ReactNode;
  /** Visual variant, mirroring the GOV.UK button modifier classes. */
  variant?: 'default' | 'secondary' | 'warning' | 'inverse';
  /** Render the "Start now" style button with the arrow icon. */
  isStartButton?: boolean;
  className?: string;
}

export interface ButtonAsButtonProps
  extends
    ButtonCommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  href?: undefined;
  /**
   * Prevent accidental double clicks from submitting a form twice.
   * Mirrors govuk-frontend's `data-prevent-double-click` behaviour.
   */
  preventDoubleClick?: boolean;
}

export interface ButtonAsLinkProps
  extends
    ButtonCommonProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'> {
  /** Render the button as a link styled as a button. */
  href: string;
  preventDoubleClick?: undefined;
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

function StartIcon() {
  return (
    <svg
      className="govuk-button__start-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="17.5"
      height="19"
      viewBox="0 0 33 40"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
    </svg>
  );
}

/**
 * GOV.UK Button.
 *
 * Renders govuk-frontend's button markup, including the link-as-button form
 * (with `role="button"` and Space key activation) and double-click debouncing.
 *
 * @see https://design-system.service.gov.uk/components/button/
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const debounceTimerRef = useRef<number | null>(null);

    if (props.href !== undefined) {
      const {
        children,
        variant = 'default',
        isStartButton,
        className,
        href,
        onKeyDown,
        ...rest
      } = props;
      return (
        <a
          {...rest}
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          role="button"
          draggable={false}
          className={classNames(
            'govuk-button',
            variant !== 'default' && `govuk-button--${variant}`,
            isStartButton && 'govuk-button--start',
            className,
          )}
          data-module="govuk-button"
          onKeyDown={(event) => {
            // Links with role="button" must activate on Space as well as Enter.
            if (event.key === ' ') {
              event.preventDefault();
              event.currentTarget.click();
            }
            onKeyDown?.(event);
          }}
        >
          {children}
          {isStartButton ? <StartIcon /> : null}
        </a>
      );
    }

    const {
      children,
      variant = 'default',
      isStartButton,
      className,
      preventDoubleClick,
      disabled,
      type = 'submit',
      onClick,
      ...rest
    } = props;

    function handleClick(event: MouseEvent<HTMLButtonElement>) {
      if (preventDoubleClick) {
        if (debounceTimerRef.current !== null) {
          event.preventDefault();
          return;
        }
        debounceTimerRef.current = window.setTimeout(() => {
          debounceTimerRef.current = null;
        }, DEBOUNCE_TIMEOUT_MS);
      }
      onClick?.(event);
    }

    return (
      <button
        {...rest}
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        aria-disabled={disabled ? true : undefined}
        className={classNames(
          'govuk-button',
          variant !== 'default' && `govuk-button--${variant}`,
          isStartButton && 'govuk-button--start',
          className,
        )}
        data-module="govuk-button"
        onClick={handleClick}
      >
        {children}
        {isStartButton ? <StartIcon /> : null}
      </button>
    );
  },
);
