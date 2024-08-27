import {bonus} from './character.js'

class skill {
  constructor(name, type, bonus, info, buffTime=1, effect){
      this.name = name;
      this.type = type; // attack:0, buff:1
      this.bonus = new Array(buffTime).fill(bonus);
      this.info = info;
      this.effect = effect;
  }
}

const Monsters = {
  Panicked_Prisoner : {
    'status' : [
      '허둥대는 수감자', // name
      "지저분한 수감자는 아직 상황을 파악하지 못한채 허둥대고 있다.", // info
      100, 10, 0.5, 0, 0, 1, 0.5,
      // hp atk crit dodge combo acc escape
      [new skill('공격하기', 0, new bonus(),'정신없이 팔을 휘둘렀다.', 1),
        new skill('회피하기', 1, new bonus(),'허둥대고 있다.', 1)]  //skills
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
      [new skill('공격하기', 0, new bonus(),'오른팔을 거칠게 들었다.', 1),
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