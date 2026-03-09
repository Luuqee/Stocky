const config = require('../config.json');

function getNivel(member) {
  if (member.roles.cache.has(config.roles.dono)) return 3;
  if (member.roles.cache.has(config.roles.gerente)) return 2;
  if (member.roles.cache.has(config.roles.membro)) return 1;
  return 0;
}

function podeUsarBau(member) {
  return getNivel(member) >= 1;
}

function podeUsarBauGerencia(member) {
  return getNivel(member) >= 2;
}

function podeVerLogs(member) {
  return getNivel(member) >= 2;
}

function podeGerenciarCatalogo(member) {
  return getNivel(member) >= 2;
}

function podeZerarBau(member) {
  return getNivel(member) >= 2;
}

function getNomeNivel(member) {
  const n = getNivel(member);
  if (n === 3) return '👑 El Diablo';
  if (n === 2) return '⭐ Consejero';
  if (n === 1) return '🔵 Membro';
  return '❌ Sem acesso';
}

module.exports = {
  getNivel, podeUsarBau, podeUsarBauGerencia,
  podeVerLogs, podeGerenciarCatalogo,
  podeZerarBau, getNomeNivel
};