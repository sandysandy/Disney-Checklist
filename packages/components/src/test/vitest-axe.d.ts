/* Wire jest-axe's matcher into vitest's expect types. */
import 'vitest';

declare module 'vitest' {
  interface Assertion<T> {
    toHaveNoViolations(): T;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
