import { QueryBuilderQueries } from "./QueryBuilderQueries";

export class QueryBuilderInsert extends QueryBuilderQueries {
    parse() {
        return db => db.collection(this.tableName)
            .insertOne(this.fields);
    }
}
