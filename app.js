const express = require('express')
const app = express()
const PORT = 3000

// Импортируем классы
const Orc = require('./classes/races/Orc')
const Dward = require('./classes/races/Dward')
const Human = require('./classes/races/Human')
const Elf = require('./classes/races/Elf')

// Импортируем экипировку
const Sword = require('./classes/equipment/weapons/Sword')
const Halberd = require('./classes/equipment/weapons/Halberd')
const Helmet = require('./classes/equipment/armor/Helmet')
const Chestplate = require('./classes/equipment/armor/Chestplate')
const Pants = require('./classes/equipment/armor/Pants')

// Хранилище данных (в памяти)
let characters = []
let battleHistory = []

// Middleware для работы с JSON
app.use(express.json())

// ==================== РОУТЫ ====================

// 1. СОЗДАНИЕ ПЕРСОНАЖА
app.post('/characters', (req, res) => {
  try {
    const { race, name } = req.body

    if (!race || !name) {
      return res.status(400).json({ error: 'Укажите расу и имя персонажа' })
    }

    let character
    const id = Date.now().toString()

    switch (race.toLowerCase()) {
      case 'орк':
        character = new Orc(name, id)
        break
      case 'гном':
        character = new Dward(name, id)
        break
      case 'человек':
        character = new Human(name, id)
        break
      case 'эльф':
        character = new Elf(name, id)
        break
      default:
        return res.status(400).json({ error: 'Неизвестная раса' })
    }

    characters.push(character)
    res.status(201).json({
      message: 'Персонаж создан',
      character: character.getInfo(),
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания персонажа' })
  }
})

// 2. ПОЛУЧЕНИЕ ВСЕХ ПЕРСОНАЖЕЙ
app.get('/characters', (req, res) => {
  const charactersInfo = characters.map((char) => char.getInfo())
  res.json(charactersInfo)
})

// 3. ПОЛУЧЕНИЕ КОНКРЕТНОГО ПЕРСОНАЖА
app.get('/characters/:id', (req, res) => {
  const character = characters.find((char) => char.id === req.params.id)
  if (!character) {
    return res.status(404).json({ error: 'Персонаж не найден' })
  }
  res.json(character.getInfo())
})

// 4. ЭКИПИРОВКА ПЕРСОНАЖА
app.post('/characters/:id/equip', (req, res) => {
  try {
    const character = characters.find((char) => char.id === req.params.id)
    if (!character) {
      return res.status(404).json({ error: 'Персонаж не найден' })
    }

    const { equipmentType, equipment } = req.body

    // Создаем объект экипировки
    let equipmentItem
    switch (equipment) {
      case 'sword':
        equipmentItem = new Sword()
        break
      case 'halberd':
        equipmentItem = new Halberd()
        break
      case 'helmet':
        equipmentItem = new Helmet()
        break
      case 'chestplate':
        equipmentItem = new Chestplate()
        break
      case 'pants':
        equipmentItem = new Pants()
        break
      default:
        return res.status(400).json({ error: 'Неизвестная экипировка' })
    }

    // Экипируем
    if (equipmentType === 'weapon') {
      character.takeWeapon(equipmentItem)
    } else if (['helmet', 'chestplate', 'pants'].includes(equipmentType)) {
      character.putOnArmor(equipmentType, equipmentItem)
    } else {
      return res.status(400).json({ error: 'Неверный тип экипировки' })
    }

    res.json({
      message: 'Экипировка надета',
      character: character.getInfo(),
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка экипировки' })
  }
})

// 5. СМЕНА ЭКИПИРОВКИ
app.put('/characters/:id/equipment', (req, res) => {
  try {
    const character = characters.find((char) => char.id === req.params.id)
    if (!character) {
      return res.status(404).json({ error: 'Персонаж не найден' })
    }

    const { weapon, armor } = req.body

    // Меняем оружие
    if (weapon) {
      let weaponItem
      switch (weapon) {
        case 'sword':
          weaponItem = new Sword()
          break
        case 'halberd':
          weaponItem = new Halberd()
          break
        default:
          return res.status(400).json({ error: 'Неизвестное оружие' })
      }
      character.takeWeapon(weaponItem)
    }

    // Меняем броню
    if (armor) {
      Object.keys(armor).forEach((armorType) => {
        let armorItem
        switch (armor[armorType]) {
          case 'helmet':
            armorItem = new Helmet()
            break
          case 'chestplate':
            armorItem = new Chestplate()
            break
          case 'pants':
            armorItem = new Pants()
            break
          default:
            return
        }
        character.putOnArmor(armorType, armorItem)
      })
    }

    res.json({
      message: 'Экипировка изменена',
      character: character.getInfo(),
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка смены экипировки' })
  }
})

// 6. ЗАПУСК БОЯ
app.post('/battle', (req, res) => {
  try {
    const { characterIds } = req.body

    if (
      !characterIds ||
      !Array.isArray(characterIds) ||
      characterIds.length < 2
    ) {
      return res
        .status(400)
        .json({ error: 'Укажите минимум 2 ID персонажей для боя' })
    }

    // Находим персонажей и сбрасываем их состояние
    const battleCharacters = characters
      .filter((char) => characterIds.includes(char.id))
      .filter((char) => char.weapon !== null) // Только тех, у кого есть оружие

    if (battleCharacters.length < 2) {
      return res
        .status(400)
        .json({ error: 'Недостаточно персонажей с оружием для боя' })
    }

    // Сброс состояния перед боем
    battleCharacters.forEach((char) => char.resetForBattle())

    // Запускаем бой
    const winner = battleRoyale(battleCharacters)

    // Сохраняем историю боя
    const battleRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      participants: battleCharacters.map((char) => char.name),
      winner: winner ? winner.getBattleStats() : null,
      allStats: battleCharacters.map((char) => char.getBattleStats()),
    }

    battleHistory.push(battleRecord)

    res.json({
      message: winner ? 'Бой завершен' : 'Все погибли',
      winner: winner ? winner.getBattleStats() : null,
      battleStats: battleCharacters.map((char) => char.getBattleStats()),
      battleId: battleRecord.id,
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка запуска боя' })
  }
})

// 7. ИСТОРИЯ БОЕВ
app.get('/battles', (req, res) => {
  res.json(battleHistory)
})

// Функция боя (адаптированная)
function battleRoyale(characters) {
  let round = 0
  const aliveCharacters = [...characters]

  while (aliveCharacters.length > 1) {
    round++

    for (let i = 0; i < aliveCharacters.length; i++) {
      const attacker = aliveCharacters[i]

      for (let j = 0; j < aliveCharacters.length; j++) {
        if (i !== j) {
          const target = aliveCharacters[j]
          if (attacker.isAlive() && target.isAlive()) {
            attacker.attack(target)
          }
        }
      }
    }

    // Убираем мертвых
    for (let i = aliveCharacters.length - 1; i >= 0; i--) {
      if (!aliveCharacters[i].isAlive()) {
        aliveCharacters.splice(i, 1)
      }
    }

    if (aliveCharacters.length === 1) break
  }

  return aliveCharacters.length === 1 ? aliveCharacters[0] : null
}

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`)
  console.log('Доступные роуты:')
  console.log('POST /characters - создать персонажа')
  console.log('GET /characters - получить всех персонажей')
  console.log('GET /characters/:id - получить персонажа по ID')
  console.log('POST /characters/:id/equip - экипировать персонажа')
  console.log('PUT /characters/:id/equipment - сменить экипировку')
  console.log('POST /battle - начать бой')
  console.log('GET /battles - история боев')
})
