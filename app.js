class Attack {
  constructor(dmg, attacker) {
    this.dmg = dmg
    this.attacker = attacker
  }

  attack = (victim) => {
    if (this.attacker.isPoisoned === true) {
      this.attacker.loseHp(2)
      console.log(`${this.attacker.name} perd 2hp à cause du poison`)
    }
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
      console.log(`${victim.name} est dead (RIP ✝️☠️), ${this.attacker.name} gagne 20 points de mana !`)
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
    if (this.attacker.isPoisoned === true) {
      this.attacker.loseHp(2)
      console.log(`${this.attacker.name} perd 2hp à cause du poison`)
    }
    victim.loseHp(this.dmg)
    this.attacker.loseMana(this.manaCost)
    this.attacker.healHp(this.heal)
    this.attacker.updateRegularAttack()
    this.attacker.poisonEffect(victim)
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
    this.thisTurnSpecial = false
    this.previousTurnSpecial = false
    this.isPoisoned = false
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
    this.previousTurnSpecial = this.thisTurnSpecial
    console.log(`A toi de jouer, ${this.name}`)
    console.log(`Avant l'attaque, ${this.name} compte ${this.mana} points mana`)
    this.chooseAttack(victim).attack(victim)
    console.log(`Après l'attaque, il reste a ${this.name} ${this.mana} points mana`)
  }

  chooseAttack = (victim) => {
    let chosenAttack = prompt(`${this.name}, quelle attaque veux-tu lancer sur ${victim.name} ? Tape 1 pour ton attaque classique, 2 pour ta spéciale ${this.specialAttack.name}`)
    while (chosenAttack != 1 || chosenAttack != 2 || chosenAttack == "forfeit") {
      if (chosenAttack == 1) {
        console.log(`Vous attaquez ${victim.name} avec l'attaque classique (${this.regularAttack.dmg} dmg)`)
        this.thisTurnSpecial = false
        return this.regularAttack
      }
      else if (chosenAttack == 2) {
        if (this.mana >= this.specialAttack.manaCost) {
          console.log(`Vous attaquez avec l'attaque speciale (${this.specialAttack.dmg} dmg)`)

          this.thisTurnSpecial = true
          return this.specialAttack
        } else {
          console.log("Vous n'avez pas assez de mana pour lancer l'attaque spéciale... Ca sera l'attaque classique du coup !")
          return this.regularAttack
        }
      }
      else if (chosenAttack == "forfeit")
        break
      else {
        chosenAttack = prompt(`Tu sais lire ? Choisis un chiffre entre 1 et 2 steupl'. C'est dans tes cordes ?`)
      }
    }
  }

  updateRegularAttack = () => {

  }

  poisonEffect = (victim) => {
    
  }
}

class Fighter extends Player {
  constructor(name, hp = 12, mana = 40, regularAttack, specialAttack) {
    super(name, hp, mana, regularAttack, specialAttack)
    this.regularAttack = new Attack(4, this)
    this.specialAttack = new SpecialAttack("Dark Vision", 5, this, 20, 0)
  }
  // Jusqu'au prochain tour, chaque coup reçu lui infligera 2 dégâts de moins. Elle coute 20 mana

  loseHp = (dmg) => {
    if (this.thisTurnSpecial === true) {
      this.hp -= dmg - 2
    }
    else {
      this.hp -= dmg
    }
  }

}

class Paladin extends Player {
  constructor(name, hp = 16, mana = 160, regularAttack, specialAttack) {
    super(name, hp, mana, regularAttack, specialAttack)
    this.regularAttack = new Attack(3, this)
    this.specialAttack = new SpecialAttack("Healing Lighting", 4, this, 40, 5)
  }
}

class Monk extends Player {
  constructor(name, hp = 8, mana = 200, regularAttack, specialAttack) {
    super(name, hp, mana, regularAttack, specialAttack)
    this.regularAttack = new Attack(2, this)
    this.specialAttack = new SpecialAttack("Heal", 0, this, 25, 8)
  }
}

class Wizard extends Player {
  constructor(name, hp = 10, mana = 200, regularAttack, specialAttack) {
    super(name, hp, mana, regularAttack, specialAttack)
    this.regularAttack = new Attack(2, this)
    this.specialAttack = new SpecialAttack("Fireball", 7, this, 25, 0)
  }
}

class Witch extends Player {
  constructor(name, hp = 10, mana = 100, regularAttack, specialAttack) {
    super(name, hp, mana, regularAttack, specialAttack)
    this.regularAttack = new Attack(2, this)
    this.specialAttack = new SpecialAttack("Poison", 2, this, 50, 0)
  }

  poisonEffect = (victim) => {
    victim.isPoisoned = true
  }
}

class Berzerker extends Player {
  constructor(name, hp = 8, mana = 0, regularAttack, specialAttack) {
    super(name, hp, mana, regularAttack, specialAttack)
    this.regularAttack = new Attack(4, this)
    this.specialAttack = new SpecialAttack("Rage", 0, this, 0, -1)
  }

  updateRegularAttack = () => {
    this.regularAttack.dmg += 1
  }
}

class Assassin extends Player {
  constructor(name, hp = 6, mana = 20, regularAttack, specialAttack) {
    super(name, hp, mana, regularAttack, specialAttack)
    this.regularAttack = new Attack(6, this)
    this.specialAttack = new SpecialAttack("Shadow hit", 7, this, 20, 0)
  }
  // L'Assassin aura une attaque spéciale Shadow hit lui permettant d'infliger 7 dégâts 
  // et de ne pas prendre de dégâts lors du prochain tour. Cette attaque coûte 20 mana.

  loseHp = (dmg) => {
    if (this.previousTurnSpecial === true) {
      console.log(`${this.name} est protégé car il a utilisé son attaque spéciale au dernier tour ! Il ne perd donc pas de hp`)
    }
    else {
      this.hp -= dmg
    }
  }


}
class Turn {
  constructor(alivePlayers) {
    this.alivePlayers = alivePlayers
  }

  startTurn = (turn) => {
    console.log('******************************************************************')
    console.log(`C'est le tour n°${turn}, soyez prêts !`)

    this.alivePlayers.forEach(attacker => {
      if ((this.updateAlivePlayers().length < 2) || (attacker.hp < 1))
        return
      else {
        attacker.launchAttack(this.alivePlayers[this.chooseVictim(attacker) - 1])
      }
    })
    this.updateAlivePlayers()
    console.log(`C'est la fin du tour n°${turn}`)
    console.log('******************************************************************')
  }

  updateAlivePlayers = () => {
    this.alivePlayers.forEach(player => player.previousTurnSpecial = player.thisTurnSpecial)
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

  playGame = () => {
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
    else if (this.alivePlayers.length === 1) {
      this.status = "over"
      console.log(`Il ne reste plus que ${this.alivePlayers[0].name} en vie, le jeu est terminé`)
    }
    else if (this.alivePlayers.length === 0) {
      this.status = "over"
      console.log(`Tout le monde est mort, c'est une hécatombe, le jeu est terminé`)
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
const p6Wizard = new Wizard('Gandolf');
const p7Witch = new Witch('Scarlet');
const game1 = new Game([p1Fighter, p2Paladin, p7Witch])

// game1.playGame()