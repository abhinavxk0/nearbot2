const { embedcolor } = require('../../config.json')
const db = require('quick.db')
const djSchema = require('../../schema/djrole-schema')
const config = require('../../config.json')

module.exports = {
    name: 'loop',
    aliases: ['repeat'],
    description: 'loops song',
    async execute(client, message, args, Discord) {
        const memberVC = message.member.voice.channel;
        if (!memberVC) return message.lineReplyNoMention(
            new Discord.MessageEmbed()
                .setColor('#A9E9F6')
                .setDescription('You need to be in a voice channel to execute this command!')
        ).then(message => { message.delete({ timeout: 10000 }); })
        if (!message.guild.me.hasPermission("SPEAK")) return message.lineReply(
            new Discord.MessageEmbed()
                .setColor('#A9E9F6')
                .setDescription(`I cannot play music in this channel, I am lacking the \`SPEAK\` permissions!`)
        )   

        const clientVC = message.guild.me.voice.channel;
        if (!clientVC) return message.lineReplyNoMention(
            new Discord.MessageEmbed()
                .setColor('#A9E9F6')
                .setDescription('I am not currently playing in this guild.')
        ).then(message => { message.delete({ timeout: 10000 }); })

        if (memberVC !== clientVC) return message.lineReplyNoMention(
            new Discord.MessageEmbed()
                .setColor('#A9E9F6')
                .setDescription(`You need to be in ${message.guild.me.voice.channel} to execute this command!`)
        ).then(message => { message.delete({ timeout: 10000 }); })
        const queue = client.distube.getQueue(message)
        if (!queue) return message.lineReply(
            new Discord.MessageEmbed()
                .setColor(embedcolor)
                .setDescription(`Nothing's in the queue right now!`)
        )
        const djuser = await db.fetch(`djuser.${message.guild.id}`);
        if (djuser){
            const dju = message.guild.member(djuser);
            if (message.author.id !== dju.id){
                return message.lineReply(
                    new Discord.MessageEmbed()
                        .setColor(config.embedcolor)
                        .setDescription(`You're not the DJ for this session! :/`)
                )
            }
        }
        if (!args[0]) return message.lineReply(
            new Discord.MessageEmbed()
                .setColor(embedcolor)
                .setDescription(`Enter a loop setting. (\`off, song, queue\`)`)
        )
        let mode = null
        switch (args[0]) {
            case "off":
                mode = 0
                break
            case "song":
                mode = 1
                break
            case "queue":
                mode = 2
                break
        }
        const a = await message.lineReply(
            new Discord.MessageEmbed()
                .setColor(embedcolor)
                .setDescription(`loading <a:loading:910721336542916660>`)
        )
        mode = queue.setRepeatMode(mode)
        mode = mode ? mode === 2 ? "Repeat queue" : "Repeat song" : "Off"
        message.lineReply(
            new Discord.MessageEmbed()
            .setColor('#A9E9F6')
            .setDescription(`Set repeat mode to \`${mode}\``)
        )
        try {
            a.delete()
        } catch (err) {
            throw err;
        }
    }
}

