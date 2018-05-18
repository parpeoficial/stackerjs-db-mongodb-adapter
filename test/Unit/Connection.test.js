import { expect } from "chai";
import { Connection } from "./../../index";

describe("Unit/ConnectionTest", function () {
    const conn = Connection;

    describe("Executing queries", () => {
        it("Should create", done => {
            conn
                .query(db => db.createCollection("stackerjs"))
                .then(response => {
                    expect(response).to.have.property("affectedRows");
                    expect(response).to.have.property("changedRows");
                    expect(response).to.have.property("lastInsertedId");
                })
                .then(() => done());
        });

        it("Should execute an MANY INSERT query", done => {
            conn
                .query(db =>
                    db.collection("stackerjs").insertMany([
                        { "name": "stackerjs-db" },
                        { "name": "stackerjs" },
                        { "name": "stackerjs-http" },
                        { "name": "stackerjs-utils" }
                    ]))
                .then(response => {
                    expect(response.affectedRows).to.be.equal(4);
                })
                .then(() => done());
        });

        it("Should execute ONE INSERT query", done => {
            conn.query(db => db.collection("stackerjs").insertOne({
                name: "stackerjs-db-mysql-adapter"
            }))
                .then(response => {
                    expect(response).to.have.property("affectedRows");
                    expect(response).to.have.property("changedRows");
                    expect(response).to.have.property("lastInsertedId");
                })
                .then(() => done());
        });

        it("Should execute an UPDATE query", done => {
            conn.query(db => db.collection("stackerjs").updateOne({
                name: "stackerjs-db-mysql-adapter"
            }, { "$set": { name: "stackerjs-db-mongodb-adapter" } }))
                .then(response => {
                    expect(response).to.have.property("affectedRows");
                    expect(response).to.have.property("changedRows");
                    expect(response).to.have.property("lastInsertedId");
                })
                .then(() => done());
        });

        it("Should execute a SELECT query", done => {
            conn
                .query(db => db.collection("stackerjs").find().toArray())
                .then(results => {
                    expect(results).to.be.an("Array");
                    expect(results).to.be.lengthOf(5);
                })
                .then(() => done());
        });

        it("Should drop", done => {
            conn.query(db => db.collection("stackerjs").drop())
                .then(response => {
                    expect(response).to.have.property("affectedRows");
                    expect(response).to.have.property("changedRows");
                    expect(response).to.have.property("lastInsertedId");
                })
                .then(() => done());
        });

        it("Should present error if query is invalid", done => {
            conn
                .query(db => db.coll("stackerjs").find().toArray())
                .catch(err =>
                    expect(() => {
                        throw err;
                    }).to.throw())
                .then(() => done());
        });

        after(done => {
            conn.disconnect().then(() => done());
        });
    });
});
