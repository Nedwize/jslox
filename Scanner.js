const TOKENS = require('./Tokens')

// Reserved words
const keywords = {
    and: TOKENS.AND,
    class: TOKENS.CLASS,
    else: TOKENS.ELSE,
    false: TOKENS.FALSE,
    for: TOKENS.FOR,
    fun: TOKENS.FUN,
    if: TOKENS.IF,
    nil: TOKENS.NIL,
    or: TOKENS.OR,
    print: TOKENS.PRINT,
    return: TOKENS.RETURN,
    super: TOKENS.SUPER,
    this: TOKENS.THIS,
    true: TOKENS.TRUE,
    var: TOKENS.VAR,
    while: TOKENS.WHILE,
}

class Token {
    constructor(type, lexeme, literal, line) {
        this.type = type
        this.lexeme = lexeme
        this.literal = literal
        this.line = line
    }

    toString() {
        return this.type + ' ' + this.lexeme + ' ' + this.literal
    }
}

class Scanner {
    constructor(source) {
        this.source = source
        this.tokens = []

        this.start = 0
        this.current = 0
        this.line = 1
    }

    advance() {
        return this.source.charAt(this.current++)
    }

    match(expected) {
        if (this.isAtEnd()) return false
        if (this.source.charAt(this.current) != expected) return false
        this.current++
        return true
    }

    peek() {
        if (this.isAtEnd()) return '\0'
        return this.source.charAt(this.current)
    }

    peekNext() {
        if (this.current + 1 >= this.source.length) return '\0'
        return this.source.charAt(this.current + 1)
    }

    addToken(type, literal = null) {
        const text = this.source.substring(this.start, this.current)
        this.tokens.push(new Token(type, text, literal, this.line))
    }

    isAtEnd() {
        return this.current >= this.source.length
    }

    scanTokens() {
        while (!this.isAtEnd()) {
            // We are at the beginning of the next lexeme.
            this.start = this.current
            this.scanToken()
        }

        this.tokens.push(new Token(TOKENS.EOF, '', null, this.line))
        return this.tokens
    }

    identifier() {
        while (this.isAlphaNumeric(this.peek())) this.advance()
        const text = this.source.substring(this.start, this.current)
        if (keywords[text]) {
            this.addToken(keywords[text])
        } else {
            this.addToken(TOKENS.IDENTIFIER)
        }
    }

    isAlpha(c) {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_'
    }

    isAlphaNumeric(c) {
        return this.isAlpha(c) || this.isDigit(c)
    }

    string() {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == '\n') this.line++
            this.advance()
        }

        if (this.isAtEnd()) {
            console.log(line, 'Unterminated string.')
            return
        }

        // The closing ".
        this.advance()

        // Trim the surrounding quotes.
        const value = this.source.substring(this.start + 1, this.current - 1)
        this.addToken(TOKENS.STRING, value)
    }

    isDigit(c) {
        return c >= '0' && c <= '9'
    }

    number() {
        while (this.isDigit(this.peek())) this.advance()

        // Look for a fractional part.
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            // Consume the "."
            this.advance()

            while (this.isDigit(this.peek())) this.advance()
        }

        this.addToken(
            TOKENS.NUMBER,
            parseFloat(this.source.substring(this.start, this.current))
        )
    }

    scanToken() {
        const c = this.advance()
        switch (c) {
            case '(':
                this.addToken(TOKENS.LEFT_PAREN)
                break
            case ')':
                this.addToken(TOKENS.RIGHT_PAREN)
                break
            case '{':
                this.addToken(TOKENS.LEFT_BRACE)
                break
            case '}':
                this.addToken(TOKENS.RIGHT_BRACE)
                break
            case ',':
                this.addToken(TOKENS.COMMA)
                break
            case '.':
                this.addToken(TOKENS.DOT)
                break
            case '-':
                this.addToken(TOKENS.MINUS)
                break
            case '+':
                this.addToken(TOKENS.PLUS)
                break
            case ';':
                this.addToken(TOKENS.SEMICOLON)
                break
            case '*':
                this.addToken(TOKENS.STAR)
                break
            case '!':
                this.addToken(this.match('=') ? TOKENS.BANG_EQUAL : TOKENS.BANG)
                break
            case '=':
                this.addToken(
                    this.match('=') ? TOKENS.EQUAL_EQUAL : TOKENS.EQUAL
                )
                break
            case '<':
                this.addToken(this.match('=') ? TOKENS.LESS_EQUAL : TOKENS.LESS)
                break
            case '>':
                this.addToken(
                    this.match('=') ? TOKENS.GREATER_EQUAL : TOKENS.GREATER
                )
                break
            case '/':
                if (this.match('/')) {
                    // A comment goes until the end of the line.
                    while (peek() != '\n' && !this.isAtEnd()) this.advance()
                } else {
                    this.addToken(TOKENS.SLASH)
                }
                break
            case ' ':
            case '\r':
            case '\t':
                // Ignore whitespace.
                break
            case '\n':
                this.line++
                break
            case '"':
                this.string()
                break
            default:
                if (this.isDigit(c)) {
                    this.number()
                } else if (this.isAlpha(c)) {
                    this.identifier()
                } else {
                    console(this.line, 'Unexpected character.')
                }
                break
        }
    }
}

module.exports = Scanner
