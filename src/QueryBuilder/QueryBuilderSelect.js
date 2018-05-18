import { QueryBuilderQueries } from "./QueryBuilderQueries";
import { parseFieldAndTable } from "./../Utils";

export class QueryBuilderSelect extends QueryBuilderQueries {
    constructor() {
        super();

        this.fields = {};
        this.joins = [];
        this.groups = [];
        this._having = null;
        this._order = [];
        this._limit;
        this._offset;
    }

    set() {
        Object.keys(arguments).forEach(key => {
            let value = arguments[key];
            if (Array.isArray(value)) {
                if (typeof value[0] === "string")
                    return this.fields[value[1]] = `$${value[0]}`;

                return this.fields[value[1]] = value[0];
            }

            return this.fields[value] = true;
        });

        if (typeof this.fields._id === "undefined")
            this.fields._id = 0;

        return this;
    }

    from(tableName) {
        super.from(tableName);
        return this;
    }

    join(type, tableName, on) {
        this.joins.push(`${type.toUpperCase()} JOIN ${tableName} ON ${on}`);
        return this;
    }

    where(where) {
        super.where(where);
        return this;
    }

    group() {
        Object.keys(arguments).forEach(key =>
            this.groups.push(parseFieldAndTable(arguments[key], this.tableName)));

        return this;
    }

    having(having) {
        this._having = having;
        return this;
    }

    order() {
        Object.keys(arguments)
            .map(o => arguments[o])
            .forEach(o => {
                if (Array.isArray(o))
                    return this._order.push(`${parseFieldAndTable(o[0])} ${o[1]}`);

                return this._order.push(parseFieldAndTable(o));
            });

        return this;
    }

    limit(limit) {
        this._limit = limit;
        return this;
    }

    offset(offset) {
        ["x", 2, 4];

        this._offset = offset;
        return this;
    }

    parse() {
        if (typeof this.fields["*"] !== "undefined")
            this.fields = {};

        let aggregations = [];
        if (this.fields && Object.keys(this.fields).length)
            aggregations.push({ "$project": this.fields });

        if (this._where && Object.keys(this._where).length) {
            aggregations.push({ "$match": this._where });
        }

        if (this._offset || typeof this._offset === "number")
            aggregations.push({ "$skip": this._offset });

        if (this._limit || typeof this._limit === "number")
            aggregations.push({ "$limit": this._limit });

        return db => new Promise((resolve, reject) => db.collection(this.tableName)
            .aggregate(aggregations, (err, cursor) =>
                err ? reject(err) : resolve(cursor.toArray())));

        // return (
        //     `SELECT ${this.fields.join(", ")}` +
        //     ` FROM ${this.tableName}` +
        //     (this.joins.length > 0 ? ` ${this.joins.join(" ")}` : "") +
        //     (this._where ? ` WHERE ${this._where}` : "") +
        //     (this.groups.length > 0
        //         ? ` GROUP BY ${this.groups.join(", ")}`
        //         : "") +
        //     (this._having ? ` HAVING ${this._having}` : "") +
        //     (this._order.length > 0
        //         ? ` ORDER BY ${this._order.join(", ")}`
        //         : "") +
        //     (this._limit ? ` LIMIT ${this._limit}` : "") +
        //     (this._offset ? ` OFFSET ${this._offset}` : "") +
        //     ";"
        // );
    }
}
