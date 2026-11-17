import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readChoice } from '@/lib/consent';
import { savePrivacyChoice } from '@/lib/privacy-preferences';

describe('SESA privacy preferences', () => {
  beforeEach(() => { localStorage.clear(); vi.stubGlobal('gtag', vi.fn()); });
  it('stores acceptance and grants analytics independently of advertising', () => {
    savePrivacyChoice('granted');
    expect(localStorage.getItem('sesa_cookie_consent')).toBe('granted');
    expect(readChoice('analytics')).toBe('granted');
    expect(readChoice('advertising')).toBeNull();
  });
  it('replaces acceptance with refusal', () => {
    savePrivacyChoice('granted'); savePrivacyChoice('denied');
    expect(localStorage.getItem('sesa_cookie_consent')).toBe('denied');
    expect(readChoice('analytics')).toBe('denied');
    expect(vi.mocked((window as unknown as { gtag: ReturnType<typeof vi.fn> }).gtag)).toHaveBeenLastCalledWith('consent', 'update', { analytics_storage: 'denied' });
  });
});