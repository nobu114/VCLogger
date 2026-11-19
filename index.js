const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
    ],
});
const version = { text: 'Version 3.0' };

const send_vc_notify = (voicestate, is_exit) => {
    const systemChannel = voicestate.guild.systemChannel;
    if (!systemChannel) return;

    const member = voicestate.member;
    const channel = voicestate.channel;
    const embed = new EmbedBuilder()
        .setColor(member.displayColor)
        .setAuthor({
            name: is_exit ? 'VC退室' : 'VC入室',
            iconURL: member.displayAvatarURL(),
        })
        .setTitle(is_exit
            ? `${member.displayName}が${channel.name}から退室しました！`
            : `${member.displayName}が${channel.name}に入室しました！`)
        .setDescription(`現在の参加者数は${channel.members.size}人です。`)
        .setFooter(version);

    systemChannel.send({ embeds: [embed] }).catch(console.error);
};

const hasRole = (member, roleName) =>
    member.roles.cache.some((role) => role.name === roleName);

client.once(Events.ClientReady, () => {
    console.log('ログインしました。');
});

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    const member = newState.member ?? oldState.member;
    if (!member) return;

    const vc_calling = newState.guild.roles.cache.find((role) => role.name === 'VC Calling');

    if (oldState.channelId === null && newState.channelId !== null) {
        // 入室
        if (vc_calling) member.roles.add(vc_calling).catch(console.error);
        if (!member.user.bot && hasRole(member, 'VC Entry')) {
            send_vc_notify(newState, false);
        }
    } else if (oldState.channelId !== null && newState.channelId === null) {
        // 退室
        if (vc_calling) member.roles.remove(vc_calling).catch(console.error);
        if (!member.user.bot && hasRole(member, 'VC Exit')) {
            send_vc_notify(oldState, true);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
