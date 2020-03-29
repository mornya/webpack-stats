import { Consoleize } from '../Consoleize';

describe('Consoleize module', () => {

  it('Consoleize.from - File not found', () => {
    expect(
      () => Consoleize.from('src/test/NOT_ANY_FILE', '', {})
    ).toThrow('File not found.');
  });

  it('Consoleize.from', () => {
    expect(
      Consoleize.from('src/test/@stats.json', '', {})
    ).not.toBe('');
  });

  it('Consoleize.generate', () => {
    expect(
      Consoleize.generate({} as StatsJson, '', {})
    ).not.toBe('');
  });

});
