
import {expect} from 'chai';
import {InsightResponse, QueryRequest, GeoResponse} from "../src/controller/IInsightFacade";
import {readFileSync} from "fs";
import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";

describe("InsightFacadeSpec", function () {

    let zipRoom : string = null;
    let zipCourses : string = null;
    let insight : InsightFacade = null;


    before(function () {
        try {
            zipRoom = new Buffer(readFileSync("rooms.zip")).toString("Base64");
            zipCourses = new Buffer(readFileSync("courses.zip")).toString("Base64");
        }
        catch (e){
            Log.warn("name:" + e.name + "\nmessage:" + e.message);
        }
    });

    beforeEach(function () {
        insight = new InsightFacade();
    });

    it("Bromine - performQuery: NOT able to perform query when the dataset is NOT added", function () {
        let query: QueryRequest = {
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name",
                "FORM": "TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(424);
                expect(response.body).to.deep.equal({"missing": ["rooms"]});
                console.log(response.body);
            });
    });

    it("Bromine2 - performQuery: Query contains too many parameters", function () {
        let query: QueryRequest = {
            "WHERE":{
                "NOT":[
                    {
                        "LT":{ "rooms_seats": 80}
                    },
                    {
                        "GT":{
                            "rooms_seats":50
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_seats",
                    "rooms_name"
                ],
                "ORDER":"rooms_seats",
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Bromine(2) - performQuery: NOT able to perform query when the dataset is NOT added", function () {
        let query: QueryRequest = {
            "WHERE":{
                "GT":{
                    "courses_avg": 97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(424);
            expect(response.body).to.deep.equal({"missing": ["courses"]});
            console.log(response.body);
        });
    });

    it("Arsenic(1) - addDataset: add datasets rooms(204)", function () {
        return insight.addDataset("rooms", zipRoom).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            console.log(response.code);
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    it("Arsenic(2) - addDataset: add courses", function () {
        return insight.addDataset("courses", zipCourses).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
            console.log(response.code);
            //console.log(response.body);
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    it("AND with 1 key performQuery: GT - Find courses_avg Should be able to perform queries (200)", function () {
        let query: QueryRequest = {
            "WHERE": {
                "AND": [
                    {
                        "GT": {
                            "courses_avg": 99
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_avg"
                ],

                "FORM": "TABLE"
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            console.log(response.code);
            //console.log(response.body);
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    it("Gallium - PerformQuery: Filter by courses year.", function () {
        let query: QueryRequest = {
            "WHERE":{
                "GT":{
                    "courses_avg":99
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg",
                    "courses_year"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code).to.equal(200);
            //console.log(response.body);
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    it("Arsenic(2) - addDataset: add datasets independently(204)", function () {
        return insight.addDataset('rooms',zipRoom).then(function (response: InsightResponse) {
            expect(response.code).to.equal(201);
        }).catch(function (response: InsightResponse) {
            //console.log(response.body);
            expect.fail();
        });
    });

    xit("Test performQuery: GT - Find courses_avg Should be able to perform queries (200)", function () {
        let query: QueryRequest = {
            "WHERE":{
                "GT":{
                    "courses_avg": 99
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code == 200);
            //console.log(response.body);
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });


      xit("Cinnamon(1) - removeDataset/performQuery: NOT able to perform query when the dataset has been removed(400)", function () {
          return insight.removeDataset('rooms').then(function (response: InsightResponse) {
              expect(response.code).to.equal(204);
          }).catch(function (response: InsightResponse) {
              expect.fail();
          });
      });


    it("Cesium/Hopper - performQuery: able to perform query when the dataset is added", function () {
        let query: QueryRequest = {
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name",
                "FORM": "TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.body);
                expect(response.body).to.deep.equal({
                    "render": "TABLE",
                    "result": [{
                        "rooms_name": "DMP_101"
                    }, {
                        "rooms_name": "DMP_110"
                    }, {
                        "rooms_name": "DMP_201"
                    }, {
                        "rooms_name": "DMP_301"
                    }, {
                        "rooms_name": "DMP_310"
                    }]
                });
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Cinnamon(1) - removeDataset/performQuery: NOT able to perform query when the dataset has been removed(400)", function () {
        return insight.removeDataset("courses").then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    it("Cinnamon(2)/Glavin - removeDataset/performQuery: NOT able to perform query when the dataset has been removed(400)", function () {
        let query: QueryRequest = {
            "WHERE":{
                "IS":{
                    "courses_dept":"adhe"
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg",
                    "courses_id"
                ],
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(424);
            console.log(response.code);
            console.log(response.body);
        });
    });

    xit("FIRETRUCK: Should be able to find all courses in a dept except some specific examples.", function () {
        let query: QueryRequest = {
            "WHERE":{
                "AND":[
                    {
                        "NOT":{
                            "GT":{ "courses_avg": 70}
                        }
                    },
                    {
                        "IS":{
                            "courses_dept":"adhe"
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                console.log(response.body);
                expect(response.code).to.equal(200);
            }).catch(function (response: InsightResponse) {
                //console.log(response.body);
                expect.fail();
            });
    });

    it("Edison - performQuery: able to perform query when the deleted dataset has different ID", function () {
        let query: QueryRequest = {
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name",
                "FORM": "TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal({
                    "render": "TABLE",
                    "result": [{
                        "rooms_name": "DMP_101"
                    }, {
                        "rooms_name": "DMP_110"
                    }, {
                        "rooms_name": "DMP_201"
                    }, {
                        "rooms_name": "DMP_301"
                    }, {
                        "rooms_name": "DMP_310"
                    }]
                });
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Argon: performQuery: able to find rooms in a specific building", function () {
        let query: QueryRequest = {
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name",
                "FORM": "TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                expect(response.body).to.deep.equal({
                    "render": "TABLE",
                    "result": [{
                        "rooms_name": "DMP_101"
                    }, {
                        "rooms_name": "DMP_110"
                    }, {
                        "rooms_name": "DMP_201"
                    }, {
                        "rooms_name": "DMP_301"
                    }, {
                        "rooms_name": "DMP_310"
                    }]
                });
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Boron - performQuery: able to find rooms in a specific building", function () {
        let query: QueryRequest = {
            "WHERE":{
                "AND":[
                    {
                        "IS":{ "rooms_name": "DMP_*"}
                    },
                    {
                        "GT":{
                            "rooms_seats":50
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_seats",
                    "rooms_name"
                ],
                "ORDER":"rooms_seats",
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.body);
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Canary - performQuery: able to query with AND and OR", function () {
        let query: QueryRequest = {
            "WHERE":{
                "OR":[
                    {
                        "AND":[
                            {
                                "IS":{ "rooms_name": "DMP_*"}
                            },
                            {
                                "GT":{
                                    "rooms_seats":150
                                }
                            }
                        ]
                    },
                    {
                        "EQ":{
                            "rooms_seats":150
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_seats",
                    "rooms_name"
                ],
                "ORDER":"rooms_seats",
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log("There should be five results being returned");
                //console.log(response.body);
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Diesel - performQuery: able to find address of a building given lat and lon", function () {
        let query: QueryRequest = {
            "WHERE":{
                "AND":[
                    {
                        "AND":[
                            {
                                "GT":{ "rooms_lat": 49.26}
                            },
                            {
                                "GT":{
                                    "rooms_lon":-124
                                }
                            }
                        ]
                    },
                    {
                        "EQ":{
                            "rooms_seats":150
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_lat",
                    "rooms_lon",
                    "rooms_address"
                ],
                "ORDER":"rooms_lat",
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                //console.log(response.body);
                expect(response.body).to.deep.equal({
                    "render": "TABLE",
                    "result": [
                        {
                            "rooms_lat": 49.26274,
                            "rooms_lon": -123.25224,
                            "rooms_address": "2207 Main Mall"
                        },
                        {
                            "rooms_lat": 49.26627,
                            "rooms_lon": -123.25374,
                            "rooms_address": "6224 Agricultural Road"
                        },
                        {
                            "rooms_lat": 49.26826,
                            "rooms_lon": -123.25468,
                            "rooms_address": "1866 Main Mall"
                        },
                        {
                            "rooms_lat": 49.26826,
                            "rooms_lon": -123.25468,
                            "rooms_address": "1866 Main Mall"
                        }
                    ]
                });
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Einstein - performQuery: able to find lat and lon given address of a building", function () {
        let query: QueryRequest = {
            "WHERE":{
                "IS":{
                    "rooms_address":"1866 Main Mall"
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_lat",
                    "rooms_lon",
                    "rooms_seats"
                ],
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                //console.log(response.body);
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Germanium - performQuery: able to find rooms with tables.", function () {
        let query: QueryRequest = {
            "WHERE":{
                "IS":{
                    "rooms_address":"1866 Main Mall"
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_lat",
                    "rooms_lon",
                    "rooms_seats"
                ],
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                //console.log(response.body);
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Googolplex - performQuery: : Filter by room fullnames.", function () {
        let query: QueryRequest = {
            "WHERE":{
                "IS":{
                    "rooms_fullname":"Allard Hall (LAW)"
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_lat",
                    "rooms_lon",
                    "rooms_seats"
                ],
                "ORDER": "rooms_seats",
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.body);
                expect(response.body).to.deep.equal({
                    "render": "TABLE",
                    "result": [
                        {
                            "rooms_lat": 49.2699,
                            "rooms_lon": -123.25318,
                            "rooms_seats": 20
                        },
                        {
                            "rooms_lat": 49.2699,
                            "rooms_lon": -123.25318,
                            "rooms_seats": 20
                        },
                        {
                            "rooms_lat": 49.2699,
                            "rooms_lon": -123.25318,
                            "rooms_seats": 44
                        },
                        {
                            "rooms_lat": 49.2699,
                            "rooms_lon": -123.25318,
                            "rooms_seats": 50
                        },
                        {
                            "rooms_lat": 49.2699,
                            "rooms_lon": -123.25318,
                            "rooms_seats": 94
                        }
                    ]
                });
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Hydrogen - performQuery: able to find hyperlink for rooms.", function () {
        let query: QueryRequest = {
            "WHERE":{
                "IS":{
                    "rooms_address":"1866 Main Mall"
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_seats",
                    "rooms_href"
                ],
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Tungsten - performQuery:  Invalid query having keys for more than 1 dataset should result in 400.", function () {
        let query: QueryRequest = {
            "WHERE":{
                "AND":[
                    {
                        "IS":{
                            "courses_instructor":"*ka"
                        }
                    },
                    {
                        "IS":{
                            "rooms_fullname":"Allard Hall (LAW)"
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg",
                    "courses_instructor"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Metro - performQuery: able to find rooms with more than a certain number of seats.", function () {
        let query: QueryRequest = {
            "WHERE":{
                "GT":{
                    "rooms_seats":400
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_fullname",
                    "rooms_seats",
                    "rooms_href"
                ],
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.body);
                console.log("check the results and see if it has three results, room_seats should be 426, 442 and 503 respectively.")
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Moonshine - performQuery: able to find some small rooms on campus.", function () {
        let query: QueryRequest = {
            "WHERE":{
                "LT":{
                    "rooms_seats":8
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_fullname",
                    "rooms_seats"
                ],
                "FORM":"TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });


    it("Odyssey - performQuery: Should be able to find all rooms within a certain bounding box.", function () {
        let query: QueryRequest = {
            "WHERE": {

                "AND": [{
                    "GT": {
                        "rooms_lat": 49.2612
                    }
                },
                    {
                        "LT": {
                            "rooms_lat": 49.26129
                        }
                    },
                    {
                        "LT": {
                            "rooms_lon": -123.2480
                        }
                    },
                    {
                        "GT": {
                            "rooms_lon": -123.24809
                        }
                    }
                ]

            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name",
                "FORM": "TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.body);
                expect(response.body).to.deep.equal({
                    "render": "TABLE",
                    "result": [
                        {
                            "rooms_name": "DMP_101"
                        },
                        {
                            "rooms_name": "DMP_110"
                        },
                        {
                            "rooms_name": "DMP_201"
                        },
                        {
                            "rooms_name": "DMP_301"
                        },
                        {
                            "rooms_name": "DMP_310"
                        }
                    ]
                });
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("OkelyDokely - performQuery: Should be able to find all rooms outside a certain bounding box.", function () {
        let query: QueryRequest = {
            "WHERE": {
                "NOT": {
                    "AND": [{
                        "GT": {
                            "rooms_lat": 49.2612
                        }
                    },
                        {
                            "LT": {
                                "rooms_lat": 49.26129
                            }
                        },
                        {
                            "LT": {
                                "rooms_lon": -123.2480
                            }
                        },
                        {
                            "GT": {
                                "rooms_lon": -123.24809
                            }
                        }
                    ]
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_fullname",
                    "rooms_number",
                    "rooms_name",
                    "rooms_seats"
                ],
                "ORDER": "rooms_name",
                "FORM": "TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.code);
                //console.log(response.body);
                //check if the response.body has 359 results.
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });

    });

    it("Complex Query(NOT - OR) - performQuery): Should be able to find all rooms outside a certain bounding box.", function () {
        let query: QueryRequest = {
            "WHERE": {
                "NOT": {
                    "OR": [{
                        "GT": {
                            "rooms_lat": 49.2612
                        }
                    },
                        {
                            "LT": {
                                "rooms_lat": 49.26129
                            }
                        },
                        {
                            "LT": {
                                "rooms_lon": -123.2480
                            }
                        },
                        {
                            "GT": {
                                "rooms_lon": -123.24809
                            }
                        }
                    ]
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_fullname",
                    "rooms_number",
                    "rooms_name",
                    "rooms_seats"
                ],
                "ORDER": "rooms_name",
                "FORM": "TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.code);
                //console.log(response.body);
                //check if the response.body has 359 results.
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });

    });

    it("Cinnamon(1) - removeDataset/performQuery: NOT able to perform query when the dataset has been removed(400)", function () {
        return insight.removeDataset('rooms').then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

});