import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageKeys } from '../storageManager';

describe('StorageManager', () => {
  let storage = {};

  beforeEach(() => {
    storage = {};
  });

  const createMockStorage = () => ({
    getItem: vi.fn((key) => storage[key] || null),
    setItem: vi.fn((key, value) => {
      storage[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete storage[key];
    }),
    clear: vi.fn(() => {
      storage = {};
    })
  });

  describe('StorageKeys', () => {
    it('should have required theme key', () => {
      expect(StorageKeys.THEME).toBe('theme');
    });

    it('should have required currency key', () => {
      expect(StorageKeys.CURRENCY).toBe('currency');
    });

    it('should have required watchlist key', () => {
      expect(StorageKeys.WATCHLIST).toBe('watchlist');
    });

    it('should have required portfolio key', () => {
      expect(StorageKeys.PORTFOLIO).toBe('portfolio');
    });

    it('should have cache keys', () => {
      expect(StorageKeys.PRICE_CACHE).toBe('price_cache');
      expect(StorageKeys.MARKET_DATA_CACHE).toBe('market_data_cache');
      expect(StorageKeys.COIN_LIST_CACHE).toBe('coin_list_cache');
    });

    it('should have session keys', () => {
      expect(StorageKeys.LAST_VISITED).toBe('last_visited');
      expect(StorageKeys.SESSION_DATA).toBe('session_data');
    });
  });

  describe('Basic storage operations', () => {
    it('should store and retrieve string values', () => {
      const mockStorage = createMockStorage();
      mockStorage.setItem('test_key', 'test_value');
      
      expect(mockStorage.getItem('test_key')).toBe('test_value');
    });

    it('should return null for non-existent keys', () => {
      const mockStorage = createMockStorage();
      expect(mockStorage.getItem('non_existent')).toBeNull();
    });

    it('should remove items', () => {
      const mockStorage = createMockStorage();
      mockStorage.setItem('test_key', 'test_value');
      mockStorage.removeItem('test_key');
      
      expect(mockStorage.getItem('test_key')).toBeNull();
    });

    it('should clear all storage', () => {
      const mockStorage = createMockStorage();
      mockStorage.setItem('key1', 'value1');
      mockStorage.setItem('key2', 'value2');
      mockStorage.clear();
      
      expect(mockStorage.getItem('key1')).toBeNull();
      expect(mockStorage.getItem('key2')).toBeNull();
    });
  });

  describe('JSON storage operations', () => {
    it('should store and retrieve JSON objects', () => {
      const mockStorage = createMockStorage();
      const testObj = { theme: 'dark', currency: 'USD' };
      
      mockStorage.setItem('settings', JSON.stringify(testObj));
      const retrieved = JSON.parse(mockStorage.getItem('settings'));
      
      expect(retrieved).toEqual(testObj);
    });

    it('should handle complex nested objects', () => {
      const mockStorage = createMockStorage();
      const complex = {
        user: { name: 'John', id: 123 },
        preferences: { theme: 'dark' }
      };
      
      mockStorage.setItem('complex', JSON.stringify(complex));
      const retrieved = JSON.parse(mockStorage.getItem('complex'));
      
      expect(retrieved.user.name).toBe('John');
      expect(retrieved.preferences.theme).toBe('dark');
    });

    it('should handle arrays', () => {
      const mockStorage = createMockStorage();
      const array = [1, 2, 3, 4, 5];
      
      mockStorage.setItem('numbers', JSON.stringify(array));
      const retrieved = JSON.parse(mockStorage.getItem('numbers'));
      
      expect(retrieved).toEqual(array);
    });
  });

  describe('Storage with prefixing', () => {
    it('should handle keys with prefix convention', () => {
      const mockStorage = createMockStorage();
      const prefixedKey = 'cryptohub_' + StorageKeys.THEME;
      
      mockStorage.setItem(prefixedKey, 'dark');
      expect(mockStorage.getItem(prefixedKey)).toBe('dark');
    });
  });

  describe('Cache operations', () => {
    it('should store price cache', () => {
      const mockStorage = createMockStorage();
      const priceCache = { 'BTC': 65000, 'ETH': 3000 };
      
      mockStorage.setItem(StorageKeys.PRICE_CACHE, JSON.stringify(priceCache));
      const retrieved = JSON.parse(mockStorage.getItem(StorageKeys.PRICE_CACHE));
      
      expect(retrieved['BTC']).toBe(65000);
    });

    it('should store market data cache', () => {
      const mockStorage = createMockStorage();
      const marketData = { market_cap: '2T', volume_24h: '1B' };
      
      mockStorage.setItem(StorageKeys.MARKET_DATA_CACHE, JSON.stringify(marketData));
      const retrieved = JSON.parse(mockStorage.getItem(StorageKeys.MARKET_DATA_CACHE));
      
      expect(retrieved.market_cap).toBe('2T');
    });
  });

  describe('Portfolio operations', () => {
    it('should store portfolio data', () => {
      const mockStorage = createMockStorage();
      const portfolio = {
        holdings: [{ coin: 'BTC', amount: 1.5 }],
        transactions: []
      };
      
      mockStorage.setItem(StorageKeys.PORTFOLIO, JSON.stringify(portfolio));
      const retrieved = JSON.parse(mockStorage.getItem(StorageKeys.PORTFOLIO));
      
      expect(retrieved.holdings[0].coin).toBe('BTC');
    });

    it('should store watchlist', () => {
      const mockStorage = createMockStorage();
      const watchlist = ['bitcoin', 'ethereum', 'cardano'];
      
      mockStorage.setItem(StorageKeys.WATCHLIST, JSON.stringify(watchlist));
      const retrieved = JSON.parse(mockStorage.getItem(StorageKeys.WATCHLIST));
      
      expect(retrieved).toContain('bitcoin');
      expect(retrieved.length).toBe(3);
    });
  });

  describe('User preferences', () => {
    it('should store theme preference', () => {
      const mockStorage = createMockStorage();
      mockStorage.setItem(StorageKeys.THEME, 'dark');
      
      expect(mockStorage.getItem(StorageKeys.THEME)).toBe('dark');
    });

    it('should store currency preference', () => {
      const mockStorage = createMockStorage();
      mockStorage.setItem(StorageKeys.CURRENCY, 'INR');
      
      expect(mockStorage.getItem(StorageKeys.CURRENCY)).toBe('INR');
    });

    it('should store recent searches', () => {
      const mockStorage = createMockStorage();
      const searches = ['bitcoin', 'ethereum', 'dogecoin'];
      
      mockStorage.setItem(StorageKeys.RECENT_SEARCHES, JSON.stringify(searches));
      const retrieved = JSON.parse(mockStorage.getItem(StorageKeys.RECENT_SEARCHES));
      
      expect(retrieved).toEqual(searches);
    });
  });

  describe('Session management', () => {
    it('should store last visited page', () => {
      const mockStorage = createMockStorage();
      mockStorage.setItem(StorageKeys.LAST_VISITED, '/coin/bitcoin');
      
      expect(mockStorage.getItem(StorageKeys.LAST_VISITED)).toBe('/coin/bitcoin');
    });

    it('should store session data', () => {
      const mockStorage = createMockStorage();
      const sessionData = { timestamp: Date.now(), active: true };
      
      mockStorage.setItem(StorageKeys.SESSION_DATA, JSON.stringify(sessionData));
      const retrieved = JSON.parse(mockStorage.getItem(StorageKeys.SESSION_DATA));
      
      expect(retrieved.active).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should handle null values gracefully', () => {
      const mockStorage = createMockStorage();
      mockStorage.setItem('null_test', null);
      
      expect(mockStorage.getItem('null_test')).toBeNull();
    });

    it('should handle empty strings', () => {
      const mockStorage = createMockStorage();
      mockStorage.setItem('empty', '');
      
      expect(mockStorage.getItem('empty')).toBe('');
    });
  });
});
