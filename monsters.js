import chalk from 'chalk';

class bonus {
  constructor(atk=0, crit=0, dodge=0, acc=0, combo=0){
    this.bonus = {
      'atk' : atk,
      'crit' : crit,
      'dodge' : dodge,
      'acc' : acc,
      'combo' : combo
    }
  }
}

class skill {
  constructor(name, type, bonus, info){
    this.name = name;
    this.type = type; // attack:0, buff:1
    this.bonus = bonus;
    this.info = info;
  }
}

class default_additional_stutas{
}

export class Character {
    constructor(
      name='이름', 
      info="알 수 없음.",
      hp=100,
      attack_damage = 10,
      crit_chance = 0.5,
      dodge_chance = 0,
      combo_chance = 0,
      accuracy =1,
      escape_chance = 0.5,
      skills = []
    ) {
      // 캐릭터 스테이터스
      this.name = name;
      this.info = info;
      this.hp = hp;
      this.attack_damage = attack_damage;
      this.crit_chance = crit_chance;
      this.dodge_chance = dodge_chance;
      this.combo_chance = combo_chance;
      this.accuracy = accuracy;
      this.escape_chance = escape_chance;
      // 행동 처리
      this.skills = skills
      this._dodge_ready = false;
      this._buff_stack = [new bonus()];
    }

    // 공격 행동 처리, 결과를 텍스트로 반환
    attack(enemy) {
      let result = '';
      let bonus = this._buff_stack[0].bonus
      
      // 공격 명중 판정
      if(enemy.dodge(this.accuracy+bonus.acc))
        result = chalk.green(`(은)는 공격을 피했다.`);
      // 데미지 계산 및 처리
      else{
        let crit = Math.random() < (this.crit_chance+bonus.crit) ? true : false // 치명타 판정
        let damage = (Math.floor(this.attack_damage*(bonus.atk+1))) * (crit ? 2 : 1); // 데미지 계산
  
        enemy.hp -= damage;
        result = chalk.green(`(은)는 ${chalk.magentaBright(damage)}의 피해를 입었다.`);
        if(crit) result += chalk.red(" 치명타!")
      }
      
      return result
    }

    //회피 판정
    dodge(atk_acc) {
      let hit = atk_acc - this.dodge_chance * this._dodge_ready
      this._dodge_ready = false;
      return  Math.random() < hit ? false : true;
    }

    // 버프 추가 및 중첩
    add_buff(buff_stack){
      // 버프 중첩을 위해 받을 stack 수와 같게 남은 스텍 수를 맞춰줌.
      while(buff_stack.length > this._buff_stack)
        this._buff_stack.push(new bonus());
      
      // 버프 중첩
      buff_stack.array.forEach((bonus,idx) => {
        for (const [key, value] of Object.entries(bonus)) {
          this._buff_stack[key] += value;
        }
      });
    }
    
    // 버프 제거
    decrease_buff(){
      this._buff_stack.pop()
      if(!(this._buff_stack.length))
        this._buff_stack.push(new bonus())
    }

    pattern_execute(type, target, done) {
      switch (type){
        case 0 :
          return this.attack(target);
        case 1 :
          break;
        default :
          return "Not correct pattern type"
      }
    }
    
    //Player만 이용하는 기능
    escape() {
      return  Math.random() < this.escape_chance ? true : false
    }

    dodge_ready(){
      this._dodge_ready = true;
      return `${this.name}(은)는 회피 자세를 취했다.`
    }
}

export const Monsters = {
  Panicked_Prisoner : {
    'status' : [
      '허둥되는 수감자', // name
      "알 수 지저분한 수감자는 아직 상황을 파악하지 못한채 허둥되고 있다.", // info
      100, 10, 0.5, 0, 0, 1, 0.5,
      // hp atk crit dodge combo acc escape
      [new skill('공격하기', 0, new bonus(),'오른팔을 거칠게 들었다.'),
        new skill('회피하기', 1, new bonus({dodge:90}),'회피 자세를 취했다.')]  //skills
    ]
  }
}

export const players = {
  default : {
    'status' : [
      '이름', // name
      "알 수 없음.", // info
      100, 10, 0.5, 0, 0, 1, 0.5,
      //hp atk crit dodge combo acc escape
      [new skill('공격하기', 0, new bonus(), '오른팔을 거칠게 들었다.'),
      new skill('회피하기', 1, new bonus({dodge:90}), '회피 자세를 취했다.')]  //skills
    ]
  },
  Highwayman : {
    'status' : [
      '강도', // name
      "알 수 없음.", // info
      100, 10, 0.5, 0, 0, 1, 0.5,
      // hp atk crit dodge combo acc escape
      [new skill('공격하기', 0, new bonus(),'오른팔을 거칠게 들었다.'),
        new skill('회피하기', 1, new bonus({dodge:90}),'회피 자세를 취했다.')]  //skills
    ]
  }
}