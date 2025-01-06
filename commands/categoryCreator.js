const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');

// Define the setup_engineering command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setupengineering')
        .setDescription('Sets up categories and channels for the engineering server'),

    async execute(interaction) {
        const guild = interaction.guild;

        // Ensure roles exist (adjust role names if different)
        const studentRole = guild.roles.cache.find(role => role.name === 'Verified Student');
        const teacherRole = guild.roles.cache.find(role => role.name === 'Teacher');
        const crRole = guild.roles.cache.find(role => role.name === 'CR');

        // Subjects list
        const subjects = ['maths', 'physics', 'english', 'psychology', 'cs'];

        // --- Year 1 & 2 (Sem 1 to 4 with 12 Batches each) ---
        for (const sem of ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']) {
            for (let batchNum = 1; batchNum <= 12; batchNum++) {
                const batchName = `${sem} - B${batchNum}`;
                const category = await guild.channels.create(batchName, {
                    type: 'GUILD_CATEGORY',
                });

                // Set permissions
                await category.permissionOverwrites.create(guild.id, { VIEW_CHANNEL: false });
                await category.permissionOverwrites.create(studentRole.id, { VIEW_CHANNEL: true });
                await category.permissionOverwrites.create(teacherRole.id, { VIEW_CHANNEL: true });
                await category.permissionOverwrites.create(crRole.id, { VIEW_CHANNEL: true, MANAGE_CHANNELS: true });

                // Create subject channels
                for (const subject of subjects) {
                    await guild.channels.create(subject, { type: 'GUILD_TEXT', parent: category.id });
                }

                // Unofficial chat where teachers can't access
                const unofficialChat = await guild.channels.create('unofficial-chat', {
                    type: 'GUILD_TEXT',
                    parent: category.id,
                });
                await unofficialChat.permissionOverwrites.create(teacherRole.id, { VIEW_CHANNEL: false });
            }
        }

        // --- Year 3 & 4 (Branch-wise split from Sem 5 onwards) ---
        const branches = ['AIML', 'CSE', 'DS']; // Add more if needed
        for (const sem of ['Sem 5', 'Sem 6', 'Sem 7', 'Sem 8']) {
            for (const branch of branches) {
                const batchName = `${sem} - ${branch}`;
                const category = await guild.channels.create(batchName, {
                    type: 'GUILD_CATEGORY',
                });

                // Set permissions for the branch
                await category.permissionOverwrites.create(guild.id, { VIEW_CHANNEL: false });
                await category.permissionOverwrites.create(studentRole.id, { VIEW_CHANNEL: true });
                await category.permissionOverwrites.create(teacherRole.id, { VIEW_CHANNEL: true });
                await category.permissionOverwrites.create(crRole.id, { VIEW_CHANNEL: true, MANAGE_CHANNELS: true });

                // Create subject channels specific to the branch
                for (const subject of subjects) {
                    await guild.channels.create(`${subject}-${branch}`, { type: 'GUILD_TEXT', parent: category.id });
                }

                // Unofficial chat where teachers can't access
                const unofficialChat = await guild.channels.create(`unofficial-chat-${branch}`, {
                    type: 'GUILD_TEXT',
                    parent: category.id,
                });
                await unofficialChat.permissionOverwrites.create(teacherRole.id, { VIEW_CHANNEL: false });
            }
        }

        await interaction.reply('✅ **Complete Engineering Server Setup with Branch Split Done!**');
    },
};
