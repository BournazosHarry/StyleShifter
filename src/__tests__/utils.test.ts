import { describe, it, expect } from 'vitest';
import { ColorUtils } from '../utils';

describe('ColorUtils', () => {
  describe('cssColorToRGBA', () => {
    it('should convert hex colors to RGBA', () => {
      expect(ColorUtils.cssColorToRGBA('#000000')).toEqual([0, 0, 0, 255]);
      expect(ColorUtils.cssColorToRGBA('#ffffff')).toEqual([255, 255, 255, 255]);
      expect(ColorUtils.cssColorToRGBA('#ff0000')).toEqual([255, 0, 0, 255]);
    });

    it('should convert shorthand hex colors', () => {
      expect(ColorUtils.cssColorToRGBA('#000')).toEqual([0, 0, 0, 255]);
      expect(ColorUtils.cssColorToRGBA('#fff')).toEqual([255, 255, 255, 255]);
      expect(ColorUtils.cssColorToRGBA('#f00')).toEqual([255, 0, 0, 255]);
    });

    it('should handle hex colors with alpha', () => {
      expect(ColorUtils.cssColorToRGBA('#00000080')).toEqual([0, 0, 0, 128]);
      expect(ColorUtils.cssColorToRGBA('#ffffffff')).toEqual([255, 255, 255, 255]);
      expect(ColorUtils.cssColorToRGBA('#ff0000ff')).toEqual([255, 0, 0, 255]);
    });

    it('should handle shorthand hex with alpha', () => {
      expect(ColorUtils.cssColorToRGBA('#0008')).toEqual([0, 0, 0, 136]);
      expect(ColorUtils.cssColorToRGBA('#ffff')).toEqual([255, 255, 255, 255]);
    });

    it('should convert rgb colors', () => {
      expect(ColorUtils.cssColorToRGBA('rgb(0, 0, 0)')).toEqual([0, 0, 0, 255]);
      expect(ColorUtils.cssColorToRGBA('rgb(255, 255, 255)')).toEqual([255, 255, 255, 255]);
      expect(ColorUtils.cssColorToRGBA('rgb(128, 64, 32)')).toEqual([128, 64, 32, 255]);
    });

    it('should convert rgba colors', () => {
      expect(ColorUtils.cssColorToRGBA('rgba(0, 0, 0, 0.5)')).toEqual([0, 0, 0, 128]);
      expect(ColorUtils.cssColorToRGBA('rgba(255, 255, 255, 1)')).toEqual([255, 255, 255, 255]);
      expect(ColorUtils.cssColorToRGBA('rgba(128, 64, 32, 0.75)')).toEqual([128, 64, 32, 191]);
    });

    it('should handle rgba with zero alpha', () => {
      expect(ColorUtils.cssColorToRGBA('rgba(255, 0, 0, 0)')).toEqual([255, 0, 0, 0]);
    });

    it('should return default for invalid colors', () => {
      expect(ColorUtils.cssColorToRGBA('invalid')).toEqual([0, 0, 0, 255]);
      expect(ColorUtils.cssColorToRGBA('blue')).toEqual([0, 0, 0, 255]);
    });
  });

  describe('rgbaToHex', () => {
    it('should convert RGBA to hex', () => {
      expect(ColorUtils.rgbaToHex(0, 0, 0, 255)).toBe('#000000');
      expect(ColorUtils.rgbaToHex(255, 255, 255, 255)).toBe('#ffffff');
      expect(ColorUtils.rgbaToHex(255, 0, 0, 255)).toBe('#ff0000');
    });

    it('should include alpha channel when not 255', () => {
      expect(ColorUtils.rgbaToHex(0, 0, 0, 128)).toBe('#00000080');
      expect(ColorUtils.rgbaToHex(255, 255, 255, 0)).toBe('#ffffff00');
      expect(ColorUtils.rgbaToHex(255, 0, 0, 191)).toBe('#ff0000bf');
    });

    it('should handle edge cases', () => {
      expect(ColorUtils.rgbaToHex(128, 128, 128, 255)).toBe('#808080');
      expect(ColorUtils.rgbaToHex(16, 32, 48, 64)).toBe('#10203040');
    });

    it('should default alpha to 255 if not provided', () => {
      expect(ColorUtils.rgbaToHex(255, 0, 0)).toBe('#ff0000');
    });

    it('should round color values', () => {
      expect(ColorUtils.rgbaToHex(127.4, 127.6, 128.1, 255)).toBe('#7f8080');
    });
  });

  describe('round-trip conversions', () => {
    it('should convert hex to RGBA and back', () => {
      const original = '#ff5733';
      const rgba = ColorUtils.cssColorToRGBA(original);
      const result = ColorUtils.rgbaToHex(rgba[0], rgba[1], rgba[2], rgba[3]);
      expect(result).toBe(original);
    });

    it('should convert hex with alpha to RGBA and back', () => {
      const original = '#ff573380';
      const rgba = ColorUtils.cssColorToRGBA(original);
      const result = ColorUtils.rgbaToHex(rgba[0], rgba[1], rgba[2], rgba[3]);
      expect(result).toBe(original);
    });

    it('should convert shorthand hex correctly', () => {
      const original = '#f53';
      const expanded = '#ff5533';
      const rgba = ColorUtils.cssColorToRGBA(original);
      const result = ColorUtils.rgbaToHex(rgba[0], rgba[1], rgba[2], rgba[3]);
      expect(result).toBe(expanded);
    });
  });
});
