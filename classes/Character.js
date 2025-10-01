class Character {
  constructor(builder) {
    this.id = builder.id || Date.now().toString() // Уникальный ID
    this.race = builder.race
    this.name = builder.name
    this.height = builder.height
    this.weight = builder.weight
    this.age = builder.age
    this.health = builder.health
    this.maxHealth = builder.health
    this.strength = builder.strength
    this.weapon = null
    this.armor = {
      helmet: null,
      chestplate: null,
      pants: null,
    }
    this.totalArmor = 0
    this.kills = [] // Список убитых противников
    this.damageDealt = 0 // Общий нанесенный урон
  }

  putOnArmor(armorType, armorPiece) {
    this.armor[armorType] = armorPiece
    this.calculateTotalArmor()
  }

  calculateTotalArmor() {
    this.totalArmor = Object.values(this.armor)
      .filter((item) => item !== null)
      .reduce((total, armor) => total + armor.defense, 0)
  }

  takeWeapon(weapon) {
    this.weapon = weapon
  }

  attack(target) {
    if (!this.isAlive() || !target.isAlive()) return 0

    const baseDamage = this.strength + this.weapon.damage
    const finalDamage = Math.max(baseDamage - target.totalArmor, 1)

    target.health -= finalDamage
    this.damageDealt += finalDamage

    if (!target.isAlive()) {
      this.kills.push(target.name)
    }

    return finalDamage
  }

  isAlive() {
    return this.health > 0
  }

  // Сброс состояния для нового боя
  resetForBattle() {
    this.health = this.maxHealth
    this.kills = []
    this.damageDealt = 0
  }

  // Получить информацию о персонаже
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      race: this.race,
      health: this.health,
      maxHealth: this.maxHealth,
      strength: this.strength,
      weapon: this.weapon,
      armor: this.armor,
      totalArmor: this.totalArmor,
      isAlive: this.isAlive(),
    }
  }

  // Получить боевую статистику
  getBattleStats() {
    return {
      name: this.name,
      health: this.health,
      damageDealt: this.damageDealt,
      kills: this.kills,
      isAlive: this.isAlive(),
    }
  }
}

module.exports = Character
