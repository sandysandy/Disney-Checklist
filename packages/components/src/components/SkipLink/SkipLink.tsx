import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface SkipLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'href'
> {
  /** Link text. Defaults to "Skip to main content". */
  children?: ReactNode;
  /** Fragment link to the main content container. Defaults to "#content". */
  href?: string;
}

/**
 * Focus the linked element, making it programmatically focusable if needed.
 * Ported from govuk-frontend's `setFocus` helper (common/index.mjs) as used by
 * skip-link.mjs.
 */
function focusLinkedElement($linkedElement: HTMLElement): void {
  const isFocusable = $linkedElement.getAttribute('tabindex');
  if (!isFocusable) {
    $linkedElement.setAttribute('tabindex', '-1');
  }

  function onBlur(): void {
    $linkedElement.classList.remove('govuk-skip-link-focused-element');
    if (!isFocusable) {
      $linkedElement.removeAttribute('tabindex');
    }
  }

  $linkedElement.addEventListener(
    'focus',
    () => $linkedElement.addEventListener('blur', onBlur, { once: true }),
    { once: true },
  );
  $linkedElement.classList.add('govuk-skip-link-focused-element');
  $linkedElement.focus();
}

/**
 * GOV.UK Skip link.
 *
 * On click, moves focus to the linked element (adding a temporary
 * `tabindex="-1"` if it is not natively focusable, removed again on blur),
 * porting the behaviour of govuk-frontend's skip-link.mjs.
 *
 * @see https://design-system.service.gov.uk/components/skip-link/
 */
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(function SkipLink(
  { children = 'Skip to main content', href = '#content', className, onClick, ...rest },
  ref,
) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    onClick?.(event);

    const $link = event.currentTarget;
    // Only manage focus for fragment links within the current page.
    if ($link.origin !== window.location.origin || $link.pathname !== window.location.pathname) {
      return;
    }

    const linkedElementId = $link.hash.replace('#', '');
    if (!linkedElementId) {
      return;
    }

    const $linkedElement = document.getElementById(linkedElementId);
    if ($linkedElement) {
      focusLinkedElement($linkedElement);
    }
  }

  return (
    <a
      {...rest}
      ref={ref}
      href={href}
      className={classNames('govuk-skip-link', className)}
      data-module="govuk-skip-link"
      onClick={handleClick}
    >
      {children}
    </a>
  );
});
