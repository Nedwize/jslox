const { readFileSync } = require('fs')
const Scanner = require('./Scanner')
const readline = require('node:readline')

const START_COMMAND = `node index.js` // Change to jslox
// Globally accessible command - https://blog.logrocket.com/building-typescript-cli-node-js-commander/#making-cli-globally-accessible

const main = () => {
    const args = process.argv.slice(2)
    if (args.length > 1) {
        console.log(`Usage: ${START_COMMAND} [script]`)
        process.exit(1)
    } else if (args.length == 1) {
        runFile(args[0])
    } else {
        runPrompt()
    }
}

const runFile = (filePath) => {
    try {
        const data = readFileSync(filePath, 'utf8')
        run(data)
    } catch (err) {
        console.error(err)
    }
}

// Ref - https://nodejs.org/api/readline.html#example-tiny-cli
const runPrompt = () => {
    console.log(`Welcome to JSLOX v0.0.1! Happy Hacking!\n`)
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '> ',
    })

    rl.prompt()

    rl.on('line', (line) => {
        run(line)
        rl.prompt()
    })

    rl.on('close', () => {
        console.log('Thank you for using jslox. Have a great day!')
        process.exit(0)
    })
}

const run = (code) => {
    const scanner = new Scanner(code)
    const tokens = scanner.scanTokens()
    tokens.forEach((x) => console.log(x))
}

main()
