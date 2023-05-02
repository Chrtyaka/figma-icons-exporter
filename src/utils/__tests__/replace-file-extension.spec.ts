import { describe, it, expect } from '@jest/globals';
import { replaceFileExtension } from '../replace-file-extension';

describe('replace-file-extension.ts', () => {
  it('should generate new filepath', () => {
    const result = replaceFileExtension('./some-file.txt', '.md');

    expect(result).toEqual('some-file.md');
  });
});
