module.exports = {
    diceRoll: function(max) {
        let n1 = Math.floor(Math.random() * max);
        let n2 = Math.floor(Math.random() * max);
        while (n1 == n2) {
            n2 = Math.floor(Math.random() * max);
        }
        return [n1, n2];
    }
}