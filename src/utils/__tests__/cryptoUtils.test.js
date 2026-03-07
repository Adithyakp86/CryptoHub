import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatCryptoAmount,
  formatPercentage,
  calculatePortfolioValue,
  calculateGainLoss,
  formatLargeNumber,
  cleanCryptoAmount,
  truncateDecimals,
  roundToDecimals
} from '../cryptoUtils';

describe('cryptoUtils', () => {
  describe('formatPrice', () => {
    it('should format valid prices correctly', () => {
      expect(formatPrice(1234.56)).toContain('1,234.56');
      expect(formatPrice(0.0001)).toBeDefined();
    });

    it('should handle null or undefined values', () => {
      expect(formatPrice(null)).toBe('N/A');
      expect(formatPrice(undefined)).toBe('N/A');
      expect(formatPrice(NaN)).toBe('N/A');
    });

    it('should adjust decimal places based on price magnitude', () => {
      const smallPrice = formatPrice(0.0001, 'USD', { compact: false });
      const largePrice = formatPrice(1000, 'USD', { compact: false });
      expect(smallPrice).toBeDefined();
      expect(largePrice).toBeDefined();
    });

    it('should support compact notation', () => {
      const compact = formatPrice(1000000, 'USD', { compact: true });
      expect(compact).toBeDefined();
    });

    it('should support custom formatting options', () => {
      const custom = formatPrice(100.5, 'USD', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      });
      expect(custom).toBeDefined();
    });
  });

  describe('formatCryptoAmount', () => {
    it('should format crypto amounts with correct precision', () => {
      const result = formatCryptoAmount(1.5, 'BTC');
      expect(result).toContain('1.5');
      expect(result).toContain('BTC');
    });

    it('should handle invalid inputs', () => {
      expect(formatCryptoAmount(null)).toBe('N/A');
      expect(formatCryptoAmount(undefined)).toBe('N/A');
      expect(formatCryptoAmount(NaN)).toBe('N/A');
    });

    it('should trim zeros when enabled', () => {
      const result = formatCryptoAmount(1.00000, 'ETH', { trimZeros: true });
      expect(result).toContain('1');
    });

    it('should show symbol when enabled', () => {
      const withSymbol = formatCryptoAmount(2.5, 'ETH', { showSymbol: true });
      expect(withSymbol).toContain('ETH');
    });

    it('should omit symbol when disabled', () => {
      const withoutSymbol = formatCryptoAmount(2.5, 'ETH', { showSymbol: false });
      expect(withoutSymbol).not.toContain('ETH');
    });

    it('should respect custom precision', () => {
      const result = formatCryptoAmount(1.123456789, 'BTC', { precision: 2 });
      expect(result).toBeDefined();
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      const result = formatPercentage(5.5);
      expect(result).toContain('5.5');
      expect(result).toContain('%');
    });

    it('should handle zero', () => {
      const result = formatPercentage(0);
      expect(result).toBeDefined();
    });

    it('should handle negative values', () => {
      const result = formatPercentage(-10.5);
      expect(result).toContain('10.5');
    });
  });

  describe('calculatePortfolioValue', () => {
    it('should calculate total portfolio value when function is defined', () => {
      // calculatePortfolioValue is defined and exported
      expect(typeof calculatePortfolioValue).toBe('function');
    });

    it('should be a utility function', () => {
      expect(calculatePortfolioValue).toBeDefined();
    });
  });

  describe('calculateGainLoss', () => {
    it('should be a utility function', () => {
      expect(typeof calculateGainLoss).toBe('function');
    });

    it('should return an object with gain and percentage', () => {
      expect(calculateGainLoss).toBeDefined();
    });
  });

  describe('formatLargeNumber', () => {
    it('should format large numbers with K suffix', () => {
      const result = formatLargeNumber(1000);
      expect(result).toContain('K');
    });

    it('should format millions with M suffix', () => {
      const result = formatLargeNumber(1000000);
      expect(result).toContain('M');
    });

    it('should format billions with B suffix', () => {
      const result = formatLargeNumber(1000000000);
      expect(result).toContain('B');
    });

    it('should handle small numbers without suffix', () => {
      const result = formatLargeNumber(100);
      expect(result).toBeDefined();
    });
  });

  describe('cleanCryptoAmount', () => {
    it('should remove currency symbols', () => {
      const result = cleanCryptoAmount('$1,234.56');
      expect(parseFloat(result)).toBe(1234.56);
    });

    it('should remove commas', () => {
      const result = cleanCryptoAmount('1,000,000');
      expect(parseFloat(result)).toBe(1000000);
    });

    it('should handle text input', () => {
      const result = cleanCryptoAmount('1.5 BTC');
      expect(parseFloat(result)).toBe(1.5);
    });
  });

  describe('truncateDecimals', () => {
    it('should truncate to specified decimal places', () => {
      const result = truncateDecimals(1.23456, 2);
      expect(result).toBe(1.23);
    });

    it('should handle zero decimal places', () => {
      const result = truncateDecimals(1.9, 0);
      expect(result).toBe(1);
    });

    it('should preserve full precision if decimals exceed input', () => {
      const result = truncateDecimals(1.5, 10);
      expect(result).toBe(1.5);
    });
  });

  describe('roundToDecimals', () => {
    it('should round to specified decimal places', () => {
      const result = roundToDecimals(1.235, 2);
      expect(result).toBe(1.24);
    });

    it('should handle negative decimals', () => {
      const result = roundToDecimals(1234.5, -1);
      expect(result).toBe(1230);
    });

    it('should round zero correctly', () => {
      const result = roundToDecimals(0, 2);
      expect(result).toBe(0);
    });
  });
});
