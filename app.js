class Attack {
  constructor(dmg) {
    this.dmg = dmg
  }

  underAttack = (victim, dmg) => {
    victim.loseHp(dmg)
  }

  loseHp = (dmg) => {
    this.hp -= dmg
  }

  attack = (victim) => {
    victim.underAttack(this.dmg)
  }
}

// // si on choisit regular attack
// player1.Attack.attack(player2)
// // si on choisit special attack
// player1.SpecialAttack.attack(player2)

class SpecialAttack extends Attack {
  constructor(name, dmg, manaCost, heal) {
    super(dmg)
    this.name = name
    this.manaCost = manaCost
    this.heal = heal
  }

  underAttack = (dmg) => {
    this.loseHp(dmg)
  }

  loseMana = (attacker) => attacker.mana -= manaCost
  getHeal = (attacker) => attacker.hp += heal

  attack = (attacker, victim) => {
    victim.underAttack(this.dmg)
    getHeal(attacker)
    loseMana(attacker)
  }
}

class Player {
  constructor(name, hp, mana, regularAttack, specialAttack) {
    this.name = name
    this.hp = hp
    this.mana = mana
    this.regularAttack = regularAttack
    this.specialAttack = specialAttack
    this.status = "playing"
  }

  underAttack = (nbDmgToReceive) => {
    // console.log(`dmgs à recevoir = ${nbDmgToReceive}`)

    this.hp = this.hp - nbDmgToReceive

    if (this.hp <= 0) {
      this.status = "lost"
    }
    // Si jamais les PV d'un personnage tombent à 0, il est éliminé et ne peut plus jouer ni être attaqué. 
    // Son statut passe alors à loser. Lorsqu'un personnage en tue un autre, il regagne 20 point de mana.
  }

  attack = (victim) => {
    if (this.hp > 0) {
      console.log(`A toi de jouer, ${this.name}`)
      let chosenAttack = prompt(`Quelle attaque veux-tu lancer ? Tape 1 pour l'attaque classique, 2 pour l'attaque spéciale`)
      if (chosenAttack === 1) {
        victim.underAttack(this.regularAttack.dmg)
      }
      else if (chosenAttack === 2) {
        victim.underAttack(this.regularAttack.dmg)
      }

      console.log(`Vous attaquez avec l'attaque ${chosenAttack}`)
      console.log(`L'attaque inflige ${this.dmg} points de dégât à ${victim.name}`)
      victim.underAttack(this.dmg)
      console.log(`Il reste à ${victim.name} ${victim.hp} pv après cette attaque`)
    }
  }
}

class Fighter extends Player {
  constructor(name, hp = 12, mana = 40, regularAttack = new Attack(4), specialAttack = new SpecialAttack("Dark Vision", 5, 20)) {
    super(name, hp, mana, regularAttack, specialAttack)

  }
  // Le Fighter aura une attaque spéciale Dark Vision, infligeant 5 dégâts. 
  // Jusqu'au prochain tour, chaque coup reçu lui infligera 2 dégâts de moins. Elle coute 20 mana.
}

class Paladin extends Player {
  constructor(name, hp = 16, dmg = 3, mana = 160) {
    super(name, hp, dmg, mana, status)
  }
  // Le Paladin aura une attaque spéciale Healing Lighting, 
  // infligeant 4 dégâts et le soignant de 5. Elle coute 40 mana.
}

class Monk extends Player {
  constructor(name, hp = 8, dmg = 2, mana = 200) {
    super(name, hp, dmg, mana, status)
  }
  // Le Monk, quand a lui, aura une attaque spéciale heal rendant 8 PV. Elle coute 25 mana.
}

class Berzerker extends Player {
  constructor(name, hp = 8, dmg = 4, mana = 0) {
    super(name, hp, dmg, mana, status)
  }

  // Le Berzerker aura une attaque spéciale Rage lui donnant +1 pour ses attaques pour tout le reste de la partie 
  // mais lui enlevant 1 hp. Elle coûte 0 mana. Elle peut être appelée plusieurs fois 
  // (par exemple, si le Berzerker a fait son attaque spéciale 2 fois, ses attaques infligeront 4 + 2 = 6 points de dégât).
}

class Assassin extends Player {
  constructor(name, hp = 6, dmg = 6, mana = 20) {
    super(name, hp, dmg, mana, status)

  }
  // L'Assassin aura une attaque spéciale Shadow hit lui permettant d'infliger 7 dégâts 
  // et de ne pas prendre de dégâts lors du prochain tour. Cette attaque coûte 20 mana.
}

class Turn {
  constructor(player1, player2) {
    this.player1 = player1
    this.player2 = player2
  }

  startTurn = (turn) => {
    console.log('******************************************************************')
    console.log(`C'est le tour n°${turn}, soyez prêts !`)
    this.player1.attack(this.player2)
    this.player2.attack(this.player1)
    console.log(`C'est la fin du tour n°${turn}`)
    console.log('******************************************************************')
  }
}

class Game {
  constructor(player1, player2) {
    this.turnLeft = 10
    this.status = "going"
    this.player1 = player1
    this.player2 = player2
  }

  PlayGame = () => {
    while (this.status === "going") {
      this.newTurn()
      this.isGameOver()
    }
    console.log(`Je te dis que le jeu est vraiment terminé`)
  }

  alivePlayers = () => {
    let playersArray = [this.player1, this.player2]
    let alivePlayers = playersArray.filter(player => player.status === "playing")
    return alivePlayers
  }

  isGameOver = () => {
    if (this.turnLeft === 0) {
      this.status = "over"
      console.log(`Tous les tours ont été joués, le jeu est terminé`)
    }
    else if (this.alivePlayers().length < 2) {
      this.status = "over"
      console.log(`Il ne reste plus que ${this.alivePlayers()[0].name} en vie, le jeu est terminé`)
    }
  }

  newTurn = () => {
    console.log(this.player1)
    console.log(this.player2)
    let turn = new Turn(this.player1, this.player2).startTurn(this.turnLeft)
    this.turnLeft = this.turnLeft - 1
    console.log(`Il reste ${this.turnLeft} tours dans la partie`)
  }
}

const p1Fighter = new Fighter('Grace');
const p2Paladin = new Paladin('Ulder');
const p3Monk = new Monk('Moana');
const p4Berzeker = new Berzerker('Draven');
const p5Assassin = new Assassin('Carl');
const game1 = new Game(p1Fighter, p2Paladin)

// game1.PlayGame()