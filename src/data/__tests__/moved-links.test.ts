import { describe, expect, it } from 'vitest';
import { currentLink } from '../moved-links';

describe('currentLink', () => {
  it('rewrites a moved project, with or without a trailing slash', () => {
    expect(currentLink('https://ephemeral-chi.vercel.app/')).toBe('https://ephemeral.iamdelrio.com');
    expect(currentLink('https://fainancial.app')).toBe('https://fainancial.iamdelrio.com');
  });

  it('drops the link of an offline project', () => {
    expect(currentLink('https://thumbly-seven.vercel.app/')).toBeNull();
  });

  it('leaves every other link alone', () => {
    expect(currentLink('https://motorsportive.com')).toBe('https://motorsportive.com');
    expect(currentLink(undefined)).toBeUndefined();
  });
});
