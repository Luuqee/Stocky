const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BAU_MEMBROS_FILE = path.join(DATA_DIR, 'bau-membros.json');
const BAU_GERENCIA_FILE = path.join(DATA_DIR, 'bau-gerencia.json');
const ITEMS_FILE = path.join(DATA_DIR, 'items.json');
const LOGS_MEMBROS_FILE = path.join(DATA_DIR, 'logs-membros.json');
const LOGS_GERENCIA_FILE = path.join(DATA_DIR, 'logs-gerencia.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readJSON(filePath, defaultValue) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return defaultValue;
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const CATALOGO_PADRAO = {
  medicamentos: {
    nome: "Medicamentos", emoji: "💊",
    items: [
      { id: "bandagem", nome: "Bandagem" },
      { id: "gaze", nome: "Gaze" },
      { id: "adrenalina", nome: "Adrenalina" }
    ]
  },
  armas: {
    nome: "Armas", emoji: "🔫",
    items: [
      { id: "colt", nome: "Colt" },
      { id: "usp", nome: "USP" },
      { id: "desert", nome: "Desert Eagle" },
      { id: "ak_47", nome: "AK 47" }
    ]
  },
  coletesemuni: {
    nome: "Coletes e Munição", emoji: "🦺",
    items: [
      { id: "colete", nome: "Colete" },
      { id: "colete_danificado", nome: "Colete Danificado" },
      { id: "muni_9mm", nome: "Munição 9MM" },
      { id: "muni_45acp", nome: "Munição .45 ACP" },
      { id: "muni_50", nome: "Munição .50" },
      { id: "muni_50ae", nome: "Munição .50 AE" }
    ]
  },
  materiais: {
    nome: "Materiais", emoji: "🪛",
    items: [
      { id: "laptop", nome: "Laptop" },
      { id: "caixa_polvora", nome: "Caixa de Pólvora" },
      { id: "sulfato_bario", nome: "Sulfato de Bário" },
      { id: "alcool_gel", nome: "Álcool em Gel" },
      { id: "sabonete", nome: "Sabonete" },
      { id: "pecas_roupas", nome: "Peças de Roupas" },
      { id: "kit_eletronico", nome: "Kit Eletrônico" },
      { id: "cobre", nome: "Cobre" },
      { id: "plastico", nome: "Plástico" },
      { id: "sucata_metal", nome: "Sucata de Metal" },
      { id: "aluminio", nome: "Alumínio" },
      { id: "borracha", nome: "Borracha" }
    ]
  },
  drogas: {
    nome: "Drogas", emoji: "🌿",
    items: [
      { id: "cocaina", nome: "Cocaína" },
      { id: "lsd", nome: "LSD" },
      { id: "meta", nome: "Meta" }
    ]
  },
  extras: {
    nome: "Extras", emoji: "📦",
    items: [
      { id: "fichas_cassino", nome: "Fichas de Cassino" },
      { id: "agulha", nome: "Agulha" },
      { id: "linha", nome: "Linha" },
      { id: "resina", nome: "Resina" },
      { id: "tesoura", nome: "Tesoura" },
      { id: "notas_marcadas", nome: "Notas Marcadas" }
    ]
  }
};

// ─── BAÚ ─────────────────────────────────────────────────────────────────────

function getBau(tipo) {
  return readJSON(tipo === 'gerencia' ? BAU_GERENCIA_FILE : BAU_MEMBROS_FILE, {});
}

function adicionarAoBau(tipo, categoriaId, itemId, quantidade, nomeItem, nomeCategoria) {
  const file = tipo === 'gerencia' ? BAU_GERENCIA_FILE : BAU_MEMBROS_FILE;
  const bau = readJSON(file, {});
  const key = `${categoriaId}:${itemId}`;
  if (!bau[key]) {
    bau[key] = { nome: nomeItem, categoria: nomeCategoria, categoriaId, quantidade: 0 };
  }
  bau[key].quantidade += quantidade;
  writeJSON(file, bau);
  return bau[key].quantidade;
}

function removerDoBau(tipo, categoriaId, itemId, quantidade) {
  const file = tipo === 'gerencia' ? BAU_GERENCIA_FILE : BAU_MEMBROS_FILE;
  const bau = readJSON(file, {});
  const key = `${categoriaId}:${itemId}`;
  if (!bau[key]) return { sucesso: false, motivo: 'Item não encontrado no baú.' };
  if (bau[key].quantidade < quantidade) {
    return { sucesso: false, motivo: `Estoque insuficiente. Disponível: **${bau[key].quantidade}**` };
  }
  bau[key].quantidade -= quantidade;
  if (bau[key].quantidade === 0) delete bau[key];
  writeJSON(file, bau);
  return { sucesso: true, novaQtd: bau[key] ? bau[key].quantidade : 0 };
}

function zerarBau(tipo) {
  writeJSON(tipo === 'gerencia' ? BAU_GERENCIA_FILE : BAU_MEMBROS_FILE, {});
}

// ─── CATÁLOGO ─────────────────────────────────────────────────────────────────

function getCatalogo() {
  return readJSON(ITEMS_FILE, CATALOGO_PADRAO);
}

function getCategorias() {
  const catalogo = getCatalogo();
  return Object.entries(catalogo).map(([id, cat]) => ({ id, nome: cat.nome, emoji: cat.emoji }));
}

function getItensDaCategoria(categoriaId) {
  const catalogo = getCatalogo();
  return catalogo[categoriaId] ? catalogo[categoriaId].items : [];
}

function adicionarItemAoCatalogo(categoriaId, itemId, nomeItem) {
  const catalogo = getCatalogo();
  if (!catalogo[categoriaId]) return { sucesso: false, motivo: 'Categoria não encontrada.' };
  const jaExiste = catalogo[categoriaId].items.find(i => i.id === itemId);
  if (jaExiste) return { sucesso: false, motivo: 'Item já existe nessa categoria.' };
  catalogo[categoriaId].items.push({ id: itemId, nome: nomeItem });
  writeJSON(ITEMS_FILE, catalogo);
  return { sucesso: true };
}

function removerItemDoCatalogo(categoriaId, itemId) {
  const catalogo = getCatalogo();
  if (!catalogo[categoriaId]) return { sucesso: false, motivo: 'Categoria não encontrada.' };
  const idx = catalogo[categoriaId].items.findIndex(i => i.id === itemId);
  if (idx === -1) return { sucesso: false, motivo: 'Item não encontrado no catálogo.' };
  catalogo[categoriaId].items.splice(idx, 1);
  writeJSON(ITEMS_FILE, catalogo);
  return { sucesso: true };
}

// ─── LOGS ─────────────────────────────────────────────────────────────────────

function addLog(tipo, entrada) {
  const file = tipo === 'gerencia' ? LOGS_GERENCIA_FILE : LOGS_MEMBROS_FILE;
  const logs = readJSON(file, []);
  logs.unshift({ ...entrada, timestamp: new Date().toISOString() });
  if (logs.length > 500) logs.splice(500);
  writeJSON(file, logs);
}

function getLogs(tipo) {
  const file = tipo === 'gerencia' ? LOGS_GERENCIA_FILE : LOGS_MEMBROS_FILE;
  return readJSON(file, []);
}

module.exports = {
  getBau, adicionarAoBau, removerDoBau, zerarBau,
  getCatalogo, getCategorias, getItensDaCategoria,
  adicionarItemAoCatalogo, removerItemDoCatalogo,
  addLog, getLogs
};