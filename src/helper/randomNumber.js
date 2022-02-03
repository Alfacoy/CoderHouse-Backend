function RandomNumber(cant) {
    let max = 1000;
    let min = 1;
    let result = []
    let count = {}
    for (let i = 0; i < cant + 1; i++) {
        let randomNumber = Math.floor((Math.random() * (max - min + 1)) + min);
        result[i] = randomNumber;
        if (i == cant) {
            break
        }
    }
    for (let i = 1; i <= 1000; i++){
        count[i] = `Se repitio ${result.filter(n => n === i).length} veces`
    }
    return count
}

process.send(RandomNumber(process.env.cant));