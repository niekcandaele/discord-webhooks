const RichEmbed = require("discord.js").RichEmbed
const config = require('../config.json');
const _ = require('lodash');

module.exports = {
    "jira": {
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

            let embed = new RichEmbed({
                title: `Board config changed "${payload.configuration.name}"`,
            });


            embed.addField('Type', payload.configuration.type, true)
                .addField(`${payload.configuration.columnConfig.columns.length} columns`, payload.configuration.columnConfig.columns.map(x => x.name).join(", "))

            return embed
        },
        "board_created": (payload) => {
            if (_.isUndefined(payload)) {
                throw new Error("Invalid usage, payload cannot be undefined")
            }

            let embed = new RichEmbed({
                title: `Board created "${payload.board.name}"`,
            });

            embed.addField('Type', payload.board.type, true)

            return embed
        },
        "comment_created": (payload) => {
            if (_.isUndefined(payload)) {
                throw new Error("Invalid usage, payload cannot be undefined")
            }

            let embed = new RichEmbed({
                title: `New comment by ${payload.comment.author.name}`,
            });

            embed.addField('Content', payload.comment.body, true)

            return embed
        },
    },
    "confluence": {

    },
    "bitbucket": {

    }
}