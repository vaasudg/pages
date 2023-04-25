export class Helpers {
    static firstLetterUpperCase(name: string): string {
        const value = name
        return value.split(' ').map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`).join(' ')
    }

    static lowerCase(name: string): string {
        return name.toLocaleLowerCase()
    }

    static randomNumber(numberLength: number): number {
        const chars = '0123456789'
        let result = ' '
        const charsLength = chars.length
        for (let index = 0; index < numberLength; index++) {
            result += chars.charAt(Math.floor(Math.random() * charsLength))
        }
        return parseInt(result, 10)
    }
}