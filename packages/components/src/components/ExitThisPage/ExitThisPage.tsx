import { useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface ExitThisPageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Button content. Defaults to the official "Emergency Exit this page". */
  children?: ReactNode;
  /** Where the button takes the user. Defaults to BBC Weather. */
  redirectUrl?: string;
  /** Screen reader announcement when the exit has been activated. */
  activatedText?: string;
  /** Screen reader announcement when the keyboard shortcut times out. */
  timedOutText?: string;
  /** Announcement after the first Shift press. */
  pressTwoMoreTimesText?: string;
  /** Announcement after the second Shift press. */
  pressOneMoreTimeText?: string;
  /**
   * Navigation function, overridable for testing. Defaults to assigning
   * `window.location.href`.
   */
  navigate?: (href: string) => void;
}

const KEYPRESS_TIMEOUT_MS = 5000;

/**
 * GOV.UK Exit this page: lets a user quickly leave a page that contains
 * sensitive information (e.g. domestic abuse services), via the button or by
 * pressing Shift three times. Ports exit-this-page.mjs: keypress indicator
 * lights, visually hidden status announcements, timeout reset, and a
 * whiteout overlay while the redirect happens.
 *
 * Use it with guidance telling users how to cover their tracks (browser
 * history is not affected).
 *
 * @see https://design-system.service.gov.uk/components/exit-this-page/
 */
export function ExitThisPage({
  children,
  redirectUrl = 'https://www.bbc.co.uk/weather',
  activatedText = 'Loading.',
  timedOutText = 'Exit this page expired.',
  pressTwoMoreTimesText = 'Shift, press 2 more times to exit.',
  pressOneMoreTimeText = 'Shift, press 1 more time to exit.',
  navigate,
  className,
  ...rest
}: ExitThisPageProps) {
  const [keypressCount, setKeypressCount] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [exiting, setExiting] = useState(false);

  const lastKeyWasModified = useRef(false);
  const keypressCounter = useRef(0);
  const keypressTimeoutId = useRef<number | null>(null);
  const timeoutMessageId = useRef<number | null>(null);
  const exitPage = () => {
    setStatusText('');
    setExiting(true);
    document.body.classList.add('govuk-exit-this-page-hide-content');
    (navigate ?? ((href: string) => window.location.assign(href)))(redirectUrl);
  };

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    exitPage();
  }

  useEffect(() => {
    const clearTimers = () => {
      if (keypressTimeoutId.current) window.clearTimeout(keypressTimeoutId.current);
      if (timeoutMessageId.current) window.clearTimeout(timeoutMessageId.current);
      keypressTimeoutId.current = null;
      timeoutMessageId.current = null;
    };

    const resetKeypressTimer = () => {
      if (keypressTimeoutId.current) {
        window.clearTimeout(keypressTimeoutId.current);
        keypressTimeoutId.current = null;
      }
      keypressCounter.current = 0;
      setKeypressCount(0);
      setStatusText(timedOutText);
      timeoutMessageId.current = window.setTimeout(() => setStatusText(''), KEYPRESS_TIMEOUT_MS);
    };

    const handleKeyup = (event: KeyboardEvent) => {
      if (event.key === 'Shift' && !lastKeyWasModified.current) {
        keypressCounter.current += 1;
        if (timeoutMessageId.current) {
          window.clearTimeout(timeoutMessageId.current);
          timeoutMessageId.current = null;
        }
        if (keypressCounter.current >= 3) {
          keypressCounter.current = 0;
          setKeypressCount(0);
          if (keypressTimeoutId.current) {
            window.clearTimeout(keypressTimeoutId.current);
            keypressTimeoutId.current = null;
          }
          exitPage();
        } else {
          setKeypressCount(keypressCounter.current);
          setStatusText(
            keypressCounter.current === 1 ? pressTwoMoreTimesText : pressOneMoreTimeText,
          );
          if (keypressTimeoutId.current) window.clearTimeout(keypressTimeoutId.current);
          keypressTimeoutId.current = window.setTimeout(resetKeypressTimer, KEYPRESS_TIMEOUT_MS);
        }
      } else if (keypressTimeoutId.current) {
        resetKeypressTimer();
      }
      lastKeyWasModified.current = event.shiftKey;
    };

    document.addEventListener('keyup', handleKeyup, true);
    const resetPage = () => {
      document.body.classList.remove('govuk-exit-this-page-hide-content');
      setExiting(false);
      keypressCounter.current = 0;
      setKeypressCount(0);
      setStatusText('');
      clearTimers();
    };
    window.addEventListener('pageshow', resetPage);
    return () => {
      document.removeEventListener('keyup', handleKeyup, true);
      window.removeEventListener('pageshow', resetPage);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- exitPage is stable per these props
  }, [navigate, redirectUrl, timedOutText, pressTwoMoreTimesText, pressOneMoreTimeText]);

  return (
    <div
      {...rest}
      className={classNames('govuk-exit-this-page', className)}
      data-module="govuk-exit-this-page"
    >
      <a
        href={redirectUrl}
        role="button"
        draggable={false}
        rel="nofollow noreferrer"
        className="govuk-button govuk-button--warning govuk-exit-this-page__button govuk-js-exit-this-page-button"
        data-module="govuk-button"
        onClick={handleClick}
        onKeyDown={(event) => {
          if (event.key === ' ') {
            event.preventDefault();
            event.currentTarget.click();
          }
        }}
      >
        {children ?? (
          <>
            <span className="govuk-visually-hidden">Emergency</span> Exit this page
          </>
        )}
        <div
          className={classNames(
            'govuk-exit-this-page__indicator',
            keypressCount > 0 && 'govuk-exit-this-page__indicator--visible',
          )}
          aria-hidden="true"
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={classNames(
                'govuk-exit-this-page__indicator-light',
                index < keypressCount && 'govuk-exit-this-page__indicator-light--on',
              )}
            />
          ))}
        </div>
      </a>
      <span role="status" className="govuk-visually-hidden">
        {statusText}
      </span>
      {exiting && (
        <div className="govuk-exit-this-page-overlay" role="alert">
          {activatedText}
        </div>
      )}
    </div>
  );
}
