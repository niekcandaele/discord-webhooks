const RichEmbed = require("discord.js").RichEmbed
const config = require('../config.json');
const _ = require('lodash');

module.exports = {
    "jira:issue_created": (payload) => {
        if (_.isUndefined(payload)) {
            throw new Error("Invalid usage, payload cannot be undefined")
        }

        let embed = new RichEmbed({
            title: `New issue "${payload.issue.key} ${payload.issue.fields.summary}"`,
            url: `http://host/browse/${payload.issue.key}`,
        });

        embed.addField('Project', `[${payload.issue.fields.project.name}](http://host/projects/${payload.issue.key}/issues)`, true)
            .addField('Issue type', payload.issue.fields.issuetype.name, true)
            .setColor('GREEN')
            .setThumbnail(payload.user.avatarUrls["48x48"])
            .setDescription(payload.issue.fields.description ? payload.issue.fields.description : "No description.")
            .setAuthor(payload.user.name)

        return embed
    },
    "board_configuration_changed": (payload) => {
        if (_.isUndefined(payload)) {
            throw new Error("Invalid usage, payload cannot be undefined")
        }
    }
}