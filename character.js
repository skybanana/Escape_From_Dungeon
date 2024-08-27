import chalk from 'chalk';

export class bonus {
    constructor(atk=0, crit=0, dodge=0, acc=0, combo=0){
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

        const _bonus = this._buff_stack.length ? this._buff_stack.shift() : new bonus()
        
        // 공격 명중 판정
        if(enemy.dodge(this.accuracy+_bonus.acc))
            result = chalk.green(`(은)는 공격을 피했다.`);
        // 데미지 계산 및 처리
        else{
            let crit = Math.random() < (this.crit_chance+_bonus.crit) ? true : false // 치명타 판정
            let damage = (Math.floor(this.attack_damage*(_bonus.atk+1))) * (crit ? 2 : 1); // 데미지 계산

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
    const _bonus = this._buff_stack.length ? this._buff_stack.shift() : new bonus()
    const hit = atk_acc - (this.dodge_chance + _bonus.dodge)
    return  Math.random() < hit ? false : true;
    }

    // 버프 추가 및 중첩
    add_buff(skill){
        const buff_stack = skill.bonus

        // 버프 중첩을 위해 받을 stack 수와 같게 남은 스텍 수를 맞춰줌.
        while(buff_stack.length > this._buff_stack.length)
            this._buff_stack.push(new bonus());
        
        // 버프 중첩
        buff_stack.forEach((bonus, idx) => {
            for (const [key, value] of Object.entries(bonus)) {
            this._buff_stack[idx][key] += value;
            }
        });

        return skill.info
    }
    
    //Player만 이용하는 기능
    escape() {
        return  Math.random() < this.escape_chance ? true : false
    }
}