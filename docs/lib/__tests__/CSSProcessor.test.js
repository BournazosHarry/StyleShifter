"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const CSSProcessor_1 = require("../CSSProcessor");
const Theme_1 = require("../Theme");
(0, vitest_1.describe)('CSSProcessor', () => {
    let processor;
    (0, vitest_1.beforeEach)(() => {
        processor = new CSSProcessor_1.CSSProcessor({ namespace: 'test' });
        // Clear any existing style tags
        const existingStyles = document.querySelectorAll('style[id^="style-shifter-"]');
        existingStyles.forEach(el => el.remove());
    });
    (0, vitest_1.afterEach)(() => {
        // Clean up
        const styles = document.querySelectorAll('style[id^="style-shifter-"]');
        styles.forEach(el => el.remove());
    });
    (0, vitest_1.describe)('constructor', () => {
        (0, vitest_1.it)('should create processor with namespace', () => {
            (0, vitest_1.expect)(processor).toBeDefined();
            (0, vitest_1.expect)(processor.namespace).toBe('test');
        });
        (0, vitest_1.it)('should register built-in functions', () => {
            (0, vitest_1.expect)(processor.apiFunctions.has('url')).toBe(true);
            (0, vitest_1.expect)(processor.apiFunctions.has('toPx')).toBe(true);
            (0, vitest_1.expect)(processor.apiFunctions.has('toRem')).toBe(true);
            (0, vitest_1.expect)(processor.apiFunctions.has('opacify')).toBe(true);
            (0, vitest_1.expect)(processor.apiFunctions.has('tint')).toBe(true);
            (0, vitest_1.expect)(processor.apiFunctions.has('invert')).toBe(true);
            (0, vitest_1.expect)(processor.apiFunctions.has('printf')).toBe(true);
        });
        (0, vitest_1.it)('should accept preprocessors and postprocessors', () => {
            const pre = vitest_1.vi.fn();
            const post = vitest_1.vi.fn();
            const proc = new CSSProcessor_1.CSSProcessor({
                namespace: 'test',
                preprocessors: [pre],
                postprocessors: [post]
            });
            (0, vitest_1.expect)(proc.preprocessors.length).toBe(1);
            (0, vitest_1.expect)(proc.postprocessors.length).toBe(1);
        });
    });
    (0, vitest_1.describe)('registerFunction', () => {
        (0, vitest_1.it)('should register custom function', () => {
            const customFn = () => 'custom-result';
            processor.registerFunction('custom', customFn);
            (0, vitest_1.expect)(processor.apiFunctions.has('custom')).toBe(true);
        });
        (0, vitest_1.it)('should allow overriding built-in functions', () => {
            const customUrl = () => 'custom-url';
            processor.registerFunction('url', customUrl);
            (0, vitest_1.expect)(processor.apiFunctions.get('url')).toBe(customUrl);
        });
    });
    (0, vitest_1.describe)('evaluateExpression', () => {
        (0, vitest_1.it)('should evaluate property access', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: { color: '#ff0000' }
            });
            const result = processor.evaluateExpression('test.color', theme, '', 0);
            (0, vitest_1.expect)(result).toBe('#ff0000');
        });
        (0, vitest_1.it)('should evaluate nested property access', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: {
                    colors: {
                        primary: '#ff0000'
                    }
                }
            });
            const result = processor.evaluateExpression('test.colors.primary', theme, '', 0);
            (0, vitest_1.expect)(result).toBe('#ff0000');
        });
        (0, vitest_1.it)('should evaluate function calls', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: { size: 16 }
            });
            const result = processor.evaluateExpression('toPx(test.size)', theme, '', 0);
            (0, vitest_1.expect)(result).toBe('16px');
        });
        (0, vitest_1.it)('should return null for undefined properties', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: {}
            });
            const result = processor.evaluateExpression('test.undefined', theme, '', 0);
            (0, vitest_1.expect)(result).toBeNull();
        });
    });
    (0, vitest_1.describe)('getFuncInfo', () => {
        (0, vitest_1.it)('should parse function name and arguments', () => {
            const result = processor.getFuncInfo('toPx(16)');
            (0, vitest_1.expect)(result).toBeDefined();
            (0, vitest_1.expect)(result.name).toBe('toPx');
            (0, vitest_1.expect)(result.args).toEqual(['16']);
        });
        (0, vitest_1.it)('should parse multiple arguments', () => {
            const result = processor.getFuncInfo('printf(%1 %2, hello, world)');
            (0, vitest_1.expect)(result.name).toBe('printf');
            (0, vitest_1.expect)(result.args.length).toBeGreaterThan(1);
        });
        (0, vitest_1.it)('should return null for non-function expressions', () => {
            const result = processor.getFuncInfo('test.color');
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should handle nested parentheses', () => {
            const result = processor.getFuncInfo('outer(inner(value))');
            (0, vitest_1.expect)(result).toBeDefined();
            (0, vitest_1.expect)(result.name).toBe('outer');
        });
    });
    (0, vitest_1.describe)('parseArgsList', () => {
        (0, vitest_1.it)('should parse comma-separated arguments', () => {
            const result = processor.parseArgsList('arg1, arg2, arg3');
            (0, vitest_1.expect)(result).toEqual(['arg1', 'arg2', 'arg3']);
        });
        (0, vitest_1.it)('should handle nested parentheses', () => {
            const result = processor.parseArgsList('outer, inner(a, b), last');
            (0, vitest_1.expect)(result).toHaveLength(3);
            (0, vitest_1.expect)(result[1]).toContain('inner(a, b)');
        });
        (0, vitest_1.it)('should trim whitespace', () => {
            const result = processor.parseArgsList('  arg1  ,  arg2  ');
            (0, vitest_1.expect)(result).toEqual(['arg1', 'arg2']);
        });
        (0, vitest_1.it)('should handle empty string', () => {
            const result = processor.parseArgsList('');
            (0, vitest_1.expect)(result).toEqual([]);
        });
    });
    (0, vitest_1.describe)('formatRuleSelector', () => {
        (0, vitest_1.it)('should add theme class to selector', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'dark',
                data: {}
            });
            const result = processor.formatRuleSelector('.button', theme);
            (0, vitest_1.expect)(result).toBe('.dark .button');
        });
        (0, vitest_1.it)('should handle multiple selectors', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'dark',
                data: {}
            });
            const result = processor.formatRuleSelector('.button, .link', theme);
            (0, vitest_1.expect)(result).toContain('.dark .button');
            (0, vitest_1.expect)(result).toContain('.dark .link');
        });
        (0, vitest_1.it)('should handle media queries', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'dark',
                data: {}
            });
            const result = processor.formatRuleSelector('@media screen { .button', theme);
            (0, vitest_1.expect)(result).toContain('@media');
            (0, vitest_1.expect)(result).toContain('.dark');
        });
    });
    (0, vitest_1.describe)('extractRuleName', () => {
        const css = `
.button { color: red; }
.link { color: blue; }
@media screen {
  .responsive { font-size: 16px; }
}`;
        (0, vitest_1.it)('should extract simple rule name', () => {
            const idx = css.indexOf('color: red');
            const result = processor.extractRuleName(css, idx, false);
            (0, vitest_1.expect)(result).toBe('.button');
        });
        (0, vitest_1.it)('should extract rule with multiple selectors', () => {
            const css2 = '.button, .link { color: red; }';
            const idx = css2.indexOf('color');
            const result = processor.extractRuleName(css2, idx, false);
            (0, vitest_1.expect)(result).toContain('.button');
            (0, vitest_1.expect)(result).toContain('.link');
        });
        (0, vitest_1.it)('should handle media queries', () => {
            const idx = css.indexOf('font-size');
            const result = processor.extractRuleName(css, idx, true);
            (0, vitest_1.expect)(result).toContain('@media');
        });
    });
    (0, vitest_1.describe)('removeWhiteSpace', () => {
        (0, vitest_1.it)('should remove all whitespace', () => {
            const result = processor.removeWhiteSpace('  hello  world  ');
            (0, vitest_1.expect)(result).toBe('helloworld');
        });
        (0, vitest_1.it)('should remove tabs and newlines', () => {
            const result = processor.removeWhiteSpace('hello\t\n\rworld');
            (0, vitest_1.expect)(result).toBe('helloworld');
        });
    });
    (0, vitest_1.describe)('local and global variables', () => {
        (0, vitest_1.it)('should set and get local variables', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: {}
            });
            // Set variable
            processor.local('', theme, '', 0, ['myVar', 'myValue']);
            // Get variable
            const result = processor.local('', theme, '', 0, ['myVar']);
            (0, vitest_1.expect)(result).toBe('myValue');
        });
        (0, vitest_1.it)('should set and get global variables', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: {}
            });
            // Set variable
            processor.global('', theme, '', 0, ['globalVar', 'globalValue']);
            // Get variable
            const result = processor.global('', theme, '', 0, ['globalVar']);
            (0, vitest_1.expect)(result).toBe('globalValue');
        });
        (0, vitest_1.it)('should not override reserved "value" variable', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: {}
            });
            processor.local('', theme, '', 0, ['value', 'shouldNotSet']);
            // Should not be set
            const result = processor.defines.get('value');
            (0, vitest_1.expect)(result).toBeUndefined();
        });
        (0, vitest_1.it)('should return empty string for undefined variables', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: {}
            });
            const result = processor.local('', theme, '', 0, ['undefined']);
            (0, vitest_1.expect)(result).toBe('');
        });
    });
    (0, vitest_1.describe)('addTheme', () => {
        (0, vitest_1.it)('should not process same theme twice', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: { color: '#000' }
            });
            processor.addTheme(theme);
            processor.addTheme(theme);
            (0, vitest_1.expect)(processor.themeCached.has(theme.name)).toBe(true);
            (0, vitest_1.expect)(processor.themeCached.size).toBe(1);
        });
    });
    (0, vitest_1.describe)('injectStyle', () => {
        (0, vitest_1.it)('should inject style tag into document', () => {
            const css = '.test { color: red; }';
            processor.injectStyle(css);
            const styleEl = document.getElementById('style-shifter-test');
            (0, vitest_1.expect)(styleEl).toBeDefined();
            (0, vitest_1.expect)(styleEl?.innerHTML).toBe(css);
        });
        (0, vitest_1.it)('should update existing style tag', () => {
            const css1 = '.test { color: red; }';
            const css2 = '.test { color: blue; }';
            processor.injectStyle(css1);
            processor.injectStyle(css2);
            const styleEl = document.getElementById('style-shifter-test');
            (0, vitest_1.expect)(styleEl?.innerHTML).toBe(css2);
        });
    });
    (0, vitest_1.describe)('integration', () => {
        (0, vitest_1.it)('should process theme with mock CSS', () => {
            // Create a mock stylesheet in the document
            const style = document.createElement('style');
            style.innerHTML = `
        .button {
          /*![test.primaryColor]*/
          background-color: #000000;
        }
      `;
            document.head.appendChild(style);
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'custom',
                data: { primaryColor: '#ff0000' }
            });
            // Mock the parseStyleSheetFromUrlForTheme to use our inline CSS
            const originalMethod = processor.parseStyleSheetFromUrlForTheme;
            processor.parseStyleSheetFromUrlForTheme = function (url, theme) {
                const src = style.innerHTML;
                let idx1 = src.indexOf('/*![');
                while (idx1 !== -1) {
                    const idx2 = src.indexOf(']', idx1);
                    const expression = src.substring(idx1 + 4, idx2);
                    const val = this.evaluateExpression(expression, theme, src, idx1);
                    if (val !== null) {
                        const ruleInfo = this.getRuleInfo(src, idx1, theme);
                        const ruleName = this.formatRuleSelector(ruleInfo.name, theme);
                        if (!this.overrides.has(ruleName)) {
                            this.overrides.set(ruleName, []);
                        }
                        this.overrides.get(ruleName).push({
                            name: ruleName,
                            prop: ruleInfo.prop,
                            value: val,
                            key: expression.split('.').pop(),
                            important: ruleInfo.important
                        });
                    }
                    idx1 = src.indexOf('/*![', idx2 + 1);
                }
            };
            processor.addTheme(theme);
            // Check if style was injected
            const injectedStyle = document.getElementById('style-shifter-test');
            (0, vitest_1.expect)(injectedStyle).toBeDefined();
            // Clean up
            style.remove();
            processor.parseStyleSheetFromUrlForTheme = originalMethod;
        });
    });
});
