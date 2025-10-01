class CharacterBuilder {
  constructor(race, name, id) {
    this.id = id || Date.now().toString()
    this.race = race
    this.name = name
    this.height = 170
    this.weight = 70
    this.age = 25
    this.health = 100
    this.strength = 10
  }

  setHeight(height) {
    this.height = height
    return this
  }

  setWeight(weight) {
    this.weight = weight
    return this
  }

  setAge(age) {
    this.age = age
    return this
  }

  setHealth(health) {
    this.health = health
    return this
  }

  setStrength(strength) {
    this.strength = strength
    return this
  }

  build() {
    return new Character(this)
  }
}

module.exports = CharacterBuilder
