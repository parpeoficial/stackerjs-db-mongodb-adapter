[![Travis](https://img.shields.io/travis/parpeoficial/stackerjs-db-mongodb-adapter.svg)](https://travis-ci.org/parpeoficial/stackerjs-db-mongodb-adapter)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2694e64d1fc05b759191/test_coverage)](https://codeclimate.com/github/parpeoficial/stackerjs-db-mongodb-adapter/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/2694e64d1fc05b759191/maintainability)](https://codeclimate.com/github/parpeoficial/stackerjs-db-mongodb-adapter/maintainability)
[![Dependencies](https://img.shields.io/david/parpeoficial/stackerjs-db-mongodb-adapter.svg)](https://david-dm.org/parpeoficial/stackerjs-db-mongodb-adapter)
[![npm](https://img.shields.io/npm/dt/stackerjs-db-mongodb-adapter.svg)](https://www.npmjs.com/package/stackerjs-db-mongodb-adapter)


[![NPM](https://nodei.co/npm/stackerjs-db-mongodb-adapter.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/stackerjs-db-mongodb-adapter/)

![StackerJS](https://s3-sa-east-1.amazonaws.com/parpe.prod/StackerJS-logo.png)

# Database: MongoDB Adapter
An MongoDB adapter for StackerJS apps with ORM interacting with Mongo databases.

## QueryBuilder

### Insert
```javascript
import { QueryBuilder } from 'stackerjs-db-mongodb-adapter';

let query = new QueryBuilder()
    .insert()
    .set({
        'full_name': 'mongodb adapter',
        'age': 2
    })
    .into('person')
    .execute();

    /**
     *  db.person.insertOne({
     *      "full_name": "mongodb adapter",
     *      "age": 2
     *  }) 
     */
```

### Select
```javascript
import { QueryBuilder, QueryCriteria } from 'stackerjs-db-mongodb-adapter';

let criteria = new QueryCriteria(),
    query = new QueryBuilder()
        .select()
        .set('id', ['full_name', 'name'], 'age')
        .from('person')
        .where(
            criteria.andX(
                criteria.eq('active', true),
                criteria.gte('age', 18),
                criteria.like('name', '%george%')
            )
        )
        .execute();


    /*
     * db.person.aggregate([
     *      {
     *         $match: {
     *              "active": true,
     *              "age": { $gte: 18 },
     *              "name": /george/
     *          }
     *      },
     *      {
     *          $project: {
     *              id: 1, name: "$full_name", age: 1
     *          }
     *      }
     * ])
     */
```

## Filtering
You can build filters using String, Object or QueryCriteria class

| Comparision | String | Object | Query Criteria |
| --- | --- | --- | --- |
| Equal | field = value | { field: value } or { field: [ 'eq': value ] } or { field: { 'eq': value } } | new QueryCriteria.eq(field, value) |
| Non equal | field <> value | { field: [ 'neq': value ] } or { field: { 'neq': value } } | new QueryCriteria.neq(field, value) |