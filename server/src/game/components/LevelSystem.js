const Types = require('../Types');

class LevelSystem {
  constructor(player) {
    this.player = player;
    this.level = 1;
    this.maxLevel = 50;
    this.coins = 0;
    this.previousLevelCoins = 0;
    this.nextLevelCoins = 10;
    this.upgradePoints = 0;

    this.buffs = {
      [Types.Buff.Speed]: {
        level: 0,
        max: 10,
        step: 0.1,
      },
      [Types.Buff.Size]: {
        level: 0,
        max: 10,
        step: 0.1,
      },
      [Types.Buff.Health]: {
        level: 0,
        step: 0.2,
        max: 10,
      },
      [Types.Buff.Regeneration]: {
        level: 0,
        step: 0.2,
        max: 10,
      },
      [Types.Buff.Damage]: {
        level: 0,
        step: 0.2,
        max: 10,
      },
    }
  }

  addCoins(coins) {
    this.coins += coins;
    while (this.coins >= this.nextLevelCoins) {
      if (this.level === this.maxLevel) break;

      this.levelUp();
    }
  }

  canBuff(type) {
    const buff = this.buffs[type];
    return this.upgradePoints > 0 && buff && buff.level < buff.max;
  }

  addBuff(type) {
    if (!this.canBuff(type)) return;
    this.buffs[type].level += 1;
    this.upgradePoints -= 1;
  }

  applyBuffs() {
    for (const [type, buff] of Object.entries(this.buffs)) {
      if (buff.level === 0) continue;

      const multiplier = 1 + buff.level * buff.step;
      switch (Number(type)) {
        case Types.Buff.Speed:
          this.player.speed.multiplier *= multiplier;
          break;
        case Types.Buff.Size:
          this.player.shape.setScale(multiplier);
          break;
        case Types.Buff.Health:
          this.player.health.max.multiplier *= multiplier;
          break;
        case Types.Buff.Regeneration:
          this.player.health.regen.multiplier *= multiplier;
          break;
        case Types.Buff.Damage:
          this.player.sword.damage.multiplier *= multiplier;
          break;
      }
    }
  }

  levelUp() {
    this.level += 1;
    this.previousLevelCoins = this.nextLevelCoins;
    this.nextLevelCoins = this.previousLevelCoins * 1.4;
    this.upgradePoints += 1; 
    this.player.evolutions.checkForEvolutions();
  }
}

module.exports = LevelSystem;
