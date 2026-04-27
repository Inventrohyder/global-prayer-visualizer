import { describe, expect, it } from 'vitest';
import App from '../app/App';

describe('build smoke', () => {
  it('app module loads', () => {
    expect(App).toBeTruthy();
  });
});
