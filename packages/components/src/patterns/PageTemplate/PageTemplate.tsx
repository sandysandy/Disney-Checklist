import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';
import { Footer } from '../../components/Footer/Footer';
import { Header } from '../../components/Header/Header';
import { SkipLink } from '../../components/SkipLink/SkipLink';

export interface PageTemplateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Page content, rendered inside `<main>`. */
  children: ReactNode;
  /** Header area. Defaults to the standard GOV.UK `<Header />`. */
  header?: ReactNode;
  /**
   * Service navigation rendered below the header — typically a
   * `<ServiceNavigation serviceName items />`.
   */
  serviceNavigation?: ReactNode;
  /** Phase banner rendered above the content — typically a `<PhaseBanner tag="Beta" />`. */
  phaseBanner?: ReactNode;
  /**
   * Content between the phase banner and `<main>`, outside the main landmark:
   * back links, breadcrumbs.
   */
  beforeContent?: ReactNode;
  /** Footer area. Defaults to the standard GOV.UK `<Footer />`. Pass `null` to omit. */
  footer?: ReactNode | null;
  /** Banner content rendered before the skip link, e.g. a `<CookieBanner />`. */
  cookieBanner?: ReactNode;
  /** Id of the `<main>` element, targeted by the skip link. */
  mainId?: string;
  /** Extra classes for the `<main>` wrapper. */
  mainClassName?: string;
  /** Extra classes for the width container. */
  containerClassName?: string;
}

/**
 * GOV.UK page template: skip link, header, optional service navigation and
 * phase banner, width-constrained `<main>` wrapper, footer. Matches
 * govuk-frontend's page template (template.njk).
 *
 * @see https://design-system.service.gov.uk/styles/page-template/
 */
export function PageTemplate({
  children,
  header,
  serviceNavigation,
  phaseBanner,
  beforeContent,
  footer,
  cookieBanner,
  mainId = 'main-content',
  mainClassName,
  containerClassName,
  className,
  ...rest
}: PageTemplateProps) {
  return (
    <div {...rest} className={className}>
      {cookieBanner}
      <SkipLink href={`#${mainId}`} />
      <div className="govuk-template__header">
        {header ?? <Header />}
        {serviceNavigation}
      </div>
      <div className={classNames('govuk-width-container', containerClassName)}>
        {phaseBanner}
        {beforeContent}
        <main className={classNames('govuk-main-wrapper', mainClassName)} id={mainId}>
          {children}
        </main>
      </div>
      {footer === null ? null : (
        <div className="govuk-template__footer">{footer ?? <Footer />}</div>
      )}
    </div>
  );
}
