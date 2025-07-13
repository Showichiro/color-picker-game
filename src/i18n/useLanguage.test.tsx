import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useLanguage } from './useLanguage';

const mockChangeLanguage = vi.fn(() => Promise.resolve());

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

describe('useLanguage', () => {
  it('should return current language', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.currentLanguage).toBe('en');
  });

  it('should provide available languages', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.languages).toEqual(['en', 'ja']);
  });

  it('should change language', async () => {
    const { result } = renderHook(() => useLanguage());
    
    await act(async () => {
      await result.current.changeLanguage('ja');
    });

    expect(mockChangeLanguage).toHaveBeenCalledWith('ja');
  });
});