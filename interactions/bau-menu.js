const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { embedSelecionarCategoria, embedSelecionarItem, embedInventario } = require('../utils/embeds');
const { getCategorias, getItensDaCategoria, getBau } = require('../utils/db');

module.exports = {
  type: 'button',
  customIds: ['bau_adicionar', 'bau_remover', 'bau_estoque'],

  async execute(interaction, client) {
    const [acao, tipo] = interaction.customId.split(':');

    // ─── VER ESTOQUE ──────────────────────────────────────────────────────────
    if (acao === 'bau_estoque') {
      const bau = getBau(tipo);
      return interaction.update({
        embeds: [embedInventario(bau, tipo)],
        components: []
      });
    }

    // ─── ADICIONAR / REMOVER — SELECIONAR CATEGORIA ───────────────────────────
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

    const row = new ActionRowBuilder().addComponents(select);

    return interaction.update({
      embeds: [embedSelecionarCategoria(tipo, acaoNome)],
      components: [row]
    });
  }
};