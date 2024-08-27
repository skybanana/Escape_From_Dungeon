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

let _buff_stack = [new bonus(1,1,1,1,1), new bonus(), new bonus()];

function add_buff(buff_stack){
    // 버프 중첩을 위해 받을 stack 수와 같게 남은 스텍 수를 맞춰줌.
    while(buff_stack.length > _buff_stack.length)
        _buff_stack.push(new bonus());

    // 버프 중첩
    buff_stack.forEach((bonus, idx) => {
        for (const [key, value] of Object.entries(bonus)) {
        _buff_stack[idx][key] += value;
        }
    });
}

const stack = [new bonus(1,1,1,1,1), new bonus()]

add_buff(stack)
console.log(_buff_stack.shift().dodge)

// 공격 행동 처리, 결과를 텍스트로 반환
function attack() {
    let result = '';
    let bonus = _buff_stack.shift()
    let test = bonus.acc
    
    // 공격 명중 판정
    if(dodge(1+bonus.acc))
      result = chalk.green(`(은)는 공격을 피했다.`);
    // 데미지 계산 및 처리
    else{
      let crit = Math.random() < (0+bonus.crit) ? true : false // 치명타 판정
      let damage = (Math.floor(10*(bonus.atk+1))) * (crit ? 2 : 1); // 데미지 계산

      result = chalk.green(`(은)는 ${chalk.magentaBright(damage)}의 피해를 입었다.`);
      if(crit) result += chalk.red(" 치명타!")

      //버프 동작 테스트
      result += chalk.yellow('('+Object.values(bonus).join(',')+')')
    }
    
    return result
  }

  //회피 판정
function dodge(atk_acc) {
    const bonus = _buff_stack.shift()
    const hit = atk_acc - (0 + bonus.dodge)
    return  Math.random() < hit ? false : true;
}

console.log(attack())