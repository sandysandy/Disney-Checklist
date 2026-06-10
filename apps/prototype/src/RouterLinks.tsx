import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

/**
 * The component library renders plain `<a>` elements (faithful GOV.UK
 * markup). Wrapping a page in this component turns clicks on internal links
 * (href starting with "/") into client-side navigations, so prototype state
 * such as journey answers survives.
 */
export function RouterLinks({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={(event) => {
        const anchor = (event.target as HTMLElement).closest('a');
        if (
          anchor &&
          anchor.getAttribute('href')?.startsWith('/') &&
          !event.defaultPrevented &&
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        ) {
          event.preventDefault();
          navigate(anchor.getAttribute('href')!);
        }
      }}
    >
      {children}
    </div>
  );
}
