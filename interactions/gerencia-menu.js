const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { embedGerencia } = require('../utils/embeds');
const { getCategorias } = require('../utils/db');

module.exports = {
  type: 'button',
  customIds: ['ger_adicionar_item', 'ger_remover_item', 'ger_zerar_bau', 'ger_ver_logs'],

  async execute(interaction, client) {
    await interaction.deferUpdate();
    const acao = interaction.customId;

    if (acao === 'ger_adicionar_item') {
      const select = new StringSelectMenuBuilder()
        .setCustomId('ger_cat_adicionar')
        .setPlaceholder('Selecione o baú e categoria...')
        .addOptions([
          ...getCategorias('membros').map(cat => ({
            label: `[Membros] ${cat.nome}`,
            value: `membros:${cat.id}`
          })),
          ...getCategorias('gerencia').map(cat => ({
            label: `[Gerência] ${cat.nome}`,
            value: `gerencia:${cat.id}`
          }))
        ]);

      return interaction.editReply({
        embeds: [embedGerencia().setDescription('> Selecione em qual baú e categoria deseja adicionar o item:')],
        components: [new ActionRowBuilder().addComponents(select)]
      });
    }

    if (acao === 'ger_remover_item') {
      const select = new StringSelectMenuBuilder()
        .setCustomId('ger_cat_remover')
        .setPlaceholder('Selecione o baú e categoria...')
        .addOptions([
          ...getCategorias('membros').map(cat => ({
            label: `[Membros] ${cat.nome}`,
            value: `membros:${cat.id}`
          })),
          ...getCategorias('gerencia').map(cat => ({
            label: `[Gerência] ${cat.nome}`,
            value: `gerencia:${cat.id}`
          }))
        ]);

      return interaction.editReply({
        embeds: [embedGerencia().setDescription('> Selecione em qual baú e categoria deseja remover o item:')],
        components: [new ActionRowBuilder().addComponents(select)]
      });
    }

    if (acao === 'ger_zerar_bau') {
      const select = new StringSelectMenuBuilder()
        .setCustomId('ger_zerar_confirmar')
        .setPlaceholder('Selecione qual baú zerar...')
        .addOptions([
          { label: 'Baú dos Membros', value: 'membros' },
          { label: 'Baú da Gerência', value: 'gerencia' },
          { label: 'Ambos os Baús', value: 'ambos' }
        ]);

      return interaction.editReply({
        embeds: [embedGerencia().setDescription('> ⚠️ Selecione qual baú deseja zerar. Essa ação é irreversível!')],
        components: [new ActionRowBuilder().addComponents(select)]
      });
    }

    if (acao === 'ger_ver_logs') {
      const select = new StringSelectMenuBuilder()
        .setCustomId('ger_logs_tipo')
        .setPlaceholder('Ver logs de qual baú?')
        .addOptions([
          { label: 'Baú dos Membros', value: 'membros' },
          { label: 'Baú da Gerência', value: 'gerencia' }
        ]);

      return interaction.editReply({
        embeds: [embedGerencia().setDescription('> Selecione de qual baú deseja ver os logs:')],
        components: [new ActionRowBuilder().addComponents(select)]
      });
    }
  }
};