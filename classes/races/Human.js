const Character = require('../Character')
const CharacterBuilder = require('../CharacterBuilder')

class Human extends Character {
  constructor(name, id) {
    super(
      new CharacterBuilder('Человек', name, id)
        .setHeight(175)
        .setWeight(75)
        .setAge(25)
        .setHealth(100)
        .setStrength(14)
    )
  }
}

module.exports = Human
