const Character = require('../Character')
const CharacterBuilder = require('../CharacterBuilder')

class Elf extends Character {
  constructor(name, id) {
    super(
      new CharacterBuilder('Эльф', name, id)
        .setHeight(185)
        .setWeight(65)
        .setAge(200)
        .setHealth(80)
        .setStrength(16)
    )
  }
}

module.exports = Elf
