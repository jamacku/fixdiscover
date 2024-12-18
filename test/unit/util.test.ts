import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  getOptions,
  isDefaultValuesDisabled,
  raise,
  tokenUnavailable,
} from '../../src/util';

const mocks = vi.hoisted(() => {
  return {
    os: {
      userInfo: vi.fn(),
    },
  };
});

vi.mock('node:os', () => {
  return {
    default: mocks.os,
  };
});

describe('Utility functions', () => {
  beforeEach(async () => {
    mocks.os.userInfo.mockReturnValue({
      username: 'username',
    });
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  test('raise()', () => {
    expect(() => raise('error')).toThrow('error');
  });

  test('tokenUnavailable()', () => {
    expect(() => tokenUnavailable('jira')).toThrowErrorMatchingInlineSnapshot(`
      [Error: JIRA_API_TOKEN not set.
      Please set the JIRA_API_TOKEN environment variable in '~/.config/fixdiscover/.env' or '~/.env.fixdiscover' or '~/.env.']
    `);

    expect(() => tokenUnavailable('github'))
      .toThrowErrorMatchingInlineSnapshot(`
      [Error: GITHUB_API_TOKEN not set.
      Please set the GITHUB_API_TOKEN environment variable in '~/.config/fixdiscover/.env' or '~/.env.fixdiscover' or '~/.env.']
    `);
  });

  test(`isDefaultValuesDisabled()`, () => {
    expect(isDefaultValuesDisabled()).toBe(false);
    vi.stubEnv('NODEFAULTS', 'true');
    expect(isDefaultValuesDisabled()).toBe(true);
  });

  test(`getOptions()`, () => {
    vi.stubEnv('COMPONENT', 'component');

    expect(getOptions({})).toMatchInlineSnapshot(`
      {
        "component": "component",
        "upstream": undefined,
      }
    `);
  });
});
