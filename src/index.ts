/**
 * StyleShifter - Dynamic CSS theming system with expression-based style overrides
 * 
 * @example
 * ```typescript
 * import { Theme, CSSProcessor, ThemeRegistry } from 'style-shifter';
 * 
 * // Create a theme
 * const theme = new Theme({
 *   namespace: 'myapp',
 *   name: 'dark-theme',
 *   data: {
 *     primaryColor: '#1a1a1a',
 *     textColor: '#ffffff',
 *     fontSize: 16
 *   }
 * });
 * 
 * // Create CSS processor
 * const processor = new CSSProcessor({ namespace: 'myapp' });
 * 
 * // Process theme
 * processor.addTheme(theme);
 * 
 * // Apply theme to element
 * theme.applyTo(document.body);
 * ```
 */

export { Theme } from './Theme';
export { ThemeRegistry } from './ThemeRegistry';
export { CSSProcessor } from './CSSProcessor';
export { ColorUtils } from './utils';

export type {
  ThemeData,
  ThemeOptions,
  RuleInfo,
  RuleOverride,
  FunctionInfo,
  APIFunction,
  OverrideProcessor,
  CSSProcessorOptions
} from './types';

// Re-export built-in functions for custom extensions
export * as builtInFunctions from './functions';
