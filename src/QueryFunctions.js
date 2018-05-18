

export class QueryFunctions {

    static upper(value) {
        return { "$toUpper": this.formatItem(value) };
    }

    static lower(value) {
        return { "$toLower": this.formatItem(value) };
    }

    static concat() {
        return {
            "$concat": Object.keys(arguments).map(i => this.formatItem(arguments[i]))
        };
    }

    static formatItem(value) {
        if (typeof value === "string" && value.length && !value.includes(" "))
            return `$${value}`;

        return value;
    }

}