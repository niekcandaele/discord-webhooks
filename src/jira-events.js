const RichEmbed = require("discord.js").RichEmbed
const config = require('../config.json');
const _ = require('lodash');

module.exports = {
    "jira:issue_created": (jiraPayload, webhook) => {
        console.log('Parsing issue_created payload for webhook ' + JSON.stringify(webhook.webhook));

        if (_.isUndefined(jiraPayload)) {
            throw new Error("Invalid usage, jiraPayLoad cannot be undefined")
        }


        let embed = new RichEmbed({
            title: `New issue "${jiraPayload.issue.key} ${jiraPayload.issue.fields.summary}"`,
            url: `http://${webhook.webhook.host}/browse/${jiraPayload.issue.key}`,
        });

        embed.addField('Project', `[${jiraPayload.issue.fields.project.name}](http://${webhook.webhook.host}/projects/${jiraPayload.issue.key}/issues)`, true)
        .addField('Issue type', jiraPayload.issue.fields.issuetype.name, true)
        .setColor('GREEN')
        .setThumbnail(jiraPayload.user.avatarUrls["48x48"])
        .setDescription(jiraPayload.issue.fields.description ? jiraPayload.issue.fields.description : "No description.")
        .setAuthor(jiraPayload.user.name)

        return embed
    }
}