import chalk from "chalk";
import readlineSync from 'readline-sync';
import {encountPool} from "./enemies.js"
import {Character} from "./character.js";

export class Event{
    // Random utill
    Random(n) {
        return Math.floor(Math.random() * n)
    }

    // 전투 상황 표시
    displayStatus(stage, turn, player, monster) {
        console.log(chalk.magentaBright(`\n=== Current Status ===`));
        console.log(
            chalk.cyanBright(`| Stage: ${stage} | Turn: ${turn} |\n`) +
            chalk.blueBright(
            `| 플레이어 정보 | 체력 ${player.hp}\n`,
            ) +
            chalk.redBright(
            `| ${monster.name} | 체력 ${monster.hp}`,
            ),
        );
        console.log(chalk.magentaBright(`=====================\n`));
    }
    
    // 게임 시작 인트로
    intro = () => {
        console.log(chalk.magentaBright('Intro\n'+'='.repeat(43)));
        console.log(chalk.green(
`폭동으로 인해 지하 감옥은 혼돈에 빠졌다.
온 곳이 소란스럽고 익숙한 철문은 부서졌다.
죄수인 당신은 이 기회를 틈타 탈출을 노린다.`))
        console.log(chalk.magentaBright('='.repeat(43)+'\n'));
        readlineSync.question('- Press Enter -');
    }
    
    // 전투 보상
    event_end = async (stage, player, monster, result) => {
    };
    
    // 몬스터 랜덤 인카운트
    enemyEncount = (stage) => {
        const pool = encountPool[stage.toString()]
        const enemy = pool[this.Random(pool.length)]
        return new Character(...enemy.status)
    }
    
    // 전투 이벤트
    battle = async (stage, player, monster) => {
        let logs = [];
        let past_logs = [];
        let turn = 1;
        let result = '';
        logs.push(chalk.green(`어두운 복도에서 ${chalk.redBright(monster.name)}와 마주쳤다.\n${monster.info}`));
        // 몬스터 패턴 결정
        let pattern = this.Random(monster.skills.length);
        let skill = monster.skills[pattern]

        // 버프 처리 및 행동 예고
        logs.push(`===============턴:${turn}===============`) // 턴 확인
        logs.push(chalk.redBright(monster.name) + monster.action(skill, player))
        
        // 몬스터, 플레이어 중 하나가 패배하면 끝
        while(player.hp > 0 && monster.hp > 0) {
            // 화면 초기화
            console.clear();
            this.displayStatus(stage, turn, player, monster);

                // 로그가 너무 길면 삭제. n개까지만 표시
            while(logs.length > 10) past_logs.push(logs.shift())
        
            logs.forEach((log) => console.log(log));
        
            console.log(
            chalk.cyanBright(
                `\n1. 공격한다(치명${player.crit_chance*100}% 연계${player.combo_chance*100}%) 2. 회피한다(${player.skills[1].bonus[0].dodge*100}%) 3. 도망친다(${player.escape_chance*100}%) 4. 로그확인`,
            ),
            );
            const choice = readlineSync.question('당신의 선택은? ');
        
            // 플레이어의 선택에 따라 다음 행동 처리
            let choice_log = ''
            switch (choice){
            case '1' : 
                player.action(player.skills[0], monster)
                choice_log = player.attack(monster).map(e=>chalk.redBright(monster.name) + e).join('\n');
                break;
            case '2' :
                choice_log = chalk.blueBright(player.name) +player.action(player.skills[1], monster)
                break;
            case '3' :
                if(player.run())
                    return chalk.green(`${chalk.blueBright(player.name)}는 무사히 도망쳤다.`);
                else
                    choice_log = chalk.green("도망칠 수 없었다.");
                break;
            case '4' :
                console.clear()
                past_logs.forEach((log) => console.log(log));
                logs.forEach((log) => console.log(log));
                readlineSync.question('\n- Press Enter -');
                continue;
            default : 
                logs.push(chalk.green(`[${choice}] 그런 선택지는 없다`))
                continue;
            }
        
            logs.push(choice_log);
        
            //몬스터의 차례
            if(monster.hp > 0){
                if(skill.type == 0){
                    choice_log = monster.attack(monster).map(e=>chalk.blueBright(player.name)+e).join('\n')
                    logs.push(choice_log);
                }
                
                turn++; // 턴 증가
                logs.push(`===============턴:${turn}===============`) // 턴 확인

                // 몬스터 패턴 결정
                pattern = this.Random(monster.skills.length);
                skill = monster.skills[pattern]

                // 버프 처리 or 행동 예고
                logs.push(chalk.redBright(monster.name) + monster.action(skill, player))
            }
        }
        
        result = `${player.hp > 0 ? chalk.redBright(monster.name) : chalk.blueBright(player.name)}는 쓰러졌다.`

        console.clear();
        this.displayStatus(stage, 0, player, monster);
        
        console.log(`${chalk.green(result)}\n잠시 쉬어 체력을 회복했다. HP+${5*stage}`);

        //클리어 보상
        player.hp += 5 * stage

        readlineSync.question('\n Enter');
    };
}
