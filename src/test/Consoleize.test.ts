import { Consoleize } from '../Consoleize';

describe('Consoleize module', () => {

  it('Consoleize.generate', () => {
    expect(Consoleize.generate({} as StatsJson, '', {})).toBeCalled();
  });

});
