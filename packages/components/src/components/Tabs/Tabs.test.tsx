import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Tabs } from './Tabs';
import type { TabsProps } from './Tabs';

const items: TabsProps['items'] = [
  { id: 'past-day', label: 'Past day', panel: <p>Past day content</p> },
  { id: 'past-week', label: 'Past week', panel: <p>Past week content</p> },
  { id: 'past-month', label: 'Past month', panel: <p>Past month content</p> },
];

function resetHash() {
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

describe('Tabs', () => {
  afterEach(() => {
    resetHash();
    vi.unstubAllGlobals();
  });

  it('renders the enhanced tablist on the ul/li/a markup', () => {
    const { container } = render(<Tabs items={items} />);

    const list = screen.getByRole('tablist');
    expect(list.tagName).toBe('UL');
    expect(list).toHaveClass('govuk-tabs__list');

    const listItems = container.querySelectorAll('li.govuk-tabs__list-item');
    expect(listItems).toHaveLength(3);
    listItems.forEach((item) => expect(item).toHaveAttribute('role', 'presentation'));

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    tabs.forEach((tab, index) => {
      expect(tab.tagName).toBe('A');
      expect(tab).toHaveAttribute('href', `#${items[index].id}`);
      expect(tab).toHaveAttribute('id', `tab_${items[index].id}`);
      expect(tab).toHaveAttribute('aria-controls', items[index].id);
    });

    expect(container.querySelector('.govuk-tabs')).toHaveAttribute('data-module', 'govuk-tabs');
    expect(screen.getByRole('heading', { name: 'Contents' })).toHaveClass('govuk-tabs__title');
  });

  it('selects the first tab by default and hides the other panels', () => {
    const { container } = render(<Tabs items={items} />);

    const [first, second] = screen.getAllByRole('tab');
    expect(first).toHaveAttribute('aria-selected', 'true');
    expect(first).toHaveAttribute('tabindex', '0');
    expect(first.parentElement).toHaveClass('govuk-tabs__list-item--selected');
    expect(second).toHaveAttribute('aria-selected', 'false');
    expect(second).toHaveAttribute('tabindex', '-1');

    const panels = container.querySelectorAll('.govuk-tabs__panel');
    expect(panels[0]).not.toHaveClass('govuk-tabs__panel--hidden');
    expect(panels[0]).toHaveAttribute('role', 'tabpanel');
    expect(panels[0]).toHaveAttribute('aria-labelledby', 'tab_past-day');
    expect(panels[1]).toHaveClass('govuk-tabs__panel--hidden');
    expect(panels[2]).toHaveClass('govuk-tabs__panel--hidden');
  });

  it('switches panels on click and records a history entry', async () => {
    const user = userEvent.setup();
    const { container } = render(<Tabs items={items} />);

    await user.click(screen.getByRole('tab', { name: 'Past week' }));

    expect(screen.getByRole('tab', { name: 'Past week' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Past day' })).toHaveAttribute('aria-selected', 'false');
    const panels = container.querySelectorAll('.govuk-tabs__panel');
    expect(panels[0]).toHaveClass('govuk-tabs__panel--hidden');
    expect(panels[1]).not.toHaveClass('govuk-tabs__panel--hidden');
    // The panel keeps its id after the hash trick.
    expect(panels[1]).toHaveAttribute('id', 'past-week');
    expect(window.location.hash).toBe('#past-week');
  });

  it.each(['{ArrowRight}', '{ArrowDown}'])(
    'activates and focuses the next tab with %s',
    async (key) => {
      const user = userEvent.setup();
      render(<Tabs items={items} />);

      await user.click(screen.getByRole('tab', { name: 'Past day' }));
      await user.keyboard(key);

      const nextTab = screen.getByRole('tab', { name: 'Past week' });
      expect(nextTab).toHaveAttribute('aria-selected', 'true');
      expect(nextTab).toHaveFocus();
      expect(screen.getByText('Past week content')).toBeInTheDocument();
      expect(screen.getByText('Past day content').closest('.govuk-tabs__panel')).toHaveClass(
        'govuk-tabs__panel--hidden',
      );
    },
  );

  it.each(['{ArrowLeft}', '{ArrowUp}'])(
    'activates and focuses the previous tab with %s',
    async (key) => {
      const user = userEvent.setup();
      render(<Tabs items={items} />);

      await user.click(screen.getByRole('tab', { name: 'Past week' }));
      await user.keyboard(key);

      const previousTab = screen.getByRole('tab', { name: 'Past day' });
      expect(previousTab).toHaveAttribute('aria-selected', 'true');
      expect(previousTab).toHaveFocus();
    },
  );

  it('does not wrap keyboard navigation at either end', async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} />);

    await user.click(screen.getByRole('tab', { name: 'Past day' }));
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Past day' })).toHaveAttribute('aria-selected', 'true');

    await user.click(screen.getByRole('tab', { name: 'Past month' }));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Past month' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('selects the tab matching the URL hash on initial render', () => {
    window.history.replaceState(null, '', '#past-month');
    render(<Tabs items={items} />);
    expect(screen.getByRole('tab', { name: 'Past month' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('Past month content')).toBeInTheDocument();
  });

  it('selects and focuses the tab when the hash changes', () => {
    render(<Tabs items={items} />);

    act(() => {
      window.history.replaceState(null, '', '#past-week');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    const tab = screen.getByRole('tab', { name: 'Past week' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveFocus();
  });

  it('degrades to a list of in-page links below tablet width', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );

    const { container } = render(<Tabs items={items} />);

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    const links = within(container.querySelector('.govuk-tabs__list') as HTMLElement).getAllByRole(
      'link',
    );
    expect(links).toHaveLength(3);
    expect(links[0]).not.toHaveAttribute('tabindex');
    container.querySelectorAll('.govuk-tabs__panel').forEach((panel) => {
      expect(panel).not.toHaveClass('govuk-tabs__panel--hidden');
      expect(panel).not.toHaveAttribute('role');
    });
  });

  it('renders a custom title', () => {
    render(<Tabs items={items} title="Case volumes" />);
    expect(screen.getByRole('heading', { name: 'Case volumes' })).toBeInTheDocument();
  });

  it('has no axe violations when enhanced', async () => {
    const { container } = render(<Tabs items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations when degraded', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );
    const { container } = render(<Tabs items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
