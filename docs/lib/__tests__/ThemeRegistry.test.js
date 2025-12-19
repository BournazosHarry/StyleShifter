"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const ThemeRegistry_1 = require("../ThemeRegistry");
(0, vitest_1.describe)('ThemeRegistry', () => {
    (0, vitest_1.afterEach)(() => {
        // Clear all cascades after each test
        ThemeRegistry_1.ThemeRegistry.clearCascades();
    });
    (0, vitest_1.describe)('registerCascade', () => {
        (0, vitest_1.it)('should register a cascade for a namespace', () => {
            const data = { color: '#000', size: 16 };
            ThemeRegistry_1.ThemeRegistry.registerCascade('test', data);
            const cascades = ThemeRegistry_1.ThemeRegistry.getCascades('test');
            (0, vitest_1.expect)(cascades).toBeDefined();
            (0, vitest_1.expect)(cascades?.length).toBe(1);
            (0, vitest_1.expect)(cascades?.[0]).toEqual(data);
        });
        (0, vitest_1.it)('should append cascade by default', () => {
            ThemeRegistry_1.ThemeRegistry.registerCascade('test', { color: '#000' });
            ThemeRegistry_1.ThemeRegistry.registerCascade('test', { size: 16 });
            const cascades = ThemeRegistry_1.ThemeRegistry.getCascades('test');
            (0, vitest_1.expect)(cascades?.length).toBe(2);
            (0, vitest_1.expect)(cascades?.[0]).toEqual({ color: '#000' });
            (0, vitest_1.expect)(cascades?.[1]).toEqual({ size: 16 });
        });
        (0, vitest_1.it)('should insert cascade at specific index', () => {
            ThemeRegistry_1.ThemeRegistry.registerCascade('test', { a: 1 });
            ThemeRegistry_1.ThemeRegistry.registerCascade('test', { c: 3 });
            ThemeRegistry_1.ThemeRegistry.registerCascade('test', { b: 2 }, 1);
            const cascades = ThemeRegistry_1.ThemeRegistry.getCascades('test');
            (0, vitest_1.expect)(cascades?.[0]).toEqual({ a: 1 });
            (0, vitest_1.expect)(cascades?.[1]).toEqual({ b: 2 });
            (0, vitest_1.expect)(cascades?.[2]).toEqual({ c: 3 });
        });
    });
    (0, vitest_1.describe)('applyCascade', () => {
        (0, vitest_1.it)('should apply cascade values to theme data', () => {
            ThemeRegistry_1.ThemeRegistry.registerCascade('test', {
                color: '#000',
                size: 16,
                font: 'Arial'
            });
            const themeData = { color: '#fff' };
            const result = ThemeRegistry_1.ThemeRegistry.applyCascade('test', themeData);
            (0, vitest_1.expect)(result.color).toBe('#fff'); // Not overridden
            (0, vitest_1.expect)(result.size).toBe(16); // Applied from cascade
            (0, vitest_1.expect)(result.font).toBe('Arial'); // Applied from cascade
        });
        (0, vitest_1.it)('should apply multiple cascades in order', () => {
            ThemeRegistry_1.ThemeRegistry.registerCascade('test', { color: '#000', size: 16 });
            ThemeRegistry_1.ThemeRegistry.registerCascade('test', { color: '#111', font: 'Arial' });
            const themeData = {};
            const result = ThemeRegistry_1.ThemeRegistry.applyCascade('test', themeData);
            (0, vitest_1.expect)(result.color).toBe('#000'); // First cascade sets it
            (0, vitest_1.expect)(result.size).toBe(16);
            (0, vitest_1.expect)(result.font).toBe('Arial');
        });
        (0, vitest_1.it)('should not override existing theme name', () => {
            ThemeRegistry_1.ThemeRegistry.registerCascade('test', { name: 'base' });
            const themeData = { name: 'custom' };
            const result = ThemeRegistry_1.ThemeRegistry.applyCascade('test', themeData);
            (0, vitest_1.expect)(result.name).toBe('custom');
        });
        (0, vitest_1.it)('should apply name from cascade if not set in theme', () => {
            ThemeRegistry_1.ThemeRegistry.registerCascade('test', { name: 'base' });
            const themeData = {};
            const result = ThemeRegistry_1.ThemeRegistry.applyCascade('test', themeData);
            (0, vitest_1.expect)(result.name).toBe('test-base');
        });
        (0, vitest_1.it)('should prepend namespace to name if needed', () => {
            ThemeRegistry_1.ThemeRegistry.registerCascade('myapp', { name: 'dark' });
            const themeData = {};
            const result = ThemeRegistry_1.ThemeRegistry.applyCascade('myapp', themeData);
            (0, vitest_1.expect)(result.name).toBe('myapp-dark');
        });
        (0, vitest_1.it)('should not prepend namespace if already present', () => {
            ThemeRegistry_1.ThemeRegistry.registerCascade('myapp', { name: 'myapp-dark' });
            const themeData = {};
            const result = ThemeRegistry_1.ThemeRegistry.applyCascade('myapp', themeData);
            (0, vitest_1.expect)(result.name).toBe('myapp-dark');
        });
        (0, vitest_1.it)('should return unchanged data if no cascades for namespace', () => {
            const themeData = { color: '#fff' };
            const result = ThemeRegistry_1.ThemeRegistry.applyCascade('nonexistent', themeData);
            (0, vitest_1.expect)(result).toEqual({ color: '#fff' });
        });
        (0, vitest_1.it)('should not apply null or undefined values', () => {
            ThemeRegistry_1.ThemeRegistry.registerCascade('test', {
                color: null,
                size: undefined,
                font: 'Arial'
            });
            const themeData = {};
            const result = ThemeRegistry_1.ThemeRegistry.applyCascade('test', themeData);
            (0, vitest_1.expect)(result.color).toBeUndefined();
            (0, vitest_1.expect)(result.size).toBeUndefined();
            (0, vitest_1.expect)(result.font).toBe('Arial');
        });
    });
    (0, vitest_1.describe)('getCascades', () => {
        (0, vitest_1.it)('should return cascades for a namespace', () => {
            const data1 = { color: '#000' };
            const data2 = { size: 16 };
            ThemeRegistry_1.ThemeRegistry.registerCascade('test', data1);
            ThemeRegistry_1.ThemeRegistry.registerCascade('test', data2);
            const cascades = ThemeRegistry_1.ThemeRegistry.getCascades('test');
            (0, vitest_1.expect)(cascades).toEqual([data1, data2]);
        });
        (0, vitest_1.it)('should return undefined for nonexistent namespace', () => {
            const cascades = ThemeRegistry_1.ThemeRegistry.getCascades('nonexistent');
            (0, vitest_1.expect)(cascades).toBeUndefined();
        });
    });
    (0, vitest_1.describe)('clearCascades', () => {
        (0, vitest_1.it)('should clear cascades for specific namespace', () => {
            ThemeRegistry_1.ThemeRegistry.registerCascade('test1', { color: '#000' });
            ThemeRegistry_1.ThemeRegistry.registerCascade('test2', { color: '#fff' });
            ThemeRegistry_1.ThemeRegistry.clearCascades('test1');
            (0, vitest_1.expect)(ThemeRegistry_1.ThemeRegistry.getCascades('test1')).toBeUndefined();
            (0, vitest_1.expect)(ThemeRegistry_1.ThemeRegistry.getCascades('test2')).toBeDefined();
        });
        (0, vitest_1.it)('should clear all cascades if no namespace specified', () => {
            ThemeRegistry_1.ThemeRegistry.registerCascade('test1', { color: '#000' });
            ThemeRegistry_1.ThemeRegistry.registerCascade('test2', { color: '#fff' });
            ThemeRegistry_1.ThemeRegistry.clearCascades();
            (0, vitest_1.expect)(ThemeRegistry_1.ThemeRegistry.getCascades('test1')).toBeUndefined();
            (0, vitest_1.expect)(ThemeRegistry_1.ThemeRegistry.getCascades('test2')).toBeUndefined();
        });
    });
    (0, vitest_1.describe)('sanitizeName', () => {
        (0, vitest_1.it)('should create valid CSS class names', () => {
            (0, vitest_1.expect)(ThemeRegistry_1.ThemeRegistry.sanitizeName('app', 'dark')).toBe('app-dark');
            (0, vitest_1.expect)(ThemeRegistry_1.ThemeRegistry.sanitizeName('my-app', 'theme')).toBe('my-app-theme');
        });
        (0, vitest_1.it)('should replace invalid characters with hyphens', () => {
            (0, vitest_1.expect)(ThemeRegistry_1.ThemeRegistry.sanitizeName('app', 'dark theme!')).toBe('app-dark-theme-');
            (0, vitest_1.expect)(ThemeRegistry_1.ThemeRegistry.sanitizeName('app', 'theme@2024')).toBe('app-theme-2024');
            (0, vitest_1.expect)(ThemeRegistry_1.ThemeRegistry.sanitizeName('app', 'my.theme')).toBe('app-my-theme');
        });
        (0, vitest_1.it)('should preserve valid characters', () => {
            (0, vitest_1.expect)(ThemeRegistry_1.ThemeRegistry.sanitizeName('app', 'dark_theme-2024')).toBe('app-dark_theme-2024');
            (0, vitest_1.expect)(ThemeRegistry_1.ThemeRegistry.sanitizeName('app123', 'theme456')).toBe('app123-theme456');
        });
    });
});
