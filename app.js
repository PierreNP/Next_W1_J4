class SpecialAttack {
  constructor(name, dmg, manaCost, hp) {
    this.dmg = dmg
    this.manaCost = manaCost
    this.hp = hp
    this.name = name
  }

  benefits = () => {

  }

  results = (victim) => {

  }

}

class Player {
  constructor(name, hp, dmg, mana, status = "playing") {
    this.hp = hp;
    this.dmg = dmg;
    this.mana = mana;
    this.name = name
    this.status = status
  }

  takeDamage = (nbDmgToReceive) => {
    // console.log(`this.hp (avant de recevoir les dégâts) = ${this.hp}`)
    // console.log(`dmgs à recevoir = ${nbDmgToReceive}`)

    this.hp = this.hp - nbDmgToReceive
    // console.log(`this.hp (après l'attaque) = ${this.hp}`)

    if (this.hp <= 0) {
      this.status = "lost"
    }
    // Si jamais les PV d'un personnage tombent à 0, il est éliminé et ne peut plus jouer ni être attaqué. 
    // Son statut passe alors à loser. Lorsqu'un personnage en tue un autre, il regagne 20 point de mana.
  }

  attack = (victim) => {
    victim.takeDamage(this.dmg)

  }
}

class Fighter extends Player {
  constructor(name, hp = 12, dmg = 4, mana = 40, status = "Playing") {
    super(name, hp, dmg, mana, status)
  }
  // Le Fighter aura une attaque spéciale Dark Vision, infligeant 5 dégâts. 
  // Jusqu'au prochain tour, chaque coup reçu lui infligera 2 dégâts de moins. Elle coute 20 mana.
}

class Paladin extends Player {
  constructor(name, hp = 16, dmg = 3, mana = 160, status = "Playing") {
    super(name, hp, dmg, mana, status)
  }
  // Le Paladin aura une attaque spéciale Healing Lighting, 
  // infligeant 4 dégâts et le soignant de 5. Elle coute 40 mana.
}

class Monk extends Player {
  constructor(name, hp = 8, dmg = 2, mana = 200, status = "Playing") {
    super(name, hp, dmg, mana, status)
  }
  // Le Monk, quand a lui, aura une attaque spéciale heal rendant 8 PV. Elle coute 25 mana.
}

class Berzerker extends Player {
  constructor(name, hp = 8, dmg = 4, mana = 0, status = "Playing") {
    super(name, hp, dmg, mana, status)
  }

  // Le Berzerker aura une attaque spéciale Rage lui donnant +1 pour ses attaques pour tout le reste de la partie 
  // mais lui enlevant 1 hp. Elle coûte 0 mana. Elle peut être appelée plusieurs fois 
  // (par exemple, si le Berzerker a fait son attaque spéciale 2 fois, ses attaques infligeront 4 + 2 = 6 points de dégât).
}

class Assassin extends Player {
  constructor(name, hp = 6, dmg = 6, mana = 20, status = "Playing") {
    super(name, hp, dmg, mana, status)

  }
  // L'Assassin aura une attaque spéciale Shadow hit lui permettant d'infliger 7 dégâts 
  // et de ne pas prendre de dégâts lors du prochain tour. Cette attaque coûte 20 mana.
}

const p1Fighter = new Fighter('Grace');
const p2Paladin = new Paladin('Ulder');
const p3Monk = new Monk('Moana');
const p4Berzeker = new Berzerker('Draven');
const p5Assassin = new Assassin('Carl');

class Turn {
  constructor(player1, player2) {
    this.player1 = player1
    this.player2 = player2
  }

  startTurn = (turn) => {
    console.log(`C'est le tour n°${turn}, soyez prêts !`)
    console.log(`A toi de jouer, ${this.player1.name} (${this.player1.hp} pv)`)
    console.log(`${this.player2.name} va recevoir l'attaque (${this.player2.hp} pv)`)

    this.player1.attack(this.player2)
    console.log(`${this.player1.name} inflige à ${this.player2.name} ${this.player1.dmg} points de dégâts`)
    console.log(`Il reste à ${this.player2.name} ${this.player2.hp} points de vie`)
    console.log(`A toi de jouer, ${this.player2.name} (${this.player2.hp} pv)`)
    this.player2.attack(this.player1)
    console.log(`${this.player2.name} inflige à ${this.player1.name} ${this.player2.dmg} points de dégâts`)
    console.log(`Il reste à ${this.player1.name} ${this.player1.hp} points de vie`)
  }
}

class Game {
  constructor(player1, player2) {
    this.turnLeft = 10
    this.player1 = player1
    this.player2 = player2
  }

  newTurn = () => {
    console.log(this.player1)
    console.log(this.player2)

    let turn = new Turn(this.player1, this.player2).startTurn(this.turnLeft)
    this.turnLeft = this.turnLeft - 1
    console.log(`Il reste ${this.turnLeft} tours dans la partie`)
  }
}

const game1 = new Game(p1Fighter, p2Paladin)


