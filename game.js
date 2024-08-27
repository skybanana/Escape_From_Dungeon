import chalk from 'chalk';
import readlineSync from 'readline-sync';
import {players} from "./monsters.js"
import { Character } from './character.js';
import {Event} from "./events.js"



export async function startGame() {
  // 초기화
  console.clear();
  const player = new Character(...players.Highwayman.status);
  const event = new Event();
  let stage = 1;

  //게임 인트로
  event.intro()
  //직업 선택

  // 클리어 및 게임 종료 조건 : 스테이지 전부 클리어, 캐릭터 사망
  while (stage <= 10 && player.hp > 0) {
    // 몬스터 랜덤 인카운트
    const monster = event.enemyEncount(stage)
    // 전투 이벤트
    await event.battle(stage, player, monster);
    // 보상 이벤트

    stage++;
  }

  // 게임 종료
  console.clear()
  player.hp > 0 ?
  // 게임 클리어
  console.log(chalk.green(`${player.name}(은)는 무사히 던전에서 탈출했다...`)) :
  // 게임 오버
  console.log(chalk.green(`시야가 ${chalk.red('빨갛게')} 물들었다. 정신이 점점 멀어진다...`))
}