import { useLayoutEffect, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';
import { useOptionalId } from '../../internal/useId';

export interface AccordionSection {
  /** Heading shown in the section's toggle button. */
  heading: ReactNode;
  /** Optional summary line shown below the heading inside the button. */
  summary?: ReactNode;
  /** Content revealed when the section is expanded. */
  content: ReactNode;
  /** Initial expanded state when the accordion is uncontrolled. */
  expanded?: boolean;
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The sections of the accordion. */
  sections: AccordionSection[];
  /** Heading level used for section headings. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Persist the expanded/collapsed state of each section to `sessionStorage`
   * (keyed by each section's content id, `<id>-content-<n>`), restoring it
   * when the accordion is next rendered. Matches govuk-frontend's default of
   * `true`; pass a stable `id` for the state to survive page navigation.
   */
  rememberExpanded?: boolean;
  /**
   * Controlled expanded state, one entry per section. When provided, the
   * accordion no longer manages its own state: listen to `onSectionToggle`.
   */
  expandedSections?: boolean[];
  /** Called with the section index and its new state whenever a toggle happens. */
  onSectionToggle?: (index: number, expanded: boolean) => void;
  /** The text content of the 'Hide all sections' button, when at least one section is expanded. */
  hideAllSections?: string;
  /** The text content of the 'Hide' button, when a section is expanded. */
  hideSection?: string;
  /** Text appended to the 'Hide' button's accessible name when a section is expanded. */
  hideSectionAriaLabel?: string;
  /** The text content of the 'Show all sections' button, when all sections are collapsed. */
  showAllSections?: string;
  /** The text content of the 'Show' button, when a section is collapsed. */
  showSection?: string;
  /** Text appended to the 'Show' button's accessible name when a section is collapsed. */
  showSectionAriaLabel?: string;
}

function readStoredState(contentId: string): boolean | null {
  try {
    const state = window.sessionStorage.getItem(contentId);
    return state === null ? null : state === 'true';
  } catch {
    return null;
  }
}

/**
 * GOV.UK Accordion.
 *
 * Renders the markup that govuk-frontend's accordion JavaScript builds at
 * runtime: per-section toggle buttons with chevron icons and "Show"/"Hide"
 * labels, a "Show all sections" button whose text flips when every section is
 * open, and (by default) per-section state persisted to `sessionStorage`.
 *
 * @see https://design-system.service.gov.uk/components/accordion/
 */
export function Accordion({
  sections,
  headingLevel = 2,
  rememberExpanded = true,
  expandedSections,
  onSectionToggle,
  hideAllSections = 'Hide all sections',
  hideSection = 'Hide',
  hideSectionAriaLabel = 'Hide this section',
  showAllSections = 'Show all sections',
  showSection = 'Show',
  showSectionAriaLabel = 'Show this section',
  id,
  className,
  ...rest
}: AccordionProps) {
  const accordionId = useOptionalId(id, 'govuk-accordion');
  const rootRef = useRef<HTMLDivElement>(null);
  const isControlled = expandedSections !== undefined;

  const [internalExpanded, setInternalExpanded] = useState<boolean[]>(() =>
    sections.map((section, index) => {
      // Port of `setInitialState`: a remembered state overrides the default.
      if (rememberExpanded) {
        const stored = readStoredState(`${accordionId}-content-${index + 1}`);
        if (stored !== null) {
          return stored;
        }
      }
      return section.expanded ?? false;
    }),
  );

  const isExpanded = (index: number): boolean =>
    (isControlled ? expandedSections[index] : internalExpanded[index]) ??
    sections[index]?.expanded ??
    false;

  const allSectionsOpen = sections.length > 0 && sections.every((_, index) => isExpanded(index));

  // Port of `storeState`, keyed by the section's content id.
  function storeState(index: number, expanded: boolean) {
    if (!rememberExpanded) {
      return;
    }
    try {
      window.sessionStorage.setItem(`${accordionId}-content-${index + 1}`, expanded.toString());
    } catch {
      // Storage can be unavailable (e.g. private browsing); fail silently.
    }
  }

  function setSectionExpanded(index: number, expanded: boolean) {
    if (!isControlled) {
      setInternalExpanded((previous) => {
        const next = sections.map((_, i) => previous[i] ?? sections[i].expanded ?? false);
        next[index] = expanded;
        return next;
      });
    }
    storeState(index, expanded);
    onSectionToggle?.(index, expanded);
  }

  // Port of `onSectionToggle` (the whole section header is clickable).
  function handleSectionToggle(index: number) {
    setSectionExpanded(index, !isExpanded(index));
  }

  // Port of `onShowOrHideAllToggle`.
  function handleShowOrHideAllToggle() {
    const nowExpanded = !allSectionsOpen;
    if (!isControlled) {
      setInternalExpanded(sections.map(() => nowExpanded));
    }
    sections.forEach((_, index) => {
      storeState(index, nowExpanded);
      onSectionToggle?.(index, nowExpanded);
    });
  }

  // Port of `setExpanded`'s DOM-derived parts: the `hidden="until-found"`
  // attribute (React only renders boolean `hidden`) and the button's
  // aria-label built from the rendered heading/summary text.
  useLayoutEffect(() => {
    const $root = rootRef.current;
    if (!$root) {
      return;
    }
    const $sections = $root.querySelectorAll(':scope > .govuk-accordion__section');
    $sections.forEach(($section, index) => {
      const expanded = isExpanded(index);
      const $content = $section.querySelector('.govuk-accordion__section-content');
      if ($content) {
        if (expanded) {
          $content.removeAttribute('hidden');
        } else {
          $content.setAttribute('hidden', 'until-found');
        }
      }
      const $button = $section.querySelector('.govuk-accordion__section-button');
      if ($button) {
        const ariaLabelParts: string[] = [];
        const $headingText = $section.querySelector('.govuk-accordion__section-heading-text');
        if ($headingText?.textContent) {
          ariaLabelParts.push($headingText.textContent.trim());
        }
        const $summary = $section.querySelector('.govuk-accordion__section-summary');
        if ($summary?.textContent) {
          ariaLabelParts.push($summary.textContent.trim());
        }
        ariaLabelParts.push(expanded ? hideSectionAriaLabel : showSectionAriaLabel);
        $button.setAttribute('aria-label', ariaLabelParts.join(' , '));
      }
    });
  });

  // Port of `onBeforeMatch`: expand a section when the browser reveals
  // `hidden="until-found"` content through find-in-page.
  useLayoutEffect(() => {
    if (!('onbeforematch' in document)) {
      return;
    }
    function onBeforeMatch(event: Event) {
      const $fragment = event.target;
      if (!($fragment instanceof Element) || !rootRef.current?.contains($fragment)) {
        return;
      }
      const $section = $fragment.closest('.govuk-accordion__section');
      if (!$section || !rootRef.current) {
        return;
      }
      const index = Array.from(
        rootRef.current.querySelectorAll(':scope > .govuk-accordion__section'),
      ).indexOf($section);
      if (index !== -1) {
        setSectionExpanded(index, true);
      }
    }
    document.addEventListener('beforematch', onBeforeMatch);
    return () => document.removeEventListener('beforematch', onBeforeMatch);
  });

  const Heading = `h${headingLevel}` as const;

  return (
    <div
      {...rest}
      ref={rootRef}
      id={accordionId}
      className={classNames('govuk-accordion', className)}
      data-module="govuk-accordion"
      data-remember-expanded={rememberExpanded.toString()}
    >
      <div className="govuk-accordion__controls">
        <button
          type="button"
          className="govuk-accordion__show-all"
          aria-expanded={allSectionsOpen}
          onClick={handleShowOrHideAllToggle}
        >
          <span
            className={classNames(
              'govuk-accordion-nav__chevron',
              !allSectionsOpen && 'govuk-accordion-nav__chevron--down',
            )}
          />
          <span className="govuk-accordion__show-all-text">
            {allSectionsOpen ? hideAllSections : showAllSections}
          </span>
        </button>
      </div>
      {sections.map((section, index) => {
        const expanded = isExpanded(index);
        const contentId = `${accordionId}-content-${index + 1}`;
        return (
          <div
            key={index}
            className={classNames(
              'govuk-accordion__section',
              expanded && 'govuk-accordion__section--expanded',
            )}
          >
            {/* The whole header toggles the section, as in accordion.mjs. */}
            <div
              className="govuk-accordion__section-header"
              onClick={() => handleSectionToggle(index)}
            >
              <Heading className="govuk-accordion__section-heading">
                <button
                  type="button"
                  aria-controls={contentId}
                  className="govuk-accordion__section-button"
                  aria-expanded={expanded}
                >
                  <span
                    className="govuk-accordion__section-heading-text"
                    id={`${accordionId}-heading-${index + 1}`}
                  >
                    <span className="govuk-accordion__section-heading-text-focus">
                      {section.heading}
                    </span>
                  </span>
                  <span className="govuk-visually-hidden govuk-accordion__section-heading-divider">
                    {', '}
                  </span>
                  {section.summary != null && (
                    <>
                      <span
                        className="govuk-accordion__section-summary govuk-body"
                        id={`${accordionId}-summary-${index + 1}`}
                      >
                        <span className="govuk-accordion__section-summary-focus">
                          {section.summary}
                        </span>
                      </span>
                      <span className="govuk-visually-hidden govuk-accordion__section-heading-divider">
                        {', '}
                      </span>
                    </>
                  )}
                  <span className="govuk-accordion__section-toggle" data-nosnippet="">
                    <span className="govuk-accordion__section-toggle-focus">
                      <span
                        className={classNames(
                          'govuk-accordion-nav__chevron',
                          !expanded && 'govuk-accordion-nav__chevron--down',
                        )}
                      />
                      <span className="govuk-accordion__section-toggle-text">
                        {expanded ? hideSection : showSection}
                      </span>
                    </span>
                  </span>
                </button>
              </Heading>
            </div>
            <div id={contentId} className="govuk-accordion__section-content">
              {section.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
