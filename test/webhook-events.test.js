const fetch = require('node-fetch');
const config = require('../config.json');
const assert = require('chai').assert;
const webhookEvents = require('../src/webhookEvents');
const RichEmbed = require("discord.js").RichEmbed;
const app = require("../src/index");

for (const type of app.types) {
  describe(`Webhook type: ${type}`, function () {
    let mockData = loadMockData(type)

    describe(`Events - ${mockData.length} pieces of mockdata`, function () {

      for (const mockRequestPayload of mockData) {
        describe(`Should return a RichEmbed - ${mockRequestPayload.webhookEvent}`, function () {

          it('Should return a RichEmbed', function (done) {
            let embed

            try {
              embed = webhookEvents[type][mockRequestPayload.webhookEvent](mockRequestPayload);
              assert.instanceOf(embed, RichEmbed)
              done()
            } catch (error) {
              done(error)
            }
          });



        });
      }


    });
  })
}

function loadMockData(type) {
  var normalizedPath = require("path").join(__dirname, "mockResponses/" + type);
  var result = new Array();

  require("fs").readdirSync(normalizedPath).forEach(function (file) {
      let mockData = require(normalizedPath + "/" + file);
      result.push(mockData);
  });

  return result
}