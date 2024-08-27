import {bonus} from './character.js'

class skill {
  constructor(name, type, bonus, info, buffTime=1, target=0, effect={}){
      this.name = name;
      this.type = type; // attack:0, buff:1
      this.bonus = new Array(buffTime).fill(bonus);
      this.info = info;
      this.target = target; // self:0, enemy:1
      this.effect = effect;
  }
}

const Enemies = {
  Panicked_Prisoner : {
    'status' : [
      '허둥대는 수감자', // name
      "지저분한 수감자는 아직 상황을 파악하지 못한채 허둥대고 있다.", // info
      80, 8, 0, 0, 0, 1, 0,
      // hp atk crit dodge combo acc escape
      [new skill('붕붕', 0, new bonus(0,0,0,-0.1,0),'정신없이 팔을 휘둘렀다. 피하기 쉬워보인다.', 1),
        new skill('허둥대기', 1, new bonus(0,1,0,0,0),'허둥대고 있다. 때리기 쉬워보인다.', 1, 1)]  //skills
    ]
  },
  Madman : {
    'status' : [
      '미치광이', // name
      "중얼거리는 비쩍마른 남자가 서있다. 입을 틀어막은 손 사이로 알 수 없는 말이 흘러나온다.", // info
      60, 10, 0.05, 0.1, 0, 1, 0,
      // hp atk crit dodge combo acc escape
      [new skill('밀치기', 0, new bonus(-0.4,0.3,0,0,0),'나를 강하게 거부하며 밀어내려한다.'),
        new skill('미친짓1', 0, new bonus(0.2,0,0,0,0),'\"쇠창살은 부서지고, 머리들은 구르지! 누구의 머리부터일까!?\"'),
        new skill('미친짓2', 1, new bonus(0,0,0.8,0,0),'\"문이 열렸어... 피, 피로 물들어! 자유가 온다, 하하!\"'),
        new skill('미친짓3', 1, new bonus(0,0,0,0,0.6),'\"하얀 깃발이 펄럭거려... 우리를 구하러? 아니면 죽이러?\"',3,1)]  //skills
    ]
  },
  Rabble : {
    'status' : [
      '폭도', // name
      "잔득 분노한 폭도가 몽둥이를 든 채 걸어오고 있다. 밖에 무슨 일이 일어난거지?", // info
      100, 10, 0.5, 0, 0, 1, 0.5,
      //hp atk crit dodge combo acc escape
      [new skill('공격하기1', 0, new bonus(), '\"우린 너희를 위해 싸운게 아니야!\" 몽둥이를 높게 들었다.'),
      new skill('공격하기2', 0, new bonus(), '\"쓰레기는 우리와 함께할 자격 없어!\" 몽둥이를 높게 들었다.'),
      new skill('폭동 권유1', 1, new bonus(0,0,0.7,0,0), '\"바스티유는 무너졌다! 누구도 이제 억압당하지 않는다!\"',3,1),
      new skill('폭동 권유2', 1, new bonus(0.5,0,0,0,0), '\"자유를 위해 싸워라! 왕정의 쇠사슬을 부숴라!\"',3,1)]  //skills
    ]
  },
  Brawler : {
    'status' : [
      '싸움꾼', // name
      "이 감옥에서 유명한 싸움꾼. 싸울 수 있는 이 혼란에 기분 좋아 보인다.", // info
      100, 10, 0.5, 0, 0, 1, 0.5,
      //hp atk crit dodge combo acc escape
      [new skill('부러뜨리기', 0, new bonus(), '내 팔을 거칠게 잡았다.'),
      new skill('회피하기', 1, new bonus(0,0,90,0,0), '회피 자세를 취했다.')]  //skills
    ]
  },
  Political_Prisoner : {
    'status' : [
      '정치범', // name
      "수척하지만 그 눈빛은 결의로 가득하다. 이 상황에 크게 흥분되는 듯 주먹을 쥐고 있다.", // info
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
      100, 20, 0, 0, 0, 1, 0.1,
      // hp atk crit dodge combo acc escape
      [new skill('공격하기', 0, new bonus(),'오른팔을 거칠게 들었다.', 1),
        new skill('회피하기', 1, new bonus(0,0,0.8,0,0),'회피 자세를 취했다.',2)]  //skills
    ]
  },
  QuackDoctor : {
    'status' : [
      '야매 의사', // name
      "살린 사람보다 죽인 사람이 더 많은 자다. 살인자라는 칭호가 차라리 어울린다.", // info
      100, 10, 0.5, 0, 0, 1, 0.2,
      // hp atk crit dodge combo acc escape
      [new skill('공격하기', 0, new bonus(),'오른팔을 거칠게 들었다.'),
        new skill('회피하기', 1, new bonus(0,0,0.8,0,0),'회피 자세를 취했다.'), 2]  //skills
    ]
  },
  Pickpocket : {
    'status' : [
      '소매치기', // name
      "폭동으로 혼란스러운 지금도 훔칠 물건을 찾고 있다.", // info
      100, 10, 0.5, 0, 0, 1, 0.4,
      // hp atk crit dodge combo acc escape
      [new skill('공격하기', 0, new bonus(),'오른팔을 거칠게 들었다.'),
        new skill('회피하기', 1, new bonus(0,0,0.8,0,0),'회피 자세를 취했다.', 2)]  //skills
    ]
  }
}

// Monsters Array destructuring
const [Panicked_Prisoner, Rabble, Madman, Political_Prisoner, Brawler] = Object.values(Enemies)

// 몬스터 등장 풀
export const encountPool = {
  '1' : [Panicked_Prisoner],
  '2' : [Panicked_Prisoner, Rabble],
  '3' : [Rabble, Madman],
  '4' : [Rabble, Madman, Political_Prisoner],
  '5' : [Rabble, Political_Prisoner],
  '6' : [Rabble, Political_Prisoner],
  '7' : [Rabble, Political_Prisoner],
  '8' : [Rabble],
  '9' : [Brawler],
  '10' : [Brawler]
}