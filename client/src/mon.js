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
        var skillsString = "";
        this.skills.forEach((skill) => {
            skillsString += skill.power + "/" + skill.cost + " | ";
        })
        return "NAME: " + this.name + ", HP: " + this.hp + ", ATK: " + this.atk + ", " + skillsString;
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