import { describe, expect, it } from 'vitest';
import type { AppState } from '../app/state';

describe('live/manual state logic', () => {
  it('manual adjustment disables live mode shape', () => {
    const state: AppState = {
      viewMode: 'globe',
      calcMode: 'auto-jurisdiction',
      globalMethodId: 'mwl',
      selectedInstant: new Date(),
      liveMode: true,
      selectedLocation: null,
    };
    const next = { ...state, selectedInstant: new Date(state.selectedInstant.getTime() - 60000), liveMode: false };
    expect(next.liveMode).toBe(false);
  });
});
