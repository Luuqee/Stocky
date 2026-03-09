const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { embedMenuPrincipal } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Envia a mensagem fixa do baú no canal (use apenas uma vez)')
    .addStringOption(option =>
      option.setName('tipo')
        .setDescription('Qual baú configurar?')
        .setRequired(true)
        .addChoices(
          { name: '📦 Baú dos Membros', value: 'membros' },
          { name: '🔐 Baú da Gerência', value: 'gerencia' }
        )
    ),

  async execute(interaction, client) {
    const tipo = interaction.options.getString('tipo');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`bau_adicionar:${tipo}`)
        .setLabel('📥 Adicionar')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`bau_remover:${tipo}`)
        .setLabel('📤 Remover')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`bau_estoque:${tipo}`)
        .setLabel('📋 Ver Estoque')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      content: '✅ Mensagem fixa enviada!',
      flags: 64
    });

    const canalId = tipo === 'gerencia'
      ? interaction.client.channels.cache.get(require('../config.json').channels.bauGerencia)
      : interaction.client.channels.cache.get(require('../config.json').channels.bauMembros);

    await canalId.send({
      embeds: [embedMenuPrincipal(tipo)],
      components: [row]
    });
  }
};
