const Character = require('../Character')
const CharacterBuilder = require('../CharacterBuilder')

class Orc extends Character {
  constructor(name, id) {
    super(
      new CharacterBuilder('Орк', name, id)
        .setHeight(180)
        .setWeight(90)
        .setAge(30)
        .setHealth(120)
        .setStrength(14)
    )
  }
}

module.exports = Orc
