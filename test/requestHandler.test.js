const fetch = require('node-fetch');
const RequestHandler = require('../src/requestHandler');
const config = require('../config.json');
const assert = require('assert');

const app = require("../src/index");

describe('RequestHandler', function () {

    this.afterAll(function(done) {
        app.requestHandler.server.close(done)
    })

    for (const type of app.types) {
        let mockData = loadMockData(type)
        describe(`Webhook type: ${type}`, function () {

            describe('#handleIncomingPostRequest()', function () {

                beforeEach(function (done) {
                    setTimeout(done, 500)
                });

                for (const mockRequestPayload of mockData) {
                    it(`should return ok when a successful POST happens for Jira event ${mockRequestPayload.webhookEvent}`, function (done) {

                        fetch(`http://localhost:${config.port}/${type}`, {
                                method: 'POST',
                                body: JSON.stringify(mockRequestPayload)
                            })
                            .then(res => {

                                try {
                                    assert.strictEqual(res.status, 200);
                                    done();
                                } catch (error) {
                                    done(error)
                                }

                            });

                    });
                }
            });

        })
    }
})


function loadMockData(type) {
    var normalizedPath = require("path").join(__dirname, "mockResponses/" + type);
    var result = new Array();

    require("fs").readdirSync(normalizedPath).forEach(function (file) {
        let mockData = require(normalizedPath + "/" + file);
        result.push(mockData);
    });

    return result
}