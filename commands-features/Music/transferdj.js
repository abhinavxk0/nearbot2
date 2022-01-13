const db = require('quick.db')

module.exports = {
    name: 'transferdj',
    aliases: ['transfer', 'dj'],
    async execute(client, message, args, Discord) {
        const djUser = await db.fetch(`djuser.${message.guild.id}`)
        const mention = message.mentions.users.first();
        const queue = await client.distube.getQueue(message);

        if (!queue){
            message.lineReply("I'm not playing any music right now.")
            return;
        }
        if (!djUser){
            message.lineReply("Error occured while trying to find the current DJ.")
            return
        }
        if (!message.user.id === djUser){
            message.lineReply("You are not the currrent DJ.")
            return;
        }
        if (!mention){
            message.lineReply("Mention a user to transfer DJ to.");
            return;
        }
        try {
            await db.set(`djuser.${message.guild.id}`, mention.id)
            message.lineReply(`I set the DJ to **${mention.tag}**.`)
        } catch (err) {
            console.log(err);
        }

    }
}