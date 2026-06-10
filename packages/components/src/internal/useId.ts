import { useId as useReactId } from 'react';

/** Use the given id when provided, otherwise generate a stable unique one. */
export function useOptionalId(id: string | undefined, prefix: string): string {
  const generated = useReactId();
  return id ?? `${prefix}-${generated.replace(/:/g, '')}`;
}
