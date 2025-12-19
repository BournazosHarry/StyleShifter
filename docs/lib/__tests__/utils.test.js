"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const utils_1 = require("../utils");
(0, vitest_1.describe)('ColorUtils', () => {
    (0, vitest_1.describe)('cssColorToRGBA', () => {
        (0, vitest_1.it)('should convert hex colors to RGBA', () => {
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('#000000')).toEqual([0, 0, 0, 255]);
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('#ffffff')).toEqual([255, 255, 255, 255]);
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('#ff0000')).toEqual([255, 0, 0, 255]);
        });
        (0, vitest_1.it)('should convert shorthand hex colors', () => {
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('#000')).toEqual([0, 0, 0, 255]);
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('#fff')).toEqual([255, 255, 255, 255]);
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('#f00')).toEqual([255, 0, 0, 255]);
        });
        (0, vitest_1.it)('should handle hex colors with alpha', () => {
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('#00000080')).toEqual([0, 0, 0, 128]);
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('#ffffffff')).toEqual([255, 255, 255, 255]);
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('#ff0000ff')).toEqual([255, 0, 0, 255]);
        });
        (0, vitest_1.it)('should handle shorthand hex with alpha', () => {
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('#0008')).toEqual([0, 0, 0, 136]);
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('#ffff')).toEqual([255, 255, 255, 255]);
        });
        (0, vitest_1.it)('should convert rgb colors', () => {
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('rgb(0, 0, 0)')).toEqual([0, 0, 0, 255]);
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('rgb(255, 255, 255)')).toEqual([255, 255, 255, 255]);
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('rgb(128, 64, 32)')).toEqual([128, 64, 32, 255]);
        });
        (0, vitest_1.it)('should convert rgba colors', () => {
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('rgba(0, 0, 0, 0.5)')).toEqual([0, 0, 0, 128]);
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('rgba(255, 255, 255, 1)')).toEqual([255, 255, 255, 255]);
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('rgba(128, 64, 32, 0.75)')).toEqual([128, 64, 32, 191]);
        });
        (0, vitest_1.it)('should handle rgba with zero alpha', () => {
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('rgba(255, 0, 0, 0)')).toEqual([255, 0, 0, 0]);
        });
        (0, vitest_1.it)('should return default for invalid colors', () => {
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('invalid')).toEqual([0, 0, 0, 255]);
            (0, vitest_1.expect)(utils_1.ColorUtils.cssColorToRGBA('blue')).toEqual([0, 0, 0, 255]);
        });
    });
    (0, vitest_1.describe)('rgbaToHex', () => {
        (0, vitest_1.it)('should convert RGBA to hex', () => {
            (0, vitest_1.expect)(utils_1.ColorUtils.rgbaToHex(0, 0, 0, 255)).toBe('#000000');
            (0, vitest_1.expect)(utils_1.ColorUtils.rgbaToHex(255, 255, 255, 255)).toBe('#ffffff');
            (0, vitest_1.expect)(utils_1.ColorUtils.rgbaToHex(255, 0, 0, 255)).toBe('#ff0000');
        });
        (0, vitest_1.it)('should include alpha channel when not 255', () => {
            (0, vitest_1.expect)(utils_1.ColorUtils.rgbaToHex(0, 0, 0, 128)).toBe('#00000080');
            (0, vitest_1.expect)(utils_1.ColorUtils.rgbaToHex(255, 255, 255, 0)).toBe('#ffffff00');
            (0, vitest_1.expect)(utils_1.ColorUtils.rgbaToHex(255, 0, 0, 191)).toBe('#ff0000bf');
        });
        (0, vitest_1.it)('should handle edge cases', () => {
            (0, vitest_1.expect)(utils_1.ColorUtils.rgbaToHex(128, 128, 128, 255)).toBe('#808080');
            (0, vitest_1.expect)(utils_1.ColorUtils.rgbaToHex(16, 32, 48, 64)).toBe('#10203040');
        });
        (0, vitest_1.it)('should default alpha to 255 if not provided', () => {
            (0, vitest_1.expect)(utils_1.ColorUtils.rgbaToHex(255, 0, 0)).toBe('#ff0000');
        });
        (0, vitest_1.it)('should round color values', () => {
            (0, vitest_1.expect)(utils_1.ColorUtils.rgbaToHex(127.4, 127.6, 128.1, 255)).toBe('#7f8080');
        });
    });
    (0, vitest_1.describe)('round-trip conversions', () => {
        (0, vitest_1.it)('should convert hex to RGBA and back', () => {
            const original = '#ff5733';
            const rgba = utils_1.ColorUtils.cssColorToRGBA(original);
            const result = utils_1.ColorUtils.rgbaToHex(rgba[0], rgba[1], rgba[2], rgba[3]);
            (0, vitest_1.expect)(result).toBe(original);
        });
        (0, vitest_1.it)('should convert hex with alpha to RGBA and back', () => {
            const original = '#ff573380';
            const rgba = utils_1.ColorUtils.cssColorToRGBA(original);
            const result = utils_1.ColorUtils.rgbaToHex(rgba[0], rgba[1], rgba[2], rgba[3]);
            (0, vitest_1.expect)(result).toBe(original);
        });
        (0, vitest_1.it)('should convert shorthand hex correctly', () => {
            const original = '#f53';
            const expanded = '#ff5533';
            const rgba = utils_1.ColorUtils.cssColorToRGBA(original);
            const result = utils_1.ColorUtils.rgbaToHex(rgba[0], rgba[1], rgba[2], rgba[3]);
            (0, vitest_1.expect)(result).toBe(expanded);
        });
    });
});
