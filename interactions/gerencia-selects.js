const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder } = require('discord.js');
const { embedGerencia, embedSucesso, embedErro } = require('../utils/embeds');
const { getCategorias, getItensDaCategoria, zerarBau, getLogs, removerItemDoCatalogo } = require('../utils/db');

module.exports = {
  type: 'select',
  customIds: ['ger_cat_adicionar', 'ger_cat_remover', 'ger_zerar_confirmar', 'ger_logs_tipo', 'ger_item_remover'],

  async execute(interaction, client) {
    const acao = interaction.customId;

    if (acao === 'ger_cat_adicionar') {
      const [tipo, categoriaId] = interaction.values[0].split(':');
      const modal = new ModalBuilder()
        .setCustomId(`ger_modal_adicionar:${tipo}:${categoriaId}`)
        .setTitle('Adicionar Item ao Catalogo');

      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('nome')
            .setLabel('Nome do item')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ex: Granada')
            .setRequired(true)
        )
      );

      return interaction.showModal(modal);
    }

    if (acao === 'ger_cat_remover') {
      await interaction.deferUpdate();
      const [tipo, categoriaId] = interaction.values[0].split(':');
      const itens = getItensDaCategoria(tipo, categoriaId);

      if (!itens.length) {
        return interaction.editReply({
          embeds: [embedErro('Sem itens', 'Essa categoria nao possui itens cadastrados.')],
          components: []
        });
      }

      const select = new StringSelectMenuBuilder()
        .setCustomId(`ger_item_remover:${tipo}:${categoriaId}`)
        .setPlaceholder('Selecione o item para remover...')
        .addOptions(itens.map(item => ({ label: item.nome, value: item.id })));

      return interaction.editReply({
        embeds: [embedGerencia().setDescription('> Selecione o item que deseja remover do catalogo:')],
        components: [new ActionRowBuilder().addComponents(select)]
      });
    }

    if (acao.startsWith('ger_item_remover')) {
      await interaction.deferUpdate();
      const [, tipo, categoriaId] = acao.split(':');
      const itemId = interaction.values[0];
      const resultado = removerItemDoCatalogo(tipo, categoriaId, itemId);

      if (!resultado.sucesso) {
        return interaction.editReply({
          embeds: [embedErro('Erro', resultado.motivo)],
          components: []
        });
      }

      return interaction.editReply({
        embeds: [embedSucesso('Item removido!', 'Item removido do catalogo com sucesso.')],
        components: []
      });
    }

    if (acao === 'ger_zerar_confirmar') {
      await interaction.deferUpdate();
      const tipo = interaction.values[0];
      if (tipo === 'ambos') {
        zerarBau('membros');
        zerarBau('gerencia');
      } else {
        zerarBau(tipo);
      }
      return interaction.editReply({
        embeds: [embedSucesso('Bau zerado!', 'O bau foi resetado com sucesso.')],
        components: []
      });
    }

    if (acao === 'ger_logs_tipo') {
      await interaction.deferUpdate();
      const tipo = interaction.values[0];
      const logs = getLogs(tipo);

      if (!logs.length) {
        return interaction.editReply({
          embeds: [embedErro('Sem logs', 'Nenhuma movimentacao registrada ainda.')],
          components: []
        });
      }

      const ultimos = logs.slice(0, 10);
      const linhas = ultimos.map(l => {
        const data = new Date(l.timestamp).toLocaleString('pt-BR');
        const icone = l.acao === 'adicionar' ? '📥' : '📤';
        return `${icone} **${l.item.nome}** x${l.quantidade} — <@${l.usuarioId}> — ${data}`;
      }).join('\n');

      const { EmbedBuilder } = require('discord.js');
      const embed = new EmbedBuilder()
        .setColor(0x3498DB)
        .setTitle(`📋 Ultimas movimentacoes — ${tipo === 'gerencia' ? 'Bau da Gerencia' : 'Bau dos Membros'}`)
        .setDescription(linhas)
        .setFooter({ text: 'Marabunta Grande — Stocky' })
        .setTimestamp();

      return interaction.editReply({
        embeds: [embed],
        components: []
      });
    }
  }
};