import { forwardRef, useEffect, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface ServiceNavigationItem {
  /** Text or content of the navigation item. */
  children: ReactNode;
  /** Link for the item. Omit to render plain text. */
  href?: string;
  /** Show the item as active (a section the user is within), `aria-current="true"`. */
  active?: boolean;
  /** Show the item as the current page, `aria-current="page"`. */
  current?: boolean;
}

export interface ServiceNavigationProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Name of the service, shown before the navigation. */
  serviceName?: ReactNode;
  /** Link the service name to the service homepage. */
  serviceUrl?: string;
  /** Navigation items. */
  items?: ServiceNavigationItem[];
  /** Use the inverse style on dark backgrounds. */
  inverse?: boolean;
  /**
   * Collapse the navigation behind a Menu button on mobile. Defaults to true
   * when there is more than one item.
   */
  collapseNavigationOnMobile?: boolean;
  /** Text of the mobile menu toggle button. Defaults to "Menu". */
  menuButtonText?: string;
  /** Accessible label for the menu button, if it needs to differ from its text. */
  menuButtonLabel?: string;
  /** Accessible name of the navigation landmark. Defaults to the menu button text. */
  navigationLabel?: string;
  /** Id of the navigation list, referenced by the menu button. Defaults to "navigation". */
  navigationId?: string;
  /** Class name applied to the `<nav>` wrapper. */
  navigationClassName?: string;
  /** Content rendered at the start of the container, before the service name. */
  startSlot?: ReactNode;
  /** Content rendered at the end of the container, after the navigation. */
  endSlot?: ReactNode;
  /** Content rendered inside the navigation list, before the items. */
  navigationStartSlot?: ReactNode;
  /** Content rendered inside the navigation list, after the items. */
  navigationEndSlot?: ReactNode;
  /** Accessible name of the landmark region when a service name or slot is shown. */
  'aria-label'?: string;
}

/** Fallback for govuk-frontend's tablet breakpoint custom property. */
const TABLET_BREAKPOINT_FALLBACK = '40.0625em';

/**
 * GOV.UK Service navigation, showing the service name and links to navigate
 * within the service. Ports service-navigation.mjs: on mobile the navigation
 * collapses behind a Menu button which toggles `aria-expanded` and the
 * `hidden` attribute, switching automatically at the tablet breakpoint.
 *
 * @see https://design-system.service.gov.uk/components/service-navigation/
 */
export const ServiceNavigation = forwardRef<HTMLElement, ServiceNavigationProps>(
  function ServiceNavigation(
    {
      serviceName,
      serviceUrl,
      items = [],
      inverse,
      collapseNavigationOnMobile = items.length > 1,
      menuButtonText = 'Menu',
      menuButtonLabel,
      navigationLabel,
      navigationId = 'navigation',
      navigationClassName,
      startSlot,
      endSlot,
      navigationStartSlot,
      navigationEndSlot,
      className,
      'aria-label': ariaLabel = 'Service information',
      ...rest
    },
    ref,
  ) {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    // null until the media query has been evaluated, matching the
    // no-JavaScript state of the Nunjucks template (button hidden, list shown).
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

    useEffect(() => {
      if (!collapseNavigationOnMobile || typeof window.matchMedia !== 'function') {
        return;
      }
      // govuk-frontend reads the breakpoint from the --govuk-breakpoint-tablet
      // custom property set by its stylesheet.
      const breakpoint =
        window
          .getComputedStyle(document.documentElement)
          .getPropertyValue('--govuk-breakpoint-tablet')
          .trim() || TABLET_BREAKPOINT_FALLBACK;
      const mql = window.matchMedia(`(min-width: ${breakpoint})`);
      const checkMode = () => setIsDesktop(mql.matches);
      mql.addEventListener('change', checkMode);
      checkMode();
      return () => mql.removeEventListener('change', checkMode);
    }, [collapseNavigationOnMobile]);

    const isMobile = collapseNavigationOnMobile && isDesktop === false;
    const hasNavigation =
      items.length > 0 || navigationStartSlot != null || navigationEndSlot != null;
    // A service name or start/end slot needs a containing landmark region.
    const useSection = serviceName != null || startSlot != null || endSlot != null;
    // Both elements take HTMLAttributes<HTMLElement>; narrow to one tag so JSX
    // accepts the shared ref type.
    const Root = (useSection ? 'section' : 'div') as 'section';

    return (
      <Root
        {...rest}
        ref={ref}
        aria-label={useSection ? ariaLabel : undefined}
        className={classNames(
          'govuk-service-navigation',
          inverse && 'govuk-service-navigation--inverse',
          className,
        )}
        data-module="govuk-service-navigation"
      >
        <div className="govuk-width-container">
          {startSlot}
          <div className="govuk-service-navigation__container">
            {serviceName != null && (
              <span className="govuk-service-navigation__service-name">
                {serviceUrl ? (
                  <a href={serviceUrl} className="govuk-service-navigation__link">
                    {serviceName}
                  </a>
                ) : (
                  <span className="govuk-service-navigation__text">{serviceName}</span>
                )}
              </span>
            )}
            {hasNavigation && (
              <nav
                aria-label={navigationLabel ?? menuButtonText}
                className={classNames('govuk-service-navigation__wrapper', navigationClassName)}
              >
                {collapseNavigationOnMobile && (
                  <button
                    type="button"
                    className="govuk-service-navigation__toggle govuk-js-service-navigation-toggle"
                    aria-controls={navigationId}
                    aria-label={
                      menuButtonLabel && menuButtonLabel !== menuButtonText
                        ? menuButtonLabel
                        : undefined
                    }
                    hidden={!isMobile}
                    aria-hidden={!isMobile || undefined}
                    aria-expanded={isMobile ? menuIsOpen : undefined}
                    onClick={() => setMenuIsOpen((open) => !open)}
                  >
                    {menuButtonText}
                  </button>
                )}
                <ul
                  className="govuk-service-navigation__list"
                  id={navigationId}
                  hidden={isMobile && !menuIsOpen}
                >
                  {navigationStartSlot}
                  {items.map((item, index) => {
                    const isActive = Boolean(item.active || item.current);
                    const content = isActive ? (
                      <strong className="govuk-service-navigation__active-fallback">
                        {item.children}
                      </strong>
                    ) : (
                      item.children
                    );
                    const ariaCurrent = isActive ? (item.current ? 'page' : 'true') : undefined;
                    return (
                      <li
                        key={index}
                        className={classNames(
                          'govuk-service-navigation__item',
                          isActive && 'govuk-service-navigation__item--active',
                        )}
                      >
                        {item.href ? (
                          <a
                            className="govuk-service-navigation__link"
                            href={item.href}
                            aria-current={ariaCurrent}
                          >
                            {content}
                          </a>
                        ) : (
                          <span
                            className="govuk-service-navigation__text"
                            aria-current={ariaCurrent}
                          >
                            {content}
                          </span>
                        )}
                      </li>
                    );
                  })}
                  {navigationEndSlot}
                </ul>
              </nav>
            )}
          </div>
          {endSlot}
        </div>
      </Root>
    );
  },
);
