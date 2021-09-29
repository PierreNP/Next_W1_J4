class Attack {
  constructor(dmg, attacker) {
    this.dmg = dmg
    this.attacker = attacker
  }

  attack = (victim) => {
    victim.loseHp(this.dmg)
    this.deadCheck(victim)
  }

  kill = (victim) => {
    victim.loseHp(victim.hp)
    this.deadCheck(victim)
  }

  deadCheck = (victim) => {
    if (victim.hp < 1) {
      victim.status = "dead"
      this.attacker.getMana(20)
      console.log(`${victim.name} est dead (✞✞✞ RIP ✞✞✞), ${this.attacker.name} gagne 20 points de mana !`)
    }
    else {
      console.log(`${victim.name} est toujours vivant (${victim.hp} hp)`)
    }
  }
}

class SpecialAttack extends Attack {
  constructor(name, dmg, attacker, manaCost, heal) {
    super(dmg, attacker)
    this.name = name
    this.manaCost = manaCost
    this.heal = heal
  }

  attack = (victim) => {
    victim.loseHp(this.dmg)
    this.attacker.loseMana(this.manaCost)
    this.attacker.healHp(this.heal)
    this.deadCheck(victim)
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

  loseHp = (dmg) => {
    this.hp -= dmg
  }

  healHp = (healValue) => {
    this.hp += healValue
  }

  loseMana = (manaCost) => {
    this.mana -= manaCost
  }

  getMana = (manaPrize) => {
    this.mana += manaPrize
  }

  // Si jamais les PV d'un personnage tombent à 0, il est éliminé et ne peut plus jouer ni être attaqué. 

  launchAttack = (victim) => {
    if (this.hp > 0) {
      console.log(`A toi de jouer, ${this.name}`)
      try {
        this.chooseAttack(victim).attack(victim)
      } catch {
        console.log("Pas d'attaque pour ce coup-ci !")
      }
      // console.log(`L'attaque inflige ${this.dmg} points de dégât à ${victim.name}`)
      // victim.underAttack(this.dmg)
      // console.log(`Il reste à ${victim.name} ${victim.hp} pv après cette attaque`)
    }
  }

  chooseAttack = (victim) => {
    let chosenAttack = prompt(`${this.name}, quelle attaque veux-tu lancer sur ${victim.name} ? Tape 1 pour ton attaque classique, 2 pour ta spéciale ${this.specialAttack.name}`)
    while (chosenAttack != 1 || chosenAttack != 2 || chosenAttack == "forfeit") {
      if (chosenAttack == 1) {
        console.log(`Vous attaquez avec l'attaque classique`)
        return this.regularAttack
      }
      else if (chosenAttack == 2) {
        console.log(`Vous attaquez avec l'attaque speciale`)
        return this.specialAttack
      }
      else if (chosenAttack == "forfeit")
        break
      else {
        chosenAttack = prompt(`Tu sais lire ? Choisis un chiffre entre 1 et 2 steupl'. C'est dans tes cordes ?`)
      }
    }
  }


}

class Fighter extends Player {
  constructor(name, hp = 12, mana = 40, regularAttack, specialAttack) {
    super(name, hp, mana, regularAttack, specialAttack)
    this.regularAttack = new Attack(4, this)
    this.specialAttack = new SpecialAttack("Dark Vision", 5, this, 20, 0)

  }
  // Le Fighter aura une attaque spéciale Dark Vision, infligeant 5 dégâts. 
  // Jusqu'au prochain tour, chaque coup reçu lui infligera 2 dégâts de moins. Elle coute 20 mana.
}

class Paladin extends Player {
  constructor(name, hp = 16, mana = 160, regularAttack, specialAttack) {
    super(name, hp, mana, regularAttack, specialAttack)
    this.regularAttack = new Attack(3, this)
    this.specialAttack = new SpecialAttack("Healing Lighting", 4, this, 40, 5)

  }
  // Le Paladin aura une attaque spéciale Healing Lighting, 
  // infligeant 4 dégâts et le soignant de 5. Elle coute 40 mana.
}

class Monk extends Player {
  constructor(name, hp = 8, mana = 200, regularAttack, specialAttack) {
    super(name, hp, mana, regularAttack, specialAttack)
    this.regularAttack = new Attack(2, this)
    this.specialAttack = new SpecialAttack("Heal", 0, this, 25, 8)
  }
  // Le Monk, quand a lui, aura une attaque spéciale heal rendant 8 PV. Elle coute 25 mana.
}

class Berzerker extends Player {
  constructor(name, hp = 8, mana = 0, regularAttack, specialAttack) {
    super(name, hp, mana, regularAttack, specialAttack)
    this.regularAttack = new Attack(4, this)
    this.specialAttack = new SpecialAttack("Rage", 5, this, 0, -1)
  }

  // Le Berzerker aura une attaque spéciale Rage lui donnant +1 pour ses attaques pour tout le reste de la partie 
  // mais lui enlevant 1 hp. Elle coûte 0 mana. Elle peut être appelée plusieurs fois 
  // (par exemple, si le Berzerker a fait son attaque spéciale 2 fois, ses attaques infligeront 4 + 2 = 6 points de dégât).
}

class Assassin extends Player {
  constructor(name, hp = 6, mana = 20, regularAttack, specialAttack) {
    super(name, hp, mana, regularAttack, specialAttack)
    this.regularAttack = new Attack(6, this)
    this.specialAttack = new SpecialAttack("Shadow hit", 7, this, 20, 0)
  }
  // L'Assassin aura une attaque spéciale Shadow hit lui permettant d'infliger 7 dégâts 
  // et de ne pas prendre de dégâts lors du prochain tour. Cette attaque coûte 20 mana.
}
class Turn {
  constructor(alivePlayers) {
    this.alivePlayers = alivePlayers
  }

  startTurn = (turn) => {
    console.log('******************************************************************')
    console.log(`C'est le tour n°${turn}, soyez prêts !`)

    this.alivePlayers.forEach(attacker => {
      if (this.updateAlivePlayers().length < 2)
        return
      else
        attacker.launchAttack(this.alivePlayers[this.chooseVictim(attacker) - 1])
    })

    // this.alivePlayers[0].launchAttack(this.alivePlayers[this.chooseVictim()-1])

    // this.alivePlayers[1].launchAttack(this.alivePlayers[this.chooseVictim()-1])
    this.updateAlivePlayers()
    console.log(`C'est la fin du tour n°${turn}`)
    console.log('******************************************************************')
  }

  updateAlivePlayers = () => {
    return this.alivePlayers = this.alivePlayers.filter(player => player.hp > 0)
  }

  chooseVictim = (attacker) => {
    let choice = prompt(`${attacker.name}, quel joueur souhaites-tu attaquer ?`)
    return parseInt(choice)
  }
}

class Game {
  constructor(players) {
    this.turnLeft = 10
    this.status = "going"
    this.players = players
    this.alivePlayers = players
    this.deadPlayers = []
  }

  PlayGame = () => {
    while (this.status === "going") {
      this.newTurn()
    }
  }

  checkAlivePlayers = () => {
    let playersArray = [this.player1, this.player2]
    let alivePlayers = playersArray.filter(player => player.status === "playing")
    return alivePlayers
  }

  isGameOver = () => {
    if (this.turnLeft === 0) {
      this.status = "over"
      console.log(`Tous les tours ont été joués, le jeu est terminé`)
      console.log(`Les joueurs gagnants sont:`)
      this.alivePlayers.forEach(gagnant => console.log(`${gagnant.name} 🏆`))
    }
    else if (this.alivePlayers.length < 2) {
      this.status = "over"
      console.log(`Il ne reste plus que ${this.alivePlayers[0].name} en vie, le jeu est terminé`)
    }
  }

  newTurn = () => {
    this.isGameOver()
    if (this.status === "over") {
      return
    }
    console.log(`Il reste ${this.turnLeft} tours dans la partie`)
    console.log(`Voici les joueurs toujours en jeu`)
    this.alivePlayers.forEach(player => console.log(`${this.alivePlayers.indexOf(player) + 1} - ${player.name} (${player.hp} hp)`))
    let turn = new Turn(this.alivePlayers)
    turn.startTurn(this.turnLeft)
    this.alivePlayers = turn.alivePlayers
    this.turnLeft = this.turnLeft - 1
  }
}

const p1Fighter = new Fighter('Grace');
const p11Fighter = new Fighter('MichMich');
const p2Paladin = new Paladin('Ulder');
const p3Monk = new Monk('Moana');
const p4Berzeker = new Berzerker('Draven');
const p5Assassin = new Assassin('Carl');
const game1 = new Game([p1Fighter, p11Fighter])

// game1.PlayGame()