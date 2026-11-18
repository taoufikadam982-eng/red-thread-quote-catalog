import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useFinderFlow } from '@/hooks/use-finder-flow';

beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });
it('selects immediately and advances exactly once after 250ms despite rapid clicks', () => {
  const { result } = renderHook(() => useFinderFlow(8));
  act(() => { result.current.choose('Travailler'); result.current.choose('Jouer'); });
  expect(result.current.selected).toBe('Travailler');
  expect(result.current.isTransitioning).toBe(true);
  act(() => vi.advanceTimersByTime(249));
  expect(result.current.step).toBe(0);
  act(() => vi.advanceTimersByTime(1));
  expect(result.current.step).toBe(1);
  expect(result.current.answers).toEqual(['Travailler']);
  expect(result.current.isTransitioning).toBe(false);
});
it('allows Previous during a transition and cancels the pending advance', () => {
  const { result } = renderHook(() => useFinderFlow(8));
  act(() => result.current.choose('Travailler'));
  act(() => vi.advanceTimersByTime(250));
  act(() => result.current.choose('Au bureau'));
  act(() => result.current.back());
  act(() => vi.advanceTimersByTime(250));
  expect(result.current.step).toBe(0);
  expect(result.current.selected).toBe('Travailler');
  expect(result.current.answers).toEqual(['Travailler']);
});
it('automatically completes all eight questions and resets the diagnostic', () => {
  const { result } = renderHook(() => useFinderFlow(8));
  for (let index = 0; index < 8; index++) {
    act(() => result.current.choose(`Choix ${index}`));
    act(() => vi.advanceTimersByTime(250));
  }
  expect(result.current.step).toBe(8);
  expect(result.current.answers).toHaveLength(8);
  act(() => result.current.choose('Extra'));
  act(() => vi.advanceTimersByTime(250));
  expect(result.current.answers).toHaveLength(8);
  act(() => result.current.restart());
  expect(result.current.step).toBe(0);
  expect(result.current.answers).toEqual([]);
  expect(result.current.selected).toBe('');
});
it('cancels pending work on unmount', () => {
  const { result, unmount } = renderHook(() => useFinderFlow(8));
  act(() => result.current.choose('Travailler'));
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});