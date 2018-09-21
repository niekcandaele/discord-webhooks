const fetch = require('node-fetch');
const RequestHandler = require('../src/requestHandler');
let mockData = loadMockData();
const config = require('../config.json');
const assert = require('assert');

require("../src/index");
describe('RequestHandler', function () {
    describe('#handleIncomingPostRequest()', function () {

        beforeEach(function (done) {
            setTimeout(done, 500)
        });

        for (const mockRequestPayload of mockData) {
            it(`should return ok when a successful POST happens for Jira event ${mockRequestPayload.webhookEvent}`, function (done) {

                fetch(`http://localhost:${config.port}`, {
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


function loadMockData() {
    var normalizedPath = require("path").join(__dirname, "mockResponses/jira");
    var result = new Array();

    require("fs").readdirSync(normalizedPath).forEach(function (file) {
        let mockData = require(normalizedPath + "/" + file);
        result.push(mockData);
    });

    return result
}