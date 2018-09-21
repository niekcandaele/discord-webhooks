const fetch = require('node-fetch');
let mockData = loadMockData();
const config = require('../config.json');
const assert = require('chai').assert;
const jiraEvents = require('../src/jira-events');
const RichEmbed = require("discord.js").RichEmbed;


describe('Jira events', function () {

  for (const mockRequestPayload of mockData) {
    describe(`Should return a RichEmbed - ${mockRequestPayload.webhookEvent}`, function () {

      it('Should return a RichEmbed', function (done) {
        let embed

        try {
          embed = jiraEvents[mockRequestPayload.webhookEvent](mockRequestPayload);
          assert.instanceOf(embed, RichEmbed)
          done()
        } catch (error) {
          done(error)
        }
      });



    });
  }


});

function loadMockData() {
  var normalizedPath = require("path").join(__dirname, "mockResponses/jira");
  var result = new Array();

  require("fs").readdirSync(normalizedPath).forEach(function (file) {
    let mockData = require(normalizedPath + "/" + file);
    result.push(mockData);
  });

  return result
}