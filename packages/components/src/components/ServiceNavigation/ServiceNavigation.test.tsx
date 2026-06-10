import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ServiceNavigation } from './ServiceNavigation';

const items = [
  { children: 'Item 1', href: '/one' },
  { children: 'Item 2', href: '/two', active: true },
  { children: 'Item 3', href: '/three', current: true },
];

/** Stub window.matchMedia (not implemented in jsdom) with a controllable list. */
function stubMatchMedia(initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mql = {
    get matches() {
      return matches;
    },
    media: '',
    addEventListener(_type: string, listener: (event: MediaQueryListEvent) => void) {
      listeners.add(listener);
    },
    removeEventListener(_type: string, listener: (event: MediaQueryListEvent) => void) {
      listeners.delete(listener);
    },
  };
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mql as unknown as MediaQueryList),
  );
  return {
    setMatches(value: boolean) {
      matches = value;
      for (const listener of listeners) {
        listener({ matches } as MediaQueryListEvent);
      }
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ServiceNavigation', () => {
  it('renders a labelled section landmark when a service name is given', () => {
    render(<ServiceNavigation serviceName="Find a job" items={items} />);
    const section = screen.getByRole('region', { name: 'Service information' });
    expect(section.tagName).toBe('SECTION');
    expect(section).toHaveClass('govuk-service-navigation');
    expect(section).toHaveAttribute('data-module', 'govuk-service-navigation');
  });

  it('renders a plain div root without a service name or slots', () => {
    const { container } = render(<ServiceNavigation items={items} />);
    const root = container.querySelector('.govuk-service-navigation');
    expect(root?.tagName).toBe('DIV');
    expect(root).not.toHaveAttribute('aria-label');
  });

  it('links the service name when serviceUrl is set, otherwise renders text', () => {
    const { rerender } = render(<ServiceNavigation serviceName="Find a job" serviceUrl="/" />);
    expect(screen.getByRole('link', { name: 'Find a job' })).toHaveClass(
      'govuk-service-navigation__link',
    );
    rerender(<ServiceNavigation serviceName="Find a job" />);
    expect(screen.getByText('Find a job')).toHaveClass('govuk-service-navigation__text');
  });

  it('marks active and current items with aria-current and a strong fallback', () => {
    render(<ServiceNavigation items={items} />);
    const active = screen.getByRole('link', { name: 'Item 2' });
    expect(active).toHaveAttribute('aria-current', 'true');
    expect(active.querySelector('strong')).toHaveClass('govuk-service-navigation__active-fallback');
    expect(active.closest('li')).toHaveClass('govuk-service-navigation__item--active');
    expect(screen.getByRole('link', { name: 'Item 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Item 1' })).not.toHaveAttribute('aria-current');
  });

  it('hides the menu button and shows the list on desktop', () => {
    stubMatchMedia(true);
    const { container } = render(<ServiceNavigation items={items} />);
    const button = container.querySelector('.govuk-js-service-navigation-toggle');
    expect(button).toHaveAttribute('hidden');
    expect(button).toHaveAttribute('aria-hidden', 'true');
    expect(button).not.toHaveAttribute('aria-expanded');
    expect(container.querySelector('.govuk-service-navigation__list')).not.toHaveAttribute(
      'hidden',
    );
  });

  it('collapses the list behind the menu button on mobile and toggles it on click', async () => {
    stubMatchMedia(false);
    const user = userEvent.setup();
    const { container } = render(<ServiceNavigation items={items} />);
    const button = screen.getByRole('button', { name: 'Menu' });
    const list = container.querySelector('.govuk-service-navigation__list');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'navigation');
    expect(list).toHaveAttribute('hidden');

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(list).not.toHaveAttribute('hidden');

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(list).toHaveAttribute('hidden');
  });

  it('reacts to the media query changing between modes', () => {
    const media = stubMatchMedia(false);
    const { container } = render(<ServiceNavigation items={items} />);
    const list = container.querySelector('.govuk-service-navigation__list');
    expect(list).toHaveAttribute('hidden');

    act(() => {
      media.setMatches(true);
    });
    expect(list).not.toHaveAttribute('hidden');
    expect(container.querySelector('.govuk-js-service-navigation-toggle')).toHaveAttribute(
      'hidden',
    );
  });

  it('does not render a menu button for a single item by default', () => {
    stubMatchMedia(false);
    const { container } = render(<ServiceNavigation items={[items[0]]} />);
    expect(container.querySelector('.govuk-js-service-navigation-toggle')).toBeNull();
    expect(container.querySelector('.govuk-service-navigation__list')).not.toHaveAttribute(
      'hidden',
    );
  });

  it('uses the menu button text as the navigation label by default', () => {
    render(<ServiceNavigation items={items} menuButtonText="Pages" />);
    expect(screen.getByRole('navigation', { name: 'Pages' })).toBeInTheDocument();
  });

  it('renders slots', () => {
    render(
      <ServiceNavigation
        items={items}
        startSlot={<p>Start slot</p>}
        endSlot={<p>End slot</p>}
        navigationStartSlot={<li>Nav start</li>}
        navigationEndSlot={<li>Nav end</li>}
      />,
    );
    expect(screen.getByText('Start slot')).toBeInTheDocument();
    expect(screen.getByText('End slot')).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).toHaveTextContent('Nav start');
    expect(listItems[listItems.length - 1]).toHaveTextContent('Nav end');
  });

  it('has no axe violations in mobile and desktop modes', async () => {
    stubMatchMedia(false);
    const mobile = render(<ServiceNavigation serviceName="Find a job" items={items} />);
    expect(await axe(mobile.container)).toHaveNoViolations();
    mobile.unmount();

    stubMatchMedia(true);
    const desktop = render(<ServiceNavigation serviceName="Find a job" items={items} />);
    expect(await axe(desktop.container)).toHaveNoViolations();
  });
});
