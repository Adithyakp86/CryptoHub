import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { useTheme } from '../useTheme';
import AuthContext from '../AuthContext';
import ThemeContext from '../ThemeContext';
import { createContext, ReactNode } from 'react';

// Mock the contexts
vi.mock('../AuthContext', () => ({
  default: createContext(null)
}));

vi.mock('../ThemeContext', () => ({
  default: createContext(null)
}));

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error when used outside AuthProvider', () => {
    // When AuthContext is null (not wrapped), useAuth should throw
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });

  it('should return auth context when used within provider', () => {
    const mockAuthValue = {
      currentUser: { email: 'test@example.com', uid: '123' },
      logout: vi.fn(),
      isEmailProvider: vi.fn(() => true)
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockAuthValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toEqual(mockAuthValue);
    expect(result.current.currentUser.email).toBe('test@example.com');
  });

  it('should provide access to logout function', () => {
    const logoutFn = vi.fn();
    const mockAuthValue = {
      currentUser: null,
      logout: logoutFn,
      isEmailProvider: vi.fn(() => false)
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockAuthValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(typeof result.current.logout).toBe('function');
  });

  it('should provide email provider check', () => {
    const mockAuthValue = {
      currentUser: { email: 'test@example.com' },
      logout: vi.fn(),
      isEmailProvider: vi.fn(() => true)
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockAuthValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isEmailProvider()).toBe(true);
  });

  it('should handle undefined currentUser', () => {
    const mockAuthValue = {
      currentUser: undefined,
      logout: vi.fn(),
      isEmailProvider: vi.fn(() => false)
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockAuthValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.currentUser).toBeUndefined();
  });

  it('should handle null currentUser (logged out state)', () => {
    const mockAuthValue = {
      currentUser: null,
      logout: vi.fn(),
      isEmailProvider: vi.fn(() => false)
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockAuthValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.currentUser).toBeNull();
  });
});

describe('useTheme hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error when used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  it('should return theme context when used within provider', () => {
    const mockThemeValue = {
      isDark: true,
      toggleTheme: vi.fn()
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeContext.Provider value={mockThemeValue}>
        {children}
      </ThemeContext.Provider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current).toEqual(mockThemeValue);
    expect(result.current.isDark).toBe(true);
  });

  it('should provide theme toggle function', () => {
    const toggleFn = vi.fn();
    const mockThemeValue = {
      isDark: true,
      toggleTheme: toggleFn
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeContext.Provider value={mockThemeValue}>
        {children}
      </ThemeContext.Provider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(typeof result.current.toggleTheme).toBe('function');
    result.current.toggleTheme();
    expect(toggleFn).toHaveBeenCalled();
  });

  it('should handle light theme mode', () => {
    const mockThemeValue = {
      isDark: false,
      toggleTheme: vi.fn()
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeContext.Provider value={mockThemeValue}>
        {children}
      </ThemeContext.Provider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.isDark).toBe(false);
  });

  it('should handle dark theme mode', () => {
    const mockThemeValue = {
      isDark: true,
      toggleTheme: vi.fn()
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeContext.Provider value={mockThemeValue}>
        {children}
      </ThemeContext.Provider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.isDark).toBe(true);
  });

  it('should support multiple hooks in same component', () => {
    const mockThemeValue = {
      isDark: true,
      toggleTheme: vi.fn()
    };

    const mockAuthValue = {
      currentUser: { email: 'test@example.com' },
      logout: vi.fn(),
      isEmailProvider: vi.fn(() => true)
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockAuthValue}>
        <ThemeContext.Provider value={mockThemeValue}>
          {children}
        </ThemeContext.Provider>
      </AuthContext.Provider>
    );

    const { result: themeResult } = renderHook(() => useTheme(), { wrapper });
    const { result: authResult } = renderHook(() => useAuth(), { wrapper });

    expect(themeResult.current.isDark).toBe(true);
    expect(authResult.current.currentUser.email).toBe('test@example.com');
  });

  it('should maintain theme value consistency', () => {
    let themeValue = { isDark: true, toggleTheme: vi.fn() };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeContext.Provider value={themeValue}>
        {children}
      </ThemeContext.Provider>
    );

    const { result, rerender } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.isDark).toBe(true);

    themeValue = { isDark: false, toggleTheme: vi.fn() };
    rerender();

    expect(result.current.isDark).toBe(false);
  });

  it('should handle rapid toggle calls', () => {
    const toggleFn = vi.fn();
    const mockThemeValue = {
      isDark: true,
      toggleTheme: toggleFn
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeContext.Provider value={mockThemeValue}>
        {children}
      </ThemeContext.Provider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    for (let i = 0; i < 5; i++) {
      result.current.toggleTheme();
    }

    expect(toggleFn).toHaveBeenCalledTimes(5);
  });
});

describe('Hook error messages', () => {
  it('should have clear error message for useAuth', () => {
    let error;
    try {
      renderHook(() => useAuth());
    } catch (e) {
      error = e;
    }

    expect(error?.message).toContain('AuthProvider');
  });

  it('should have clear error message for useTheme', () => {
    let error;
    try {
      renderHook(() => useTheme());
    } catch (e) {
      error = e;
    }

    expect(error?.message).toContain('ThemeProvider');
  });
});
