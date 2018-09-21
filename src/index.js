'use strict';
const Discord = require("discord.js")

const config = require('../config.json');


// Initialize the configured webhooks
const webhooks = new Array();

for (const webhook of config.webhooks) {
    let client
    try {
        client = new Discord.WebhookClient(webhook.discordWebhookId, webhook.discordWebhookToken);
    } catch (error) {
        console.log(error)
    }
    webhooks.push(
        {
            client: client,
            webhook: webhook
        }
    );
}
console.log(`Initialized ${webhooks.length} webhooks. ${webhooks.map(hook => hook.webhook.type).join(' ')}`);

const RequestHandler = require('./requestHandler');
let requestHandler = new RequestHandler(webhooks);

