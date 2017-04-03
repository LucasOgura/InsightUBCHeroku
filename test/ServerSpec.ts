import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import {Request} from "restify";
import {App} from "../src/App";

describe("ServerSpec", function () {
    var fs = require("fs");
    var URL = "http://localhost:55577";
    var chai = require('chai')
    var chaiHttp = require('chai-http');
    chai.use(chaiHttp);
    var rooms = fs.readFileSync("./rooms.zip");
    var courses = fs.readFileSync("./courses.zip");
    var server:Server;
    this.timeout(10000);
    before(function () {
        server = new Server(55577);
        Log.test('Before: ' + (<any>this).test.parent.title);

    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
    });
    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("Start server",function () {
        return server.start().then(function (res) {
            expect(res).to.equal(true)
        }).catch(function (err) {
            expect.fail();
        })
    });

    it("Get description", function () {
        this.timeout(10000);
        return chai.request(URL)
            .put('/')
            .then(function (res: any) {
                Log.trace('then:');
                // expect(res.status).to.equal(200);
            })
            .catch(function (err:any) {
                Log.trace('catch:');
                Log.test("ERROR: " + JSON.stringify(err));
                // expect.fail();
            });
    });


    it("PUT description", function () {
        this.timeout(10000);
        return chai.request(URL)
            .put('/dataset/rooms')
            .attach("body", rooms, "rooms.zip")
            .then(function (res: any) {
                Log.trace('then:');
                expect(res.status).to.equal(204);
            })
            .catch(function (err:any) {
                Log.trace('catch:');
                Log.test("ERROR: " + JSON.stringify(err));
                expect.fail();
            });
    });

    it("POST description", function () {
        let queryJSONObject = {
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "rooms_address",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname","rooms_address"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        };
        this.timeout(10000);
        return chai.request(URL)
            .post('/query')
            .send(queryJSONObject)
            .then(function (res: any) {
                expect(res.status).to.equal(200);
            })
            .catch(function (err: any) {
                Log.test("ERROR: " + JSON.stringify(err));
                expect.fail();
            });
    });

    it("Del description", function () {
        this.timeout(10000);
        return chai.request(URL)
            .del('/dataset/rooms')
            .then(function (res: any) {
                expect(res.status).to.equal(204);
            })
            .catch(function (err:any) {
                Log.trace('catch:');
                Log.test("ERROR: " + JSON.stringify(err));
                expect.fail();
            });
    });


    it("Stop", async() => {
        try {
            await server.stop();
        } catch (error) {
            expect.fail();
        }
    });

});