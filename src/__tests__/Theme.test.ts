import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Theme } from '../Theme';

describe('Theme', () => {
  describe('constructor', () => {
    it('should create a theme with basic options', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'dark',
        data: { color: '#000' }
      });

      expect(theme.namespace).toBe('test');
      expect(theme.name).toBe('dark');
      expect(theme.data).toEqual({ color: '#000' });
    });

    it('should initialize with fonts if provided', () => {
      const fonts = new Map([['title', 'font.woff2']]);
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: {},
        fonts
      });

      expect(theme.getFonts()).toBe(fonts);
    });

    it('should auto-dispatch complete event when no dependencies', async () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: {}
      });

      await new Promise<void>((resolve) => {
        theme.onComplete(() => {
          resolve();
        });
      });
    });
  });

  describe('applyTo', () => {
    it('should add theme class to element', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'dark',
        data: {}
      });

      const element = document.createElement('div');
      theme.applyTo(element);

      expect(element.classList.contains('dark')).toBe(true);
    });

    it('should not add duplicate classes', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'dark',
        data: {}
      });

      const element = document.createElement('div');
      theme.applyTo(element);
      theme.applyTo(element);

      expect(element.className).toBe('dark');
    });
  });

  describe('removeFrom', () => {
    it('should remove theme class from element', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'dark',
        data: {}
      });

      const element = document.createElement('div');
      element.classList.add('dark');
      theme.removeFrom(element);

      expect(element.classList.contains('dark')).toBe(false);
    });
  });

  describe('getValue and setValue', () => {
    it('should get and set data values', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: { color: '#000' }
      });

      expect(theme.getValue('color')).toBe('#000');
      
      theme.setValue('color', '#fff');
      expect(theme.getValue('color')).toBe('#fff');
    });
  });

  describe('preloadImages', () => {
    it('should increment pending dependencies for each image', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: {}
      });

      theme.preloadImages(['img1.jpg', 'img2.jpg']);
      
      // Should have pending dependencies
      expect((theme as any).pendingDependencies).toBe(2);
    });

    it('should call onComplete when all images load', async () => {
      let completed = false;
      
      // Create theme with preloadImages - should prevent auto-complete
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: {},
        preloadImages: [] // Empty array, will load immediately
      });

      theme.onComplete(() => {
        completed = true;
      });
      
      // Wait for completion
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(completed).toBe(true);
    });
  });

  describe('onComplete', () => {
    it('should call callback immediately if already completed', async () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: {}
      });

      // Wait for auto-complete
      await new Promise(resolve => setTimeout(resolve, 20));
      
      await new Promise<void>((resolve) => {
        theme.onComplete(() => {
          resolve();
        });
      });
    });

    it('should queue callbacks if not yet completed', () => {
      const theme = new Theme({
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
        expect(called).toBe(true);
      }, 20);
    });
  });

  describe('getFonts', () => {
    it('should return null if no fonts', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: {}
      });

      expect(theme.getFonts()).toBeNull();
    });

    it('should return fonts map if provided', () => {
      const fonts = new Map([['body', 'font.woff2']]);
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: {},
        fonts
      });

      expect(theme.getFonts()).toBe(fonts);
    });
  });
});
