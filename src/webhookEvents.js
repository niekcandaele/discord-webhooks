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
                title: `New issue "[${payload.issue.key}] ${payload.issue.fields.summary}"`,
            });

            embed.addField('Project', payload.issue.fields.project.name, true)
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
                .setThumbnail(payload.comment.author.avatarUrls["48x48"])
                .setColor('GREEN')
            return embed
        },
        "jira:issue_updated": (payload) => {
            if (_.isUndefined(payload)) {
                throw new Error("Invalid usage, payload cannot be undefined")
            }

            let embed = new RichEmbed({
                title: `Issue updated "[${payload.issue.key}] ${payload.issue.fields.summary}" by ${payload.user.name}`,
            });

            embed.addField('Project', payload.issue.fields.project.name, true)
                .setDescription(payload.issue.fields.description ? payload.issue.fields.description : "No description.")
                .addField('Status', payload.issue.fields.status.name, true)
                .addField('Type', payload.issue.fields.issuetype.name, true)
                .addField('Priority', payload.issue.fields.priority.name, true)
                .setColor('AQUA')

            return embed
        },
    },
    "confluence": {

    },
    "bitbucket": {

    }
}