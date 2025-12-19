"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const funcs = __importStar(require("../functions"));
// Mock theme for testing
const mockTheme = {
    namespace: 'test',
    name: 'theme',
    data: {
        color: '#ff0000',
        size: 16,
        url: 'image.png'
    }
};
(0, vitest_1.describe)('Built-in API Functions', () => {
    (0, vitest_1.describe)('url', () => {
        (0, vitest_1.it)('should wrap URL in url()', () => {
            const result = funcs.url('', mockTheme, '', 0, ['image.png']);
            (0, vitest_1.expect)(result).toBe('url(image.png)');
        });
        (0, vitest_1.it)('should return null for null input', () => {
            const result = funcs.url('', mockTheme, '', 0, [null]);
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should handle URLs with protocols', () => {
            const result = funcs.url('', mockTheme, '', 0, ['https://example.com/img.jpg']);
            (0, vitest_1.expect)(result).toBe('url(https://example.com/img.jpg)');
        });
    });
    (0, vitest_1.describe)('toPx', () => {
        (0, vitest_1.it)('should convert unitless values to px', () => {
            const result = funcs.toPx('', mockTheme, '', 0, [16]);
            (0, vitest_1.expect)(result).toBe('16px');
        });
        (0, vitest_1.it)('should preserve existing px values', () => {
            const result = funcs.toPx('', mockTheme, '', 0, ['16px']);
            (0, vitest_1.expect)(result).toBe('16px');
        });
        (0, vitest_1.it)('should convert string numbers', () => {
            const result = funcs.toPx('', mockTheme, '', 0, ['24']);
            (0, vitest_1.expect)(result).toBe('24px');
        });
        (0, vitest_1.it)('should return null for null input', () => {
            const result = funcs.toPx('', mockTheme, '', 0, [null]);
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should handle decimal values', () => {
            const result = funcs.toPx('', mockTheme, '', 0, ['16.5']);
            (0, vitest_1.expect)(result).toBe('16.5px');
        });
    });
    (0, vitest_1.describe)('toRem', () => {
        (0, vitest_1.it)('should convert px to rem with default base', () => {
            const result = funcs.toRem('', mockTheme, '', 0, ['16px']);
            (0, vitest_1.expect)(result).toBe('1rem');
        });
        (0, vitest_1.it)('should convert px to rem with custom base', () => {
            const result = funcs.toRem('', mockTheme, '', 0, ['32px', '16']);
            (0, vitest_1.expect)(result).toBe('2rem');
        });
        (0, vitest_1.it)('should rebase rem values', () => {
            const result = funcs.toRem('', mockTheme, '', 0, ['1rem', '20']);
            // 1rem @ 16px base = 16px -> convert to 20px base
            (0, vitest_1.expect)(result).toContain('rem');
        });
        (0, vitest_1.it)('should return null for null input', () => {
            const result = funcs.toRem('', mockTheme, '', 0, [null]);
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return null for zero base', () => {
            const result = funcs.toRem('', mockTheme, '', 0, ['16px', '0']);
            (0, vitest_1.expect)(result).toBeNull();
        });
    });
    (0, vitest_1.describe)('opacify', () => {
        (0, vitest_1.it)('should add opacity to hex color', () => {
            const result = funcs.opacify('', mockTheme, '', 0, ['#ff0000', '0.5']);
            (0, vitest_1.expect)(result).toContain('#ff0000');
            (0, vitest_1.expect)(result).toContain('80'); // 128 in hex (0.5 * 255)
        });
        (0, vitest_1.it)('should add opacity to rgb color', () => {
            const result = funcs.opacify('', mockTheme, '', 0, ['rgb(255, 0, 0)', '0.5']);
            (0, vitest_1.expect)(result).toBe('rgba(255, 0, 0, 0.5)');
        });
        (0, vitest_1.it)('should handle shorthand hex', () => {
            const result = funcs.opacify('', mockTheme, '', 0, ['#f00', '0.75']);
            (0, vitest_1.expect)(result).toContain('#f00');
        });
        (0, vitest_1.it)('should clamp opacity to 0-1 range', () => {
            const result1 = funcs.opacify('', mockTheme, '', 0, ['#ff0000', '2']);
            const result2 = funcs.opacify('', mockTheme, '', 0, ['#ff0000', '-1']);
            (0, vitest_1.expect)(result1).toContain('ff'); // Max opacity
            (0, vitest_1.expect)(result2).toContain('00'); // Min opacity
        });
        (0, vitest_1.it)('should return null for null input', () => {
            const result = funcs.opacify('', mockTheme, '', 0, [null, '0.5']);
            (0, vitest_1.expect)(result).toBeNull();
        });
    });
    (0, vitest_1.describe)('tint', () => {
        (0, vitest_1.it)('should tint a color', () => {
            const result = funcs.tint('', mockTheme, '', 0, ['#000000', '#ffffff', '0.5']);
            (0, vitest_1.expect)(result).toContain('rgba');
            (0, vitest_1.expect)(result).toContain('128'); // 50% between 0 and 255
        });
        (0, vitest_1.it)('should handle percentage amounts', () => {
            const result = funcs.tint('', mockTheme, '', 0, ['#000000', '#ffffff', '50%']);
            (0, vitest_1.expect)(result).toContain('rgba');
            (0, vitest_1.expect)(result).toContain('128');
        });
        (0, vitest_1.it)('should default to 50% if no amount specified', () => {
            const result = funcs.tint('', mockTheme, '', 0, ['#000000', '#ffffff']);
            (0, vitest_1.expect)(result).toContain('rgba');
        });
        (0, vitest_1.it)('should clamp amount to 0-1 range', () => {
            const result1 = funcs.tint('', mockTheme, '', 0, ['#000000', '#ffffff', '2']);
            const result2 = funcs.tint('', mockTheme, '', 0, ['#000000', '#ffffff', '-1']);
            (0, vitest_1.expect)(result1).toBeTruthy();
            (0, vitest_1.expect)(result2).toBeTruthy();
        });
        (0, vitest_1.it)('should preserve base alpha', () => {
            const result = funcs.tint('', mockTheme, '', 0, ['rgba(0, 0, 0, 0.5)', '#ffffff', '0.5']);
            (0, vitest_1.expect)(result).toContain('0.5'); // Alpha preserved
        });
        (0, vitest_1.it)('should return null for missing arguments', () => {
            const result1 = funcs.tint('', mockTheme, '', 0, [null, '#ffffff', '0.5']);
            const result2 = funcs.tint('', mockTheme, '', 0, ['#000000', null, '0.5']);
            (0, vitest_1.expect)(result1).toBeNull();
            (0, vitest_1.expect)(result2).toBeNull();
        });
    });
    (0, vitest_1.describe)('invert', () => {
        (0, vitest_1.it)('should invert black to white', () => {
            const result = funcs.invert('', mockTheme, '', 0, ['#000000']);
            (0, vitest_1.expect)(result).toBe('rgba(255, 255, 255, 1)');
        });
        (0, vitest_1.it)('should invert white to black', () => {
            const result = funcs.invert('', mockTheme, '', 0, ['#ffffff']);
            (0, vitest_1.expect)(result).toBe('rgba(0, 0, 0, 1)');
        });
        (0, vitest_1.it)('should invert red to cyan', () => {
            const result = funcs.invert('', mockTheme, '', 0, ['#ff0000']);
            (0, vitest_1.expect)(result).toBe('rgba(0, 255, 255, 1)');
        });
        (0, vitest_1.it)('should preserve alpha channel', () => {
            const result = funcs.invert('', mockTheme, '', 0, ['rgba(255, 0, 0, 0.5)']);
            (0, vitest_1.expect)(result).toContain('0.5'); // Preserved alpha
            (0, vitest_1.expect)(result).toContain('0, 255, 255'); // Inverted RGB
        });
        (0, vitest_1.it)('should handle rgb colors', () => {
            const result = funcs.invert('', mockTheme, '', 0, ['rgb(100, 150, 200)']);
            (0, vitest_1.expect)(result).toContain('155'); // 255 - 100
            (0, vitest_1.expect)(result).toContain('105'); // 255 - 150
            (0, vitest_1.expect)(result).toContain('55'); // 255 - 200
        });
        (0, vitest_1.it)('should return null for null input', () => {
            const result = funcs.invert('', mockTheme, '', 0, [null]);
            (0, vitest_1.expect)(result).toBeNull();
        });
    });
    (0, vitest_1.describe)('printf', () => {
        (0, vitest_1.it)('should replace placeholders with arguments', () => {
            const result = funcs.printf('', mockTheme, '', 0, ['%1 %2 %3', 'Hello', 'World', '!']);
            (0, vitest_1.expect)(result).toBe('Hello World !');
        });
        (0, vitest_1.it)('should handle single placeholder', () => {
            const result = funcs.printf('', mockTheme, '', 0, ['Value: %1', '42']);
            (0, vitest_1.expect)(result).toBe('Value: 42');
        });
        (0, vitest_1.it)('should handle multiple same placeholders', () => {
            const result = funcs.printf('', mockTheme, '', 0, ['%1 and %1', 'test']);
            (0, vitest_1.expect)(result).toBe('test and test');
        });
        (0, vitest_1.it)('should handle non-sequential placeholders', () => {
            const result = funcs.printf('', mockTheme, '', 0, ['%2 %1', 'second', 'first']);
            (0, vitest_1.expect)(result).toBe('first second');
        });
        (0, vitest_1.it)('should preserve text without placeholders', () => {
            const result = funcs.printf('', mockTheme, '', 0, ['Hello World']);
            (0, vitest_1.expect)(result).toBe('Hello World');
        });
        (0, vitest_1.it)('should handle CSS-like format strings', () => {
            const result = funcs.printf('', mockTheme, '', 0, ['%1px solid %2', '2', '#000']);
            (0, vitest_1.expect)(result).toBe('2px solid #000');
        });
        (0, vitest_1.it)('should return null for null input', () => {
            const result = funcs.printf('', mockTheme, '', 0, [null]);
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should handle missing arguments gracefully', () => {
            const result = funcs.printf('', mockTheme, '', 0, ['%1 %2', 'first']);
            (0, vitest_1.expect)(result).toContain('first');
        });
    });
});
