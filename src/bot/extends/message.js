const { APIMessage, Structures } = require("discord.js");

String.prototype.toTitleCase = function() {
    return this.split(' ').map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1).toLowerCase()}`).join(' ');
};

Structures.extend('Message', (Message) => {
    return class extends Message {
        async inlineReply(content, options) {
            
            const apiMessage = content instanceof APIMessage ? content.resolveData() : APIMessage.create(this.channel, content, options).resolveData();

            if (!apiMessage.data.allowed_mentions || !Object.keys(apiMessage.data.allowed_mentions).length)
                apiMessage.data.allowed_mentions = {
                    parse: ['users', 'roles', 'everyone']
                }

            if (!apiMessage.data.allowed_mentions.replied_user)
                Object.assign(apiMessage.data.allowed_mentions, {
                    replied_user: (options || content).allowedMentions?.repliedUser
                });

            if (Array.isArray(apiMessage.data.content)) {
                return Promise.all(apiMessage.split().map(x => {
                    x.data.allowed_mentions = apiMessage.data.allowed_mentions;
                    return x;
                }).map(this.inlineReply.bind(this)));
            }

            const { data, files } = await apiMessage.resolveFiles();
            const msg = await this.channel.messages.fetch(this.id).catch(() => {});
            if (msg) Object.assign(apiMessage.data, {
                message_reference: {
                    message_id: this.id
                }
            });
            return this.client.api.channels[this.channel.id].messages.post({ data, files })
            .then(d => this.client.actions.MessageCreate.handle(d).message).catch(console.error);
        }
    }
});