const expect = require('chai').expect;

const asyncStarterService = require('../../lib/asyncStarterService');

describe('asyncStarterService', function () {
  it('stripsWhitespaces', async () => {
    let message = "Remove all whitespaces";

    let result = await asyncStarterService.stripWhitespaces(message);

    expect(result).to.eq("Removeallwhitespaces");
  });

  it('doesntStripWhitespacesWhenAbsent', async () => {
    let message = "Removeallwhitespaces";

    let result = await asyncStarterService.stripWhitespaces(message);

    expect(result).to.eq("Removeallwhitespaces");
  });
});