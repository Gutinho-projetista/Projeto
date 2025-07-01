// Estado do jogador
const player = {
  level: 1,
  xp: 0,
  xpToNext: 100,
  hp: 100,
  maxHp: 100,
  mp: 30,
  maxMp: 30,
  inventory: { potion: 3 }
};

// Elementos do DOM
const levelEl = document.getElementById('level');
const xpEl = document.getElementById('xp');
const xpNextEl = document.getElementById('xpToNext');
const hpEl = document.getElementById('hp');
const maxHpEl = document.getElementById('maxHp');
const mpEl = document.getElementById('mp');
const maxMpEl = document.getElementById('maxMp');
const logArea = document.getElementById('logArea');
const invList = document.getElementById('inventoryList');

function updateUI() {
  levelEl.textContent = player.level;
  xpEl.textContent = player.xp;
  xpNextEl.textContent = player.xpToNext;
  hpEl.textContent = player.hp;
  maxHpEl.textContent = player.maxHp;
  mpEl.textContent = player.mp;
  maxMpEl.textContent = player.maxMp;
  invList.innerHTML = '';
  for (const item in player.inventory) {
    const li = document.createElement('li');
    li.textContent = `${item}: ${player.inventory[item]}`;
    invList.appendChild(li);
  }
}

function log(text) {
  const p = document.createElement('p');
  p.textContent = text;
  logArea.prepend(p);
}

// Exploração: chance de XP ou item
document.getElementById('exploreBtn').addEventListener('click', () => {
  const chance = Math.random();
  if (chance < 0.6) {
    const gainedXp = Math.floor(Math.random() * 20) + 10;
    player.xp += gainedXp;
    log(`Você ganhou ${gainedXp} XP explorando.`);
  } else {
    player.inventory.potion = (player.inventory.potion || 0) + 1;
    log('Você encontrou uma poção!');
  }
  checkLevelUp();
  updateUI();
});

// Combate simples contra inimigo
document.getElementById('fightBtn').addEventListener('click', () => {
  const enemyHp = Math.floor(Math.random() * 50) + 20;
  let currentEnemyHp = enemyHp;
  log(`Inimigo aparece com ${enemyHp} HP!`);

  while (currentEnemyHp > 0 && player.hp > 0) {
    // Jogador ataca
    const dmg = Math.floor(Math.random() * 15) + 5;
    currentEnemyHp -= dmg;
    log(`Você causa ${dmg} de dano. HP do inimigo: ${Math.max(0, currentEnemyHp)}`);

    if (currentEnemyHp <= 0) {
      const xpWin = Math.floor(Math.random() * 30) + 20;
      player.xp += xpWin;
      log(`Inimigo derrotado! Ganhou ${xpWin} XP.`);
      break;
    }

    // Inimigo ataca
    const enemyDmg = Math.floor(Math.random() * 10) + 5;
    player.hp -= enemyDmg;
    log(`Inimigo causa ${enemyDmg} de dano. Seu HP: ${Math.max(0, player.hp)}`);

    if (player.hp <= 0) {
      player.hp = 0;
      log('Você foi derrotado...');
    }
  }

  checkLevelUp();
  updateUI();
});

// Usar poção: recupera HP
document.getElementById('usePotionBtn').addEventListener('click', () => {
  if (player.inventory.potion > 0) {
    player.inventory.potion--;
    const heal = 50;
    player.hp = Math.min(player.maxHp, player.hp + heal);
    log(`Você usou uma poção e recuperou ${heal} HP.`);
  } else {
    log('Não há poções no inventário.');
  }
  updateUI();
});

// Verifica nível e aplica upgrades
function checkLevelUp() {
  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level++;
    player.xpToNext = Math.floor(player.xpToNext * 1.5);
    player.maxHp += 20;
    player.hp = player.maxHp;
    player.maxMp += 10;
    player.mp = player.maxMp;
    log(`Parabéns! Você subiu para o nível ${player.level}.`);
  }
}

// Inicialização
updateUI();
log('Bem-vindo ao Mini RPG! Use os botões acima para começar.');
