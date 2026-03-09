const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { embedSelecionarCategoria, embedInventario, embedMenuPrincipal } = require('../utils/embeds');
const { getCategorias, getBau } = require('../utils/db');

module.exports = {
  type: 'button',
  customIds: ['bau_adicionar', 'bau_remover', 'bau_estoque'],

  async execute(interaction, client) {
    const [acao, tipo] = interaction.customId.split(':');

    const rowMenu = new ActionRowBuilder().addComponents(
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

    // ─── VER ESTOQUE ──────────────────────────────────────────────────────────
    if (acao === 'bau_estoque') {
      const bau = getBau(tipo);
      return interaction.reply({
        embeds: [embedInventario(bau, tipo)],
        flags: 64
      });
    }

    // ─── ADICIONAR / REMOVER ──────────────────────────────────────────────────
    const acaoNome = acao === 'bau_adicionar' ? 'adicionar' : 'remover';
    const categorias = getCategorias(tipo);

    const select = new StringSelectMenuBuilder()
      .setCustomId(`bau_categoria:${acaoNome}:${tipo}`)
      .setPlaceholder('Selecione uma categoria...')
      .addOptions(
        categorias.map(cat => ({
          label: cat.nome,
          value: cat.id,
          emoji: cat.emoji
        }))
      );

    const rowSelect = new ActionRowBuilder().addComponents(select);

    return interaction.update({
      embeds: [embedSelecionarCategoria(tipo, acaoNome)],
      components: [rowSelect]
    });
  }
};