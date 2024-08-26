import chalk from 'chalk';

class bonus {
  constructor(atk=0, crit=0, dodge=0, acc=0, combo=0){
    this.atk = atk;
    this.crit = crit;
    this.dodge = dodge;
    this.acc = acc;
    this.combo = combo;
  }
}

class skill {
  constructor(name, type, bonus, info, buffTime=2, effect){
    this.name = name;
    this.type = type; // attack:0, buff:1
    this.bonus = new Array(buffTime).fill(bonus);
    this.info = info;
    this.effect = effect;
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
      this._buff_stack = [new bonus()];
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
        let damage = (Math.floor(this.attack_damage*(bonus.atk+1))) * (crit ? 2 : 1); // 데미지 계산
  
        enemy.hp -= damage;
        result = chalk.green(`(은)는 ${chalk.magentaBright(damage)}의 피해를 입었다.`);
        if(crit) result += chalk.red(" 치명타!")

        //버프 동작 테스트
        result += chalk.yellow('('+Object.values(bonus).join(',')+')')
      }
      
      return result
    }

    //회피 판정
    dodge(atk_acc) {
      const bonus = this._buff_stack[0]
      const hit = atk_acc - (this.dodge_chance + bonus.dodge)
      return  Math.random() < hit ? false : true;
    }

    // 버프 추가 및 중첩
    add_buff(buff_stack){
      // 버프 중첩을 위해 받을 stack 수와 같게 남은 스텍 수를 맞춰줌.
      while(buff_stack.length > this._buff_stack)
        this._buff_stack.push(new bonus());
      
      // 버프 중첩
      buff_stack.forEach((bonus) => {
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

const Monsters = {
  Panicked_Prisoner : {
    'status' : [
      '허둥되는 수감자', // name
      "지저분한 수감자는 아직 상황을 파악하지 못한채 허둥대고 있다.", // info
      100, 10, 0.5, 0, 0, 1, 0.5,
      // hp atk crit dodge combo acc escape
      [new skill('공격하기', 0, new bonus(),'오른팔을 거칠게 들었다.'),
        new skill('회피하기', 1, new bonus(0,0,0.9,0,0),'회피 자세를 취했다.', 2)]  //skills
    ]
  },
  Madman : {
    'status' : [
      '미치광이', // name
      "중얼거리는 비쩍마른 남자가 서있다. 입을 틀어막은 손 사이로 알 수 없는 말이 흘러나온다.", // info
      100, 10, 0.5, 0, 0, 1, 0.5,
      // hp atk crit dodge combo acc escape
      [new skill('공격하기', 0, new bonus(),'오른팔을 거칠게 들었다.'),
        new skill('회피하기', 1, new bonus(0,0,0.9,0,0),'회피 자세를 취했다.')]  //skills
    ]
  },
  Rabble : {
    'status' : [
      '폭도', // name
      "잔득 분노한 폭도가 몽둥이를 든 채 걸어오고 있다. 밖에 무슨 일이 일어난거지?", // info
      100, 10, 0.5, 0, 0, 1, 0.5,
      //hp atk crit dodge combo acc escape
      [new skill('공격하기', 0, new bonus(), '오른팔을 거칠게 들었다.'),
      new skill('회피하기', 1, new bonus(0,0,90,0,0), '회피 자세를 취했다.')]  //skills
    ]
  },
  Brawler : {
    'status' : [
      '싸움꾼', // name
      "이 감옥에서 유명한 싸움꾼. 마구 싸울 수 있는 이 혼란에 기분 좋아 보인다.", // info
      100, 10, 0.5, 0, 0, 1, 0.5,
      //hp atk crit dodge combo acc escape
      [new skill('부러뜨리기', 0, new bonus(), '내 팔을 거칠게 잡았다.'),
      new skill('회피하기', 1, new bonus(0,0,90,0,0), '회피 자세를 취했다.')]  //skills
    ]
  },
  Political_Prisoner : {
    'status' : [
      '정치범', // name
      "밖에 혁명과 관련 있는 인물, 전투는 하지 않고 스토리 내용을 넌지시 던진다.", // info
      100, 10, 0.5, 0, 0, 1, 0.5,
      //hp atk crit dodge combo acc escape
      [new skill('공격하기', 0, new bonus(), '오른팔을 거칠게 들었다.'),
      new skill('회피하기', 1, new bonus(0,0,90,0,0), '회피 자세를 취했다.')]  //skills
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
      new skill('회피하기', 1, new bonus(0,0,90,0,0), '회피 자세를 취했다.')]  //skills
    ]
  },
  Highwayman : {
    'status' : [
      '강도', // name
      "뺏는 것말곤 할 줄아는 게 없는 자다. 그 손에선 무엇도 태어나지 않는다.", // info
      100, 10, 0.5, 0, 0, 1, 0.5,
      // hp atk crit dodge combo acc escape
      [new skill('공격하기', 0, new bonus(),'오른팔을 거칠게 들었다.'),
        new skill('회피하기', 1, new bonus(0,0,0.9,0,0),'회피 자세를 취했다.',2)]  //skills
    ]
  },
  QuackDoctor : {
    'status' : [
      '야매 의사', // name
      "살린 사람보다 죽인 사람이 더 많은 자다. 살인자라는 칭호가 차라리 어울린다.", // info
      100, 10, 0.5, 0, 0, 1, 0.5,
      // hp atk crit dodge combo acc escape
      [new skill('공격하기', 0, new bonus(),'오른팔을 거칠게 들었다.'),
        new skill('회피하기', 1, new bonus(0,0,90,0,0),'회피 자세를 취했다.'), 2]  //skills
    ]
  },
  Pickpocket : {
    'status' : [
      '소매치기', // name
      "폭동으로 혼란스러운 지금도 훔칠 물건을 찾고 있다.", // info
      100, 10, 0.5, 0, 0, 1, 0.5,
      // hp atk crit dodge combo acc escape
      [new skill('공격하기', 0, new bonus(),'오른팔을 거칠게 들었다.'),
        new skill('회피하기', 1, new bonus(0,0,90,0,0),'회피 자세를 취했다.', 2)]  //skills
    ]
  }
}

// Monsters Array destructuring
const [Panicked_Prisoner, Rabble, Madman, Political_Prisoner, Brawler] = Object.values(Monsters)

// 몬스터 등장 풀
export const encountPool = {
  '1' : [Panicked_Prisoner],
  '2' : [Panicked_Prisoner, Rabble],
  '3' : [Panicked_Prisoner, Rabble, Madman],
  '4' : [Panicked_Prisoner, Rabble, Madman, Political_Prisoner],
  '5' : [Panicked_Prisoner, Rabble, Madman, Political_Prisoner],
  '6' : [Panicked_Prisoner, Rabble, Madman, Political_Prisoner],
  '7' : [Panicked_Prisoner, Rabble, Madman, Political_Prisoner],
  '8' : [Panicked_Prisoner, Rabble],
  '9' : [Brawler],
  '10' : [Brawler]
}