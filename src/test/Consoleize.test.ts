import { Consoleize } from '../Consoleize';

describe('Consoleize module', () => {

  it('Consoleize.from - File not found', () => {
    expect(
      () => Consoleize.from('src/test/NOT_ANY_FILE', '', {})
    ).toThrow('File not found.');
  });

  it('Consoleize.from - Reads empty data from @stats-empty.json file', () => {
    expect(
      Consoleize.from('src/test/@stats-empty.json', '', {})
    ).toEqual('');
  });

  it('Consoleize.from - Reads test data from @stats-test.json file', () => {
    expect(
      Consoleize.from('src/test/@stats-test.json', '', {})
    ).not.toEqual('');
  });

  it('Consoleize.generate', () => {
    expect(
      Consoleize.generate({} as StatsJson, '', {})
    ).toEqual('');
  });

});
