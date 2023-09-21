class Skill {
    constructor(power, cost) {
        this.power = power;
        this.cost = cost;
    }
}

class Mon {
    constructor(name, skills, hp, atk) {
        this.name = name;
        this.skills = skills;
        this.hp = hp;
        this.atk = atk;
    }

    toString = () => {
        return "NAME: " + name + "\nHP: " + this.hp + "\nATK: " + this.atk + "\n" + this.skills;
    }

    verify = () => {
        var total_cost = 0;
        var total_pow = 0;

        this.skills.forEach((skill) => {
            total_cost += skill.cost;
            total_pow += skill.power;
        })

        if (total_cost > 20 || total_pow > 20) {
            return false;
        }

        return true;
    }
}