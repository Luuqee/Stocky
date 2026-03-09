const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { embedGerencia } = require('../utils/embeds');
const { podeGerenciarCatalogo } = require('../utils/permissoes');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gerencia')
    .setDescription('Abre o painel da gerência'),

  async execute(interaction, client) {
    if (!podeGerenciarCatalogo(interaction.member)) {
      return interaction.reply({
        content: '❌ Apenas **Consejeros** e **El Diablo** podem acessar esse painel.',
        flags: 64
      });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ger_adicionar_item')
        .setLabel('➕ Adicionar Item')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('ger_remover_item')
        .setLabel('➖ Remover Item')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('ger_zerar_bau')
        .setLabel('🗑️ Zerar Baú')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('ger_ver_logs')
        .setLabel('📋 Ver Logs')
        .setStyle(ButtonStyle.Primary)
    );

    return interaction.reply({
      embeds: [embedGerencia()],
      components: [row],
      flags: 64
    });
  }
};