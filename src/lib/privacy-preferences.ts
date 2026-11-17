import { readChoice, saveChoices, type Choice } from './consent';

// Compatibility receipt only; consent.ts remains the sole authority for tracking.
export function savePrivacyChoice(choice: Choice) {
  saveChoices({ analytics: choice });
  try { localStorage.setItem('sesa_cookie_consent', choice); } catch { /* Consent module handles unavailable storage. */ }
}
export function privacyAnswered() { return readChoice('analytics') !== null; }