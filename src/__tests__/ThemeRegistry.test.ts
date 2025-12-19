import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeRegistry } from '../ThemeRegistry';
import { ThemeData } from '../types';

describe('ThemeRegistry', () => {
  afterEach(() => {
    // Clear all cascades after each test
    ThemeRegistry.clearCascades();
  });

  describe('registerCascade', () => {
    it('should register a cascade for a namespace', () => {
      const data: ThemeData = { color: '#000', size: 16 };
      ThemeRegistry.registerCascade('test', data);

      const cascades = ThemeRegistry.getCascades('test');
      expect(cascades).toBeDefined();
      expect(cascades?.length).toBe(1);
      expect(cascades?.[0]).toEqual(data);
    });

    it('should append cascade by default', () => {
      ThemeRegistry.registerCascade('test', { color: '#000' });
      ThemeRegistry.registerCascade('test', { size: 16 });

      const cascades = ThemeRegistry.getCascades('test');
      expect(cascades?.length).toBe(2);
      expect(cascades?.[0]).toEqual({ color: '#000' });
      expect(cascades?.[1]).toEqual({ size: 16 });
    });

    it('should insert cascade at specific index', () => {
      ThemeRegistry.registerCascade('test', { a: 1 });
      ThemeRegistry.registerCascade('test', { c: 3 });
      ThemeRegistry.registerCascade('test', { b: 2 }, 1);

      const cascades = ThemeRegistry.getCascades('test');
      expect(cascades?.[0]).toEqual({ a: 1 });
      expect(cascades?.[1]).toEqual({ b: 2 });
      expect(cascades?.[2]).toEqual({ c: 3 });
    });
  });

  describe('applyCascade', () => {
    it('should apply cascade values to theme data', () => {
      ThemeRegistry.registerCascade('test', {
        color: '#000',
        size: 16,
        font: 'Arial'
      });

      const themeData: ThemeData = { color: '#fff' };
      const result = ThemeRegistry.applyCascade('test', themeData);

      expect(result.color).toBe('#fff'); // Not overridden
      expect(result.size).toBe(16); // Applied from cascade
      expect(result.font).toBe('Arial'); // Applied from cascade
    });

    it('should apply multiple cascades in order', () => {
      ThemeRegistry.registerCascade('test', { color: '#000', size: 16 });
      ThemeRegistry.registerCascade('test', { color: '#111', font: 'Arial' });

      const themeData: ThemeData = {};
      const result = ThemeRegistry.applyCascade('test', themeData);

      expect(result.color).toBe('#000'); // First cascade sets it
      expect(result.size).toBe(16);
      expect(result.font).toBe('Arial');
    });

    it('should not override existing theme name', () => {
      ThemeRegistry.registerCascade('test', { name: 'base' });

      const themeData: ThemeData = { name: 'custom' };
      const result = ThemeRegistry.applyCascade('test', themeData);

      expect(result.name).toBe('custom');
    });

    it('should apply name from cascade if not set in theme', () => {
      ThemeRegistry.registerCascade('test', { name: 'base' });

      const themeData: ThemeData = {};
      const result = ThemeRegistry.applyCascade('test', themeData);

      expect(result.name).toBe('test-base');
    });

    it('should prepend namespace to name if needed', () => {
      ThemeRegistry.registerCascade('myapp', { name: 'dark' });

      const themeData: ThemeData = {};
      const result = ThemeRegistry.applyCascade('myapp', themeData);

      expect(result.name).toBe('myapp-dark');
    });

    it('should not prepend namespace if already present', () => {
      ThemeRegistry.registerCascade('myapp', { name: 'myapp-dark' });

      const themeData: ThemeData = {};
      const result = ThemeRegistry.applyCascade('myapp', themeData);

      expect(result.name).toBe('myapp-dark');
    });

    it('should return unchanged data if no cascades for namespace', () => {
      const themeData: ThemeData = { color: '#fff' };
      const result = ThemeRegistry.applyCascade('nonexistent', themeData);

      expect(result).toEqual({ color: '#fff' });
    });

    it('should not apply null or undefined values', () => {
      ThemeRegistry.registerCascade('test', {
        color: null,
        size: undefined,
        font: 'Arial'
      });

      const themeData: ThemeData = {};
      const result = ThemeRegistry.applyCascade('test', themeData);

      expect(result.color).toBeUndefined();
      expect(result.size).toBeUndefined();
      expect(result.font).toBe('Arial');
    });
  });

  describe('getCascades', () => {
    it('should return cascades for a namespace', () => {
      const data1 = { color: '#000' };
      const data2 = { size: 16 };
      
      ThemeRegistry.registerCascade('test', data1);
      ThemeRegistry.registerCascade('test', data2);

      const cascades = ThemeRegistry.getCascades('test');
      expect(cascades).toEqual([data1, data2]);
    });

    it('should return undefined for nonexistent namespace', () => {
      const cascades = ThemeRegistry.getCascades('nonexistent');
      expect(cascades).toBeUndefined();
    });
  });

  describe('clearCascades', () => {
    it('should clear cascades for specific namespace', () => {
      ThemeRegistry.registerCascade('test1', { color: '#000' });
      ThemeRegistry.registerCascade('test2', { color: '#fff' });

      ThemeRegistry.clearCascades('test1');

      expect(ThemeRegistry.getCascades('test1')).toBeUndefined();
      expect(ThemeRegistry.getCascades('test2')).toBeDefined();
    });

    it('should clear all cascades if no namespace specified', () => {
      ThemeRegistry.registerCascade('test1', { color: '#000' });
      ThemeRegistry.registerCascade('test2', { color: '#fff' });

      ThemeRegistry.clearCascades();

      expect(ThemeRegistry.getCascades('test1')).toBeUndefined();
      expect(ThemeRegistry.getCascades('test2')).toBeUndefined();
    });
  });

  describe('sanitizeName', () => {
    it('should create valid CSS class names', () => {
      expect(ThemeRegistry.sanitizeName('app', 'dark')).toBe('app-dark');
      expect(ThemeRegistry.sanitizeName('my-app', 'theme')).toBe('my-app-theme');
    });

    it('should replace invalid characters with hyphens', () => {
      expect(ThemeRegistry.sanitizeName('app', 'dark theme!')).toBe('app-dark-theme-');
      expect(ThemeRegistry.sanitizeName('app', 'theme@2024')).toBe('app-theme-2024');
      expect(ThemeRegistry.sanitizeName('app', 'my.theme')).toBe('app-my-theme');
    });

    it('should preserve valid characters', () => {
      expect(ThemeRegistry.sanitizeName('app', 'dark_theme-2024')).toBe('app-dark_theme-2024');
      expect(ThemeRegistry.sanitizeName('app123', 'theme456')).toBe('app123-theme456');
    });
  });
});
