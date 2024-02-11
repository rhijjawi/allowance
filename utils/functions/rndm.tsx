export function generateRandom(n : number = 6) : string {
    const alpha : string[] = 'qwertyuiopasdfghjklzxcvbnm'.toUpperCase().split('').sort()
    const number : string[] = '0123456789'.split('')
    let str : string[] = []
    for (let i = 0; i < n; i++){
        let randomChoice = Boolean(Math.round(Math.random()*1))
        randomChoice ? str.push(number[Math.round(Math.random()*number.length)]) : str.push(alpha[Math.round(Math.random()*alpha.length)])
    }
    return str.join("");
}