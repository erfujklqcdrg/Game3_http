const Character = require('../Character')
const CharacterBuilder = require('../CharacterBuilder')

class Dward extends Character {
  constructor(name, id) {
    super(
      new CharacterBuilder('Гном', name, id)
        .setHeight(120)
        .setWeight(60)
        .setAge(150)
        .setHealth(105)
        .setStrength(18)
    )
  }
}

module.exports = Dward
