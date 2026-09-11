import { describe, test, expect } from '@jest/globals';
import { ResultVerifier } from '../../apps/api/src/modules/results/resultVerifier';

describe('ResultVerifier Unit Tests', () => {
  test('Correctly evaluates OVER 2.5 outcomes', () => {
    expect(ResultVerifier.evaluateMarket('OVER_2_5', 2, 1)).toBe(true);  // 3 goals -> WIN
    expect(ResultVerifier.evaluateMarket('OVER_2_5', 2, 2)).toBe(true);  // 4 goals -> WIN
    expect(ResultVerifier.evaluateMarket('OVER_2_5', 1, 1)).toBe(false); // 2 goals -> LOSS
    expect(ResultVerifier.evaluateMarket('OVER_2_5', 0, 0)).toBe(false); // 0 goals -> LOSS
  });

  test('Correctly evaluates BTTS YES outcomes', () => {
    expect(ResultVerifier.evaluateMarket('BTTS_YES', 1, 1)).toBe(true);  // Both scored -> WIN
    expect(ResultVerifier.evaluateMarket('BTTS_YES', 2, 1)).toBe(true);  // Both scored -> WIN
    expect(ResultVerifier.evaluateMarket('BTTS_YES', 2, 0)).toBe(false); // Away 0 -> LOSS
    expect(ResultVerifier.evaluateMarket('BTTS_YES', 0, 3)).toBe(false); // Home 0 -> LOSS
  });
});

