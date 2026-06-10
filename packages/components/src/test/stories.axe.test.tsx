/**
 * Automated axe sweep across every Storybook story: each story is rendered
 * with the project's preview annotations (decorators, parameters) and checked
 * with axe-core via jest-axe. This complements the Storybook a11y addon,
 * which performs the same check interactively (and fails stories in UI test
 * runs via `a11y: { test: 'error' }`).
 */
import { render } from '@testing-library/react';
import { composeStories, setProjectAnnotations } from '@storybook/react-vite';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import preview from '../../.storybook/preview';

setProjectAnnotations([preview]);

type StoriesModule = Parameters<typeof composeStories>[0];

const storyModules = import.meta.glob<StoriesModule>('../**/*.stories.tsx', { eager: true });

/**
 * govuk-frontend deliberately sets `aria-expanded` on radio/checkbox inputs
 * with conditional reveals (see radios.mjs / checkboxes.mjs), which axe's
 * `aria-allowed-attr` rule flags because the ARIA spec does not list the
 * attribute for those roles. GDS keeps it because testing showed it helps
 * screen reader users; we match upstream, so that exact pattern — and only
 * that pattern — is filtered out here.
 */
function isKnownUpstreamPattern(violation: { id: string; nodes: { html: string }[] }): boolean {
  return (
    violation.id === 'aria-allowed-attr' &&
    violation.nodes.every(
      (node) =>
        /class="[^"]*(govuk-radios__input|govuk-checkboxes__input)/.test(node.html) &&
        node.html.includes('aria-controls'),
    )
  );
}

describe.each(Object.entries(storyModules))('%s', (_path, module) => {
  // Portable stories are renderable components once composed with the
  // project annotations; the generic module type loses that information.
  const stories = composeStories(module) as Record<string, React.ComponentType>;
  it.each(Object.entries(stories))('%s has no axe violations', async (_name, Story) => {
    const { container } = render(<Story />);
    const results = await axe(container);
    results.violations = results.violations.filter(
      (violation) => !isKnownUpstreamPattern(violation),
    );
    expect(results).toHaveNoViolations();
  });
});
