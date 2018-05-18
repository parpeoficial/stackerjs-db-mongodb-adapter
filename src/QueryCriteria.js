import { treatValue, parseField } from "./Utils";

export class QueryCriteria {
    like(field, value) {
        let filter = {},
            parsedField = parseField(field);

        if (value === null)
            filter[parsedField] = { "$exists": false };
        else
            filter[parsedField] = new RegExp(`${value}`);

        return filter;
    }

    eq(field, value) {
        let filter = {},
            parsedField = parseField(field);

        if (value === null)
            filter[parsedField] = { "$exists": false };
        else
            filter[parsedField] = { "$eq": value };

        return filter;
    }

    neq(field, value) {
        let filter = {},
            parsedField = parseField(field);

        if (value === null)
            filter[parsedField] = { "$exists": true };
        else
            filter[parsedField] = { "$ne": value };

        return filter;
    }

    lt(field, value) {
        return `${parseField(field)} < ${treatValue(value)}`;
    }

    lte(field, value) {
        return `${parseField(field)} <= ${treatValue(value)}`;
    }

    gt(field, value) {
        return `${parseField(field)} > ${treatValue(value)}`;
    }

    gte(field, value) {
        return `${parseField(field)} >= ${treatValue(value)}`;
    }

    in(field, value) {
        return this.intersectIn(field, value);
    }

    notin(field, value) {
        return this.intersectIn(field, value, true);
    }

    andX() {
        return `(${this.intersect(arguments, "AND")})`;
    }

    orX() {
        return `(${this.intersect(arguments, "OR")})`;
    }

    intersect(whatToInsersect, intersectWith) {
        return Object.keys(whatToInsersect)
            .map(key => whatToInsersect[key])
            .join(` ${intersectWith.trim()} `);
    }

    intersectIn(field, value, not = false) {
        if (Array.isArray(value))
            value = `(${value.map(v => treatValue(v)).join(", ")})`;

        if (typeof value === "object" && typeof value.parse === "function")
            value = treatValue(value);

        return `${parseField(field)} ${not ? "NOT" : ""} IN ${value}`;
    }
}
