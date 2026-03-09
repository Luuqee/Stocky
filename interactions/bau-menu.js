const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { embedSelecionarCategoria, embedInventario, embedMenuPrincipal } = require('../utils/embeds');
const { getCategorias, getBau } = require('../utils/db');

function rowMenuBau(tipo) {
  return new ActionRowBuilder().addComponents(
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
}

module.exports = {
  type: 'button',
  customIds: ['bau_adicionar', 'bau_remover', 'bau_estoque'],

  async execute(interaction, client) {
    await interaction.deferUpdate();
    const [acao, tipo] = interaction.customId.split(':');

    if (acao === 'bau_estoque') {
      const bau = getBau(tipo);
      return interaction.editReply({
        embeds: [embedInventario(bau, tipo)],
        components: [rowMenuBau(tipo)]
      });
    }

    const acaoNome = acao === 'bau_adicionar' ? 'adicionar' : 'remover';
    const categorias = getCategorias();

    const select = new StringSelectMenuBuilder()
      .setCustomId(`bau_categoria:${acaoNome}:${tipo}`)
      .setPlaceholder('Selecione uma categoria...')
      .addOptions(categorias.map(cat => ({ label: cat.nome, value: cat.id, emoji: cat.emoji })));

    return interaction.editReply({
      embeds: [embedSelecionarCategoria(tipo, acaoNome)],
      components: [new ActionRowBuilder().addComponents(select)]
    });
  }
};