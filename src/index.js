'use strict';
const Discord = require("discord.js")
const config = require('../config.json');


// Initialize the configured webhooks
const webhooks = initWebhooks(config)
console.log(`Initialized ${webhooks.length} webhooks. ${webhooks.map(hook => hook.webhook.type).join(' ')}`);

const RequestHandler = require('./requestHandler');
let requestHandler = new RequestHandler(webhooks);


function initWebhooks(config) {
    let result = new Array();
    for (const webhook of config.webhooks) {
        let client
        try {
            client = new Discord.WebhookClient(webhook.discordWebhookId, webhook.discordWebhookToken);
        } catch (error) {
            console.log(error)
        }
        result.push({
            client: client,
            webhook: webhook
        })
    }
    return result
}

module.exports = {
    requestHandler: requestHandler,
    webhooks: webhooks,
    _initWebhooks: initWebhooks,
    types: ["jira", "confluence", 'bitbucket']
}