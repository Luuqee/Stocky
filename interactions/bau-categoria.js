const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { embedSelecionarItem } = require('../utils/embeds');
const { getCategorias, getItensDaCategoria } = require('../utils/db');

module.exports = {
  type: 'select',
  customIds: ['bau_categoria'],

  async execute(interaction, client) {
    await interaction.deferUpdate();
    const [, acao, tipo] = interaction.customId.split(':');
    const categoriaId = interaction.values[0];

    const categorias = getCategorias(tipo);
    const categoria = categorias.find(c => c.id === categoriaId);
    const itens = getItensDaCategoria(tipo, categoriaId);

    if (!itens.length) {
      return interaction.editReply({
        content: '❌ Nenhum item encontrado nessa categoria.',
        embeds: [],
        components: []
      });
    }

    const select = new StringSelectMenuBuilder()
      .setCustomId(`bau_item:${acao}:${tipo}:${categoriaId}`)
      .setPlaceholder('Selecione um item...')
      .addOptions(
        itens.map(item => ({
          label: item.nome,
          value: item.id
        }))
      );

    return interaction.editReply({
      embeds: [embedSelecionarItem(acao, categoria.nome, categoria.emoji)],
      components: [new ActionRowBuilder().addComponents(select)]
    });
  }
};