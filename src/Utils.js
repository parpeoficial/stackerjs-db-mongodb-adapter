import { QueryCriteria } from "./index";


const DETECT_FIELD_IS_WRAPPED_BY_FUNCTION = /[A-Za-z]+\((.*)\)/,
    DETECT_FIELD_IS_JSON = /[a-z_]+->"\$\.[a-z0-9._]+"/,
    DETECT_FIELD_IS_PARSED_JSON = /[a-zA-Z_]+->/,
    DETECT_FIELD_HAS_TABLE = /[a-z_`]+\.[a-z_`*]+/,
    WRAPPED_BY_APOSTROPHE = /`[a-z_]+`/;

const parseDateToDateTimeString = value =>
    [
        [
            value.getFullYear(),
            padString((value.getMonth() + 1).toString(), 2),
            padString(value.getDate().toString(), 2)
        ].join("-"),
        [
            padString(value.getHours().toString(), 2),
            padString(value.getMinutes().toString(), 2),
            padString(value.getSeconds().toString(), 2)
        ].join(":")
    ].join(" ");

const padString = (text, desiredSize, completeWith = "0") => {
    if (text.length < desiredSize) {
        while (text.length < desiredSize) text = completeWith + text;
    }

    return text;
};

export const treatValue = value => {
    if (typeof value === "undefined") return null;

    if (value && typeof value.parse === "function")
        return `(${value.parse().slice(0, -1)})`;

    if (value instanceof Date) value = parseDateToDateTimeString(value);

    return value;
};

export const parseField = fieldName => {
    if (DETECT_FIELD_IS_PARSED_JSON.test(fieldName))
        return fieldName.replace(/->/g, ".");

    return fieldName;
};

export const parseFilters = filters => {

    let criteria = new QueryCriteria();
    Object.keys(filters).forEach(key => {
        if (Array.isArray(filters[key])) {
            let [comp, value] = filters[key];
            filters = { ...filters, ...criteria[comp.toLowerCase()](key, value) };
            return delete filters[key];
        }

        if (typeof filters[key] === "object" && typeof filters[key].parse !== "function") {
            Object.keys(filters[key]).forEach(comp => {
                if (!filters["$and"])
                    filters["$and"] = [];

                // let filter = {};
                // filter[key] = criteria[comp.toLowerCase()](key, filters[key]);
                filters["$and"].push(
                    criteria[comp.toLowerCase()](key, filters[key])
                );
            });

            return delete filters[key];
        }

        filters = { ...filters, ...criteria.eq(key, filters[key]) };
    });

    // if (typeof filter === "object") {
    //     let expr = new QueryCriteria();
    //     return Object.keys(filter)
    //         .map(field => {
    //             if (Array.isArray(filter[field])) {
    //                 let [comp, value] = filter[field];
    //                 return expr[comp.toLowerCase()](field, value);
    //             }
    //             else if (
    //                 typeof filter[field] === "object" &&
    //                 typeof filter[field].parse !== "function"
    //             )
    //                 return Object.keys(filter[field])
    //                     .map(comp => {
    //                         return expr[comp.toLowerCase()](
    //                             field,
    //                             filter[field][comp]
    //                         );
    //                     });

    //             return expr.eq(field, filter[field]);
    //         });
    // }

    return filters;
};
