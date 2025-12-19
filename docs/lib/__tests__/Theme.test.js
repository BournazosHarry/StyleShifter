"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const Theme_1 = require("../Theme");
(0, vitest_1.describe)('Theme', () => {
    (0, vitest_1.describe)('constructor', () => {
        (0, vitest_1.it)('should create a theme with basic options', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'dark',
                data: { color: '#000' }
            });
            (0, vitest_1.expect)(theme.namespace).toBe('test');
            (0, vitest_1.expect)(theme.name).toBe('dark');
            (0, vitest_1.expect)(theme.data).toEqual({ color: '#000' });
        });
        (0, vitest_1.it)('should initialize with fonts if provided', () => {
            const fonts = new Map([['title', 'font.woff2']]);
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: {},
                fonts
            });
            (0, vitest_1.expect)(theme.getFonts()).toBe(fonts);
        });
        (0, vitest_1.it)('should auto-dispatch complete event when no dependencies', (done) => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: {}
            });
            theme.onComplete(() => {
                done();
            });
        });
    });
    (0, vitest_1.describe)('applyTo', () => {
        (0, vitest_1.it)('should add theme class to element', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'dark',
                data: {}
            });
            const element = document.createElement('div');
            theme.applyTo(element);
            (0, vitest_1.expect)(element.classList.contains('dark')).toBe(true);
        });
        (0, vitest_1.it)('should not add duplicate classes', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'dark',
                data: {}
            });
            const element = document.createElement('div');
            theme.applyTo(element);
            theme.applyTo(element);
            (0, vitest_1.expect)(element.className).toBe('dark');
        });
    });
    (0, vitest_1.describe)('removeFrom', () => {
        (0, vitest_1.it)('should remove theme class from element', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'dark',
                data: {}
            });
            const element = document.createElement('div');
            element.classList.add('dark');
            theme.removeFrom(element);
            (0, vitest_1.expect)(element.classList.contains('dark')).toBe(false);
        });
    });
    (0, vitest_1.describe)('getValue and setValue', () => {
        (0, vitest_1.it)('should get and set data values', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: { color: '#000' }
            });
            (0, vitest_1.expect)(theme.getValue('color')).toBe('#000');
            theme.setValue('color', '#fff');
            (0, vitest_1.expect)(theme.getValue('color')).toBe('#fff');
        });
    });
    (0, vitest_1.describe)('preloadImages', () => {
        (0, vitest_1.it)('should increment pending dependencies for each image', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: {}
            });
            theme.preloadImages(['img1.jpg', 'img2.jpg']);
            // Should have pending dependencies
            (0, vitest_1.expect)(theme.pendingDependencies).toBe(2);
        });
        (0, vitest_1.it)('should call onComplete when all images load', (done) => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: {},
                preloadImages: ['data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7']
            });
            theme.onComplete(() => {
                done();
            });
        });
    });
    (0, vitest_1.describe)('onComplete', () => {
        (0, vitest_1.it)('should call callback immediately if already completed', (done) => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: {}
            });
            // Wait for auto-complete
            setTimeout(() => {
                theme.onComplete(() => {
                    done();
                });
            }, 20);
        });
        (0, vitest_1.it)('should queue callbacks if not yet completed', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: {}
            });
            let called = false;
            theme.onComplete(() => {
                called = true;
            });
            // Should be called after timeout
            setTimeout(() => {
                (0, vitest_1.expect)(called).toBe(true);
            }, 20);
        });
    });
    (0, vitest_1.describe)('getFonts', () => {
        (0, vitest_1.it)('should return null if no fonts', () => {
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: {}
            });
            (0, vitest_1.expect)(theme.getFonts()).toBeNull();
        });
        (0, vitest_1.it)('should return fonts map if provided', () => {
            const fonts = new Map([['body', 'font.woff2']]);
            const theme = new Theme_1.Theme({
                namespace: 'test',
                name: 'theme',
                data: {},
                fonts
            });
            (0, vitest_1.expect)(theme.getFonts()).toBe(fonts);
        });
    });
});
