const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { embedMenuPrincipal } = require('../utils/embeds');
const { podeUsarBau, podeUsarBauGerencia } = require('../utils/permissoes');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bau')
    .setDescription('Abre o sistema de baú da Marabunta Grande')
    .addStringOption(option =>
      option.setName('tipo')
        .setDescription('Qual baú deseja acessar?')
        .setRequired(true)
        .addChoices(
          { name: '📦 Baú dos Membros', value: 'membros' },
          { name: '🔐 Baú da Gerência', value: 'gerencia' }
        )
    ),

  async execute(interaction, client) {
    const tipo = interaction.options.getString('tipo');

    if (tipo === 'membros' && !podeUsarBau(interaction.member)) {
      return interaction.reply({
        content: '❌ Você não tem permissão para acessar o baú dos membros.',
        ephemeral: true
      });
    }

    if (tipo === 'gerencia' && !podeUsarBauGerencia(interaction.member)) {
      return interaction.reply({
        content: '❌ Apenas **Consejeros** e **El Diablo** podem acessar o baú da gerência.',
        ephemeral: true
      });
    }

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

    return interaction.reply({
      embeds: [embedMenuPrincipal(tipo)],
      components: [row],
      ephemeral: true
    });
  }
};