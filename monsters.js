import chalk from 'chalk';

class default_bonus {
  constructor(atk=1, crit=0, dodge=0, acc=0, combo=0){
    this.atk = atk;
    this.crit = crit;
    this.dodge = dodge;
    this.acc = acc;
    this.combo = combo;
  }
}

class default_additional_stutas{
}

export class Character {
    constructor(name='이름', info="알 수 없음.") {
      // 캐릭터 스테이터스
      this.name = name
      this.info = info
      this.hp = 100;
      this.attack_damage = 10;
      this.crit_chance = 0.5;
      this.dodge_chance = 0.9;
      this.combo_chance = 0;
      this.accuracy = 1;
      this.escape_chance = 0.5;
      // 행동 처리
      this._dodge_ready = false;
      // this.pattern = pattern;
      // this.encount_stage = encount_stage;
      this._buff_stack = [new default_bonus()];
    }

    // 공격 행동 처리, 결과를 텍스트로 반환
    attack(enemy) {
      let result = '';
      let bonus = this._buff_stack[0]
      
      // 공격 명중 판정
      if(enemy.dodge(this.accuracy+bonus.acc))
        result = chalk.green(`(은)는 공격을 피했다.`);
      // 데미지 계산 및 처리
      else{
        let crit = Math.random() < (this.crit_chance+bonus.crit) ? true : false // 치명타 판정
        let damage = (Math.floor(this.attack_damage*bonus.atk)) * (crit ? 2 : 1); // 데미지 계산
  
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
      this._buff_stack.push(buff)
    }
    
    // 버프 제거
    decrease_buff(){
      this._buff_stack.pop()
      if(!(this._buff_stack.length))
        this._buff_stack.push(new default_bonus())
    }

    pattern_execute(type, data) {
      switch (type){
        case 1 :
          return this.attack(...data);
        case 2 :
          return data
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
  Panicked_Prisoner : ["허둥되는 수감자", "지저분한 수감자는 아직 상황을 파악하지 못한채 허둥되고 있다."]
  // Panicked_Prisoner : {name:"허둥되는 수감자", info:"지저분한 수감자는 아직 상황을 파악하지 못한채 허둥되고 있다."}
}