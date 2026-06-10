import { useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';

export interface TabsItem {
  /** Id for the tab panel, also used as the in-page link target (`#id`). */
  id: string;
  /** Text label of the tab. */
  label: ReactNode;
  /** Content of the tab panel. */
  panel: ReactNode;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** Title above the tab list, shown to users of small screens. */
  title?: ReactNode;
  /** The tabs and their panels. */
  items: TabsItem[];
}

const FALLBACK_TABLET_BREAKPOINT = '40.0625em';

/** Set the URL fragment, creating a history entry (as `tabs.mjs` does). */
function setLocationHash(hash: string) {
  window.location.hash = hash;
}

/**
 * Port of govuk-frontend's `setupResponsiveChecks`: tabs are only enhanced
 * with tab/tablist semantics at tablet width and up. Where `matchMedia` is
 * unavailable (e.g. jsdom) the component defaults to the enhanced mode.
 */
function useTabletMediaQuery(): boolean {
  const [matches, setMatches] = useState(true);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }
    const breakpoint =
      window
        .getComputedStyle(document.documentElement)
        .getPropertyValue('--govuk-breakpoint-tablet')
        .trim() || FALLBACK_TABLET_BREAKPOINT;
    const mql = window.matchMedia(`(min-width: ${breakpoint})`);
    const checkMode = () => setMatches(mql.matches);
    checkMode();
    mql.addEventListener('change', checkMode);
    return () => mql.removeEventListener('change', checkMode);
  }, []);

  return matches;
}

/**
 * GOV.UK Tabs.
 *
 * At tablet width and up the `<ul>` of links is enhanced into a `tablist`
 * (keeping the `<ul><li><a>` markup) with `tab`/`tabpanel` roles, arrow-key
 * navigation and hash-based history entries, exactly as govuk-frontend's tabs
 * JavaScript does. Below tablet width the component degrades to a list of
 * in-page links above the visible panels.
 *
 * @see https://design-system.service.gov.uk/components/tabs/
 */
export function Tabs({ title = 'Contents', items, className, ...rest }: TabsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const changingHashRef = useRef(false);
  const enhanced = useTabletMediaQuery();

  const [selectedId, setSelectedId] = useState<string | undefined>(() => {
    // Port of `setup`: the active tab comes from the URL hash, else the first tab.
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    return items.some((item) => item.id === hash) ? hash : items[0]?.id;
  });
  const currentId = items.some((item) => item.id === selectedId) ? selectedId : items[0]?.id;

  function getTabAnchor(id: string): HTMLAnchorElement | null {
    return (
      rootRef.current?.querySelector<HTMLAnchorElement>(`a.govuk-tabs__tab[href="#${id}"]`) ?? null
    );
  }

  // Port of `createHistoryEntry`: blank the panel id while setting the hash
  // so the browser does not scroll to the panel.
  function createHistoryEntry(panelId: string) {
    const $panel = document.getElementById(panelId);
    if (!$panel || !rootRef.current?.contains($panel)) {
      return;
    }
    $panel.id = '';
    changingHashRef.current = true;
    setLocationHash(panelId);
    $panel.id = panelId;
  }

  // Port of `onTabClick`.
  function handleTabClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    setSelectedId(id);
    createHistoryEntry(id);
  }

  // Port of `onTabKeydown` / `activateNextTab` / `activatePreviousTab`.
  function handleTabKeydown(event: KeyboardEvent<HTMLAnchorElement>) {
    const currentIndex = items.findIndex((item) => item.id === currentId);
    let nextIndex: number | null = null;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'Left':
      case 'Up':
        nextIndex = currentIndex - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
      case 'Right':
      case 'Down':
        nextIndex = currentIndex + 1;
        break;
    }
    if (nextIndex === null) {
      return;
    }
    event.preventDefault();
    const nextItem = items[nextIndex];
    if (!nextItem) {
      return;
    }
    setSelectedId(nextItem.id);
    getTabAnchor(nextItem.id)?.focus();
    createHistoryEntry(nextItem.id);
  }

  // Port of `onHashChange`: select and focus the tab matching a new hash,
  // unless the change came from the component itself.
  useEffect(() => {
    if (!enhanced) {
      return;
    }
    function onHashChange() {
      const hash = window.location.hash.replace('#', '');
      const $tab = rootRef.current?.querySelector<HTMLAnchorElement>(
        `a.govuk-tabs__tab[href="#${hash}"]`,
      );
      if (!$tab) {
        return;
      }
      if (changingHashRef.current) {
        changingHashRef.current = false;
        return;
      }
      setSelectedId(hash);
      $tab.focus();
    }
    window.addEventListener('hashchange', onHashChange, true);
    return () => window.removeEventListener('hashchange', onHashChange, true);
  }, [enhanced]);

  return (
    <div
      {...rest}
      ref={rootRef}
      className={classNames('govuk-tabs', className)}
      data-module="govuk-tabs"
    >
      <h2 className="govuk-tabs__title">{title}</h2>
      {items.length > 0 && (
        <>
          <ul className="govuk-tabs__list" role={enhanced ? 'tablist' : undefined}>
            {items.map((item) => {
              const selected = item.id === currentId;
              return (
                <li
                  key={item.id}
                  className={classNames(
                    'govuk-tabs__list-item',
                    selected && 'govuk-tabs__list-item--selected',
                  )}
                  role={enhanced ? 'presentation' : undefined}
                >
                  <a
                    className="govuk-tabs__tab"
                    href={`#${item.id}`}
                    {...(enhanced
                      ? {
                          id: `tab_${item.id}`,
                          role: 'tab',
                          'aria-controls': item.id,
                          'aria-selected': selected,
                          tabIndex: selected ? 0 : -1,
                          onClick: (event: MouseEvent<HTMLAnchorElement>) =>
                            handleTabClick(event, item.id),
                          onKeyDown: handleTabKeydown,
                        }
                      : {})}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
          {items.map((item) => {
            const selected = item.id === currentId;
            return (
              <div
                key={item.id}
                id={item.id}
                className={classNames(
                  'govuk-tabs__panel',
                  enhanced && !selected && 'govuk-tabs__panel--hidden',
                )}
                {...(enhanced ? { role: 'tabpanel', 'aria-labelledby': `tab_${item.id}` } : {})}
              >
                {item.panel}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
