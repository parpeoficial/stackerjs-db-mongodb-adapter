import { StackerJS } from "stackerjs-types";


declare module "stackerjs-db-mongodb-adapter"
{

    export class QueryBuilder extends StackerJS.DB.QueryBuilder
    {

    }

    export class QueryCriteria extends StackerJS.DB.QueryCriteria
    {

    }

    export class Connection extends StackerJS.DB.Connection
    {

    }

}