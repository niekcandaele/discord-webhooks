const http = require("http");
const webhookEvents = require('../src/webhookEvents');
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
        for (const webhookConfig of webhooks) {
            console.log(`Listening for "${webhookConfig.webhook.type}" events on ${webhookConfig.webhook.url}`)
        }
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

            if (!foundWebhook) {
                response.writeHead(400, "Unknown web hook");
                console.log(`Received a request for unknown webhook (please check your config).`);
                return response.end();
            }

            let foundEvent = this.findEvent(payload, foundWebhook);

            if (_.isUndefined(foundEvent)) {
                response.writeHead(404);
                this.handleUnknownEvent(payload, foundWebhook);
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

        return _.find(this.webhooks, (webook => {
            return _.startsWith(request.url, webook.webhook.url)
        }))
    }

    findEvent(payload, foundWebhook) {
        return webhookEvents[foundWebhook.webhook.type][payload.webhookEvent]
    }

    handleUnknownEvent(payload, webhookConfig) {

        if (config.saveUnknownResponses) {

            const fs = require('fs');
            let dataToSave = JSON.stringify(payload);
            fs.writeFile(`./data/${webhookConfig.webhook.type}-${payload.webhookEvent}.json`, dataToSave, {
                flag: 'wx'
            }, function (err) {
                if (!err) console.log(`Saved a new event type to disk: ${payload.webhookEvent}`);
            });

        }

    }

    async sendToDiscord(embed, webhook) {
        try {
            webhook.client.send(embed);
        } catch (error) {
            console.log(error)
        }

    }
}

module.exports = RequestHandler