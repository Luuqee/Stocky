const { embedSucesso, embedErro } = require('../utils/embeds');
const { adicionarItemAoCatalogo } = require('../utils/db');

module.exports = {
  type: 'modal',
  customIds: ['ger_modal_adicionar'],

  async execute(interaction, client) {
    const [, tipo, categoriaId] = interaction.customId.split(':');
    const nome = interaction.fields.getTextInputValue('nome');
    const emoji = interaction.fields.getTextInputValue('emoji');
    const id = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    const resultado = adicionarItemAoCatalogo(tipo, categoriaId, id, nome, emoji);

    if (!resultado.sucesso) {
      return interaction.reply({
        embeds: [embedErro('Erro', resultado.motivo)],
        flags: 64
      });
    }

    return interaction.reply({
      embeds: [embedSucesso('Item adicionado!', `${emoji} **${nome}** foi adicionado ao catálogo com sucesso!`)],
      flags: 64
    });
  }
};