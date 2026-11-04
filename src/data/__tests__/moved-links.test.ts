import { describe, expect, it } from 'vitest';
import { currentLink } from '../moved-links';

describe('currentLink', () => {
  it('drops the link of an offline project, with or without a trailing slash', () => {
    expect(currentLink('https://thumbly-seven.vercel.app/')).toBeNull();
    expect(currentLink('https://thumbly-seven.vercel.app')).toBeNull();
  });

  it('leaves every other link alone', () => {
    expect(currentLink('https://motorsportive.com')).toBe('https://motorsportive.com');
    expect(currentLink(undefined)).toBeUndefined();
  });
});
