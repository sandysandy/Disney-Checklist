import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Accordion } from './Accordion';

const sections = [
  { heading: 'Section A', summary: 'Summary A', content: <p>Content A</p> },
  { heading: 'Section B', content: <p>Content B</p> },
];

describe('Accordion', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('renders collapsed sections with the constructed header markup', () => {
    const { container } = render(
      <Accordion id="accordion-default" sections={sections} rememberExpanded={false} />,
    );

    const button = screen.getByRole('button', { name: /Section A/ });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'accordion-default-content-1');
    expect(button).toHaveClass('govuk-accordion__section-button');

    const headingText = container.querySelector('#accordion-default-heading-1');
    expect(headingText).toHaveClass('govuk-accordion__section-heading-text');
    expect(
      headingText?.querySelector('.govuk-accordion__section-heading-text-focus'),
    ).toHaveTextContent('Section A');

    const summary = container.querySelector('#accordion-default-summary-1');
    expect(summary).toHaveClass('govuk-accordion__section-summary', 'govuk-body');
    expect(summary?.querySelector('.govuk-accordion__section-summary-focus')).toHaveTextContent(
      'Summary A',
    );

    const toggle = button.querySelector('.govuk-accordion__section-toggle');
    expect(toggle).toHaveAttribute('data-nosnippet');
    const toggleFocus = toggle?.querySelector('.govuk-accordion__section-toggle-focus');
    expect(toggleFocus?.querySelector('.govuk-accordion-nav__chevron')).toHaveClass(
      'govuk-accordion-nav__chevron--down',
    );
    expect(toggleFocus?.querySelector('.govuk-accordion__section-toggle-text')).toHaveTextContent(
      'Show',
    );

    expect(container.querySelector('#accordion-default-content-1')).toHaveAttribute(
      'hidden',
      'until-found',
    );
  });

  it('builds the button aria-label from heading, summary and the i18n message', () => {
    render(<Accordion id="acc" sections={sections} rememberExpanded={false} />);
    expect(
      screen.getByRole('button', { name: 'Section A , Summary A , Show this section' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Section B , Show this section' }),
    ).toBeInTheDocument();
  });

  it('expands and collapses a section when its button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Accordion id="acc" sections={sections} rememberExpanded={false} />,
    );

    const button = screen.getByRole('button', { name: /Section A/ });
    await user.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAccessibleName('Section A , Summary A , Hide this section');
    expect(container.querySelector('#acc-content-1')).not.toHaveAttribute('hidden');
    expect(container.querySelectorAll('.govuk-accordion__section')[0]).toHaveClass(
      'govuk-accordion__section--expanded',
    );
    expect(button.querySelector('.govuk-accordion__section-toggle-text')).toHaveTextContent('Hide');
    expect(button.querySelector('.govuk-accordion-nav__chevron')).not.toHaveClass(
      'govuk-accordion-nav__chevron--down',
    );

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelector('#acc-content-1')).toHaveAttribute('hidden', 'until-found');
  });

  it('toggles a section when the surrounding header is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Accordion id="acc" sections={sections} rememberExpanded={false} />,
    );
    const header = container.querySelector('.govuk-accordion__section-header');
    await user.click(header as HTMLElement);
    expect(screen.getByRole('button', { name: /Section A/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('shows and hides all sections through the show all button', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Accordion id="acc" sections={sections} rememberExpanded={false} />,
    );

    const showAll = screen.getByRole('button', { name: 'Show all sections' });
    expect(showAll).toHaveAttribute('aria-expanded', 'false');
    expect(showAll.querySelector('.govuk-accordion-nav__chevron')).toHaveClass(
      'govuk-accordion-nav__chevron--down',
    );

    await user.click(showAll);
    expect(showAll).toHaveTextContent('Hide all sections');
    expect(showAll).toHaveAttribute('aria-expanded', 'true');
    expect(showAll.querySelector('.govuk-accordion-nav__chevron')).not.toHaveClass(
      'govuk-accordion-nav__chevron--down',
    );
    container.querySelectorAll('.govuk-accordion__section').forEach((section) => {
      expect(section).toHaveClass('govuk-accordion__section--expanded');
    });

    await user.click(screen.getByRole('button', { name: 'Hide all sections' }));
    expect(showAll).toHaveTextContent('Show all sections');
    container.querySelectorAll('.govuk-accordion__section').forEach((section) => {
      expect(section).not.toHaveClass('govuk-accordion__section--expanded');
    });
  });

  it('flips the show all button text when every section is opened individually', async () => {
    const user = userEvent.setup();
    render(<Accordion id="acc" sections={sections} rememberExpanded={false} />);

    await user.click(screen.getByRole('button', { name: /Section A/ }));
    expect(screen.getByRole('button', { name: 'Show all sections' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Section B/ }));
    expect(screen.getByRole('button', { name: 'Hide all sections' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('respects the expanded option on initial render', () => {
    render(
      <Accordion
        id="acc"
        sections={[{ ...sections[0], expanded: true }, sections[1]]}
        rememberExpanded={false}
      />,
    );
    expect(screen.getByRole('button', { name: /Section A/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: /Section B/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  describe('rememberExpanded', () => {
    it('persists section state to sessionStorage keyed by content id', async () => {
      const user = userEvent.setup();
      render(<Accordion id="remembered" sections={sections} rememberExpanded />);

      await user.click(screen.getByRole('button', { name: /Section A/ }));
      expect(window.sessionStorage.getItem('remembered-content-1')).toBe('true');

      await user.click(screen.getByRole('button', { name: /Section A/ }));
      expect(window.sessionStorage.getItem('remembered-content-1')).toBe('false');
    });

    it('persists every section when toggling all', async () => {
      const user = userEvent.setup();
      render(<Accordion id="remembered" sections={sections} rememberExpanded />);
      await user.click(screen.getByRole('button', { name: 'Show all sections' }));
      expect(window.sessionStorage.getItem('remembered-content-1')).toBe('true');
      expect(window.sessionStorage.getItem('remembered-content-2')).toBe('true');
    });

    it('restores remembered state on mount, overriding the expanded option', () => {
      window.sessionStorage.setItem('remembered-content-1', 'true');
      window.sessionStorage.setItem('remembered-content-2', 'false');
      render(
        <Accordion
          id="remembered"
          sections={[sections[0], { ...sections[1], expanded: true }]}
          rememberExpanded
        />,
      );
      expect(screen.getByRole('button', { name: /Section A/ })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getByRole('button', { name: /Section B/ })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    it('does not read or write sessionStorage when rememberExpanded is false', async () => {
      window.sessionStorage.setItem('forgetful-content-1', 'true');
      const user = userEvent.setup();
      render(<Accordion id="forgetful" sections={sections} rememberExpanded={false} />);

      const button = screen.getByRole('button', { name: /Section A/ });
      expect(button).toHaveAttribute('aria-expanded', 'false');

      await user.click(button);
      expect(window.sessionStorage.getItem('forgetful-content-1')).toBe('true');
      expect(window.sessionStorage.getItem('forgetful-content-2')).toBeNull();
    });
  });

  describe('controlled mode', () => {
    it('renders from expandedSections and reports toggles without changing itself', async () => {
      const user = userEvent.setup();
      const onSectionToggle = vi.fn();
      render(
        <Accordion
          id="acc"
          sections={sections}
          rememberExpanded={false}
          expandedSections={[true, false]}
          onSectionToggle={onSectionToggle}
        />,
      );

      const buttonA = screen.getByRole('button', { name: /Section A/ });
      expect(buttonA).toHaveAttribute('aria-expanded', 'true');

      await user.click(buttonA);
      expect(onSectionToggle).toHaveBeenCalledWith(0, false);
      // Still expanded: the parent owns the state.
      expect(buttonA).toHaveAttribute('aria-expanded', 'true');
    });

    it('reports a toggle for every section from the show all button', async () => {
      const user = userEvent.setup();
      const onSectionToggle = vi.fn();
      render(
        <Accordion
          id="acc"
          sections={sections}
          rememberExpanded={false}
          expandedSections={[true, false]}
          onSectionToggle={onSectionToggle}
        />,
      );
      await user.click(screen.getByRole('button', { name: 'Show all sections' }));
      expect(onSectionToggle).toHaveBeenCalledTimes(2);
      expect(onSectionToggle).toHaveBeenCalledWith(0, true);
      expect(onSectionToggle).toHaveBeenCalledWith(1, true);
    });
  });

  it('uses the provided i18n strings', async () => {
    const user = userEvent.setup();
    render(
      <Accordion
        id="acc"
        sections={sections}
        rememberExpanded={false}
        showAllSections="Dangos pob adran"
        hideAllSections="Cuddio pob adran"
        showSection="Dangos"
        hideSection="Cuddio"
        showSectionAriaLabel="Dangos yr adran hon"
        hideSectionAriaLabel="Cuddio'r adran hon"
      />,
    );

    const showAll = screen.getByRole('button', { name: 'Dangos pob adran' });
    const buttonA = screen.getByRole('button', {
      name: 'Section A , Summary A , Dangos yr adran hon',
    });
    expect(buttonA.querySelector('.govuk-accordion__section-toggle-text')).toHaveTextContent(
      'Dangos',
    );

    await user.click(showAll);
    expect(showAll).toHaveTextContent('Cuddio pob adran');
    expect(buttonA).toHaveAccessibleName("Section A , Summary A , Cuddio'r adran hon");
    expect(buttonA.querySelector('.govuk-accordion__section-toggle-text')).toHaveTextContent(
      'Cuddio',
    );
  });

  it('renders the configured heading level', () => {
    const { container } = render(
      <Accordion id="acc" sections={sections} headingLevel={3} rememberExpanded={false} />,
    );
    expect(container.querySelector('h3.govuk-accordion__section-heading')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Accordion id="acc" sections={sections} rememberExpanded={false} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
