const http = require("http");
const jiraEvents = require('./jira-events');
const config = require('../config.json');
const _ = require('lodash');

class RequestHandler {
    constructor(webhooks) {
        this.server = http.createServer((req, res) => {
            this.handleIncomingPostRequest(req, res);
        }).listen(config.port);
        this.webhooks = webhooks;
        this.allowedDomains = webhooks.map(webhook => webhook.webhook.host)
        // Print URL for accessing server
        console.log(`Server running at http://127.0.0.1:${config.port}/`);
    }

    async handleIncomingPostRequest(request, response) {
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {

            let payload = Buffer.concat(body).toString();

            try {
                payload = JSON.parse(payload)
            } catch (error) {
                console.log(`Malformed payload data - could not transform to json`);
                console.log(error)
            }

            let foundWebhook = this.findWebhook(request);

            if (!this.checkIfKnownDomains(request)) {
                response.writeHead(403, `You must register this host in your webhook config: ${request.headers.host}`);
                return response.end();
            }

            if (!foundWebhook) {
                response.writeHead(400, "Unknown web hook");
                console.log(`Received a request for unknown webhook (please check your config).`);
                return response.end();
            }

            let foundEvent = this.findEvent(payload, foundWebhook);

            if (_.isUndefined(foundEvent)) {
                response.writeHead(404);
                this.handleUnknownEvent(payload);
            } else {
                response.writeHead(200);
                let generatedEmbed = foundEvent(payload, foundWebhook);
                this.sendToDiscord(generatedEmbed, foundWebhook);
            }

            response.end();
        });


        request.on('error', (err) => {
            console.log("Alert: unhandled webserver error!");
            console.log(err)
        });



    }

    findWebhook(request) {
        return _.find(this.webhooks, webhook => {
            return webhook.webhook.host.startsWith(request.headers.host)
        })
    }

    checkIfKnownDomains(request) {

        return !_.isUndefined(_.find(this.allowedDomains, allowedDomain => request.headers.host === allowedDomain))

    }

    findEvent(payload, foundWebhook) {

        if (foundWebhook.webhook.type === "jira") {
            return jiraEvents[payload.webhookEvent]
        }

        return false

    }

    handleUnknownEvent(payload) {

        if (config.saveUnknownResponses) {

            const fs = require('fs');
            let dataToSave = JSON.stringify(payload);
            fs.writeFile(`./data/${payload.webhookEvent}`, dataToSave, {
                flag: 'wx'
            }, function (err) {
                if (!err) console.log(`Saved a new event type to disk: ${payload.webhookEvent}`);
            });

        }

    }

    async sendToDiscord(embed, webhook) {
        try {
            console.log(`Sending to discord ${JSON.stringify(embed)}`);
            webhook.client.send(embed);
        } catch (error) {
            console.log(error)
        }

    }
}

module.exports = RequestHandler
