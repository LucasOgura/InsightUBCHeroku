/**
 * Created by Haoyuan on 2017-01-18.
 */

import {expect} from 'chai';
import {InsightResponse, QueryRequest} from "../src/controller/IInsightFacade";
import {readFileSync} from "fs";
import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";
import Server from '../src/rest/Server';

describe("InsightFacadeSpec", function () {

    let zipFile : string = null;
    let emptyFile : string = null;

    let insight : InsightFacade = null;

    before(function () {
        try {
            zipFile = new Buffer(readFileSync("courses.zip")).toString("Base64");
        }
        catch (e){
            Log.warn("name:" + e.name + "\nmessage:" + e.message);
        }
    });

    beforeEach(function () {
        insight = new InsightFacade();
    });

    it("Test removeDataset: Return code (204)", function () {
        return insight.removeDataset('courses').then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    it("Test removeDataset: Return code (404)", function () {
        return insight.removeDataset('courses').then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(404);
        });
    });

    it("Test addDataset: Invalid dataset - Return code (400)", function () {
        return insight.addDataset('courses', emptyFile).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });


    it("Test addDataset: Return code (204)", function () {
        return insight.addDataset('courses', zipFile).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    it("Gemini - Complex OR query", function () {
        let query: QueryRequest = {
            "WHERE": {

                "OR": [{
                    "GT": {
                        "courses_avg": 70
                    }
                },
                    {
                        "IS": {
                            "courses_dept": "adhe"
                        }
                    },
                    {
                        "GT": {
                            "courses_avg": 70
                        }
                    },
                    {
                        "IS": {
                            "courses_dept": "biol"
                        }
                    }
                ]

            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_avg",
                    "courses_dept"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.code);
                console.log("expect to return 57366 objects");
                //console.log(response.body);
                //check if the response.body has 359 results.
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });

    });



        it("Apollo: Should be able to find all sections for a dept.", function () {
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
                        "courses_id",
                        "courses_year"
                    ],
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

        it("Test performQuery: Asking for a non-existent id (424)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "GT":{
                        "instructors_avg":50
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
                //console.log(response.body);
                expect(response.code).to.equal(424);
            });
        });
        it("FIRETRUCK: Should be able to find all courses in a dept except some specific examples.", function () {
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
                    //console.log(response.body);
                    expect(response.code).to.equal(200);
                }).catch(function (response: InsightResponse) {
                    //console.log(response.body);
                    expect.fail();
                });
        });



        it("GEMINI Test performQuery: COMPLEX OR CASE1 Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "OR":[
                        {
                            "AND":[
                                {
                                    "GT":{
                                    "courses_avg":96
                                }
                                },
                            {
                                "IS":{
                                "courses_dept":"adhe"
                            }
                            }
                        ]
                        },
            {
                "GT":{
                "courses_avg":99
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
                //console.log(response.body);
                expect(response.code).to.equal(200);
            }).catch(function (response: InsightResponse) {
                //console.log(response.body);
                expect.fail();
            });
        });

        it("GEMINI Test performQuery(2): COMPLEX OR CASE2 Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "OR":[
                        {
                            "OR":[
                                {
                                    "GT":{
                                        "courses_avg":90 //used to be 80
                                    }
                                },
                                {
                                    "IS":{
                                        "courses_dept":"biol"
                                    }
                                }
                            ]
                        },
                        {
                            "LT":{
                                "courses_avg":10 //used to be 60
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
                    //console.log(response.body);
                    expect(response.code).to.equal(200);
                }).catch(function (response: InsightResponse) {
                    //console.log(response.body);
                    expect.fail();
                });
        });

        it("GEMINI Test performQuery(3): COMPLEX OR CASE1 Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "AND":[
                        {
                            "OR":[
                                {
                                    "GT":{
                                        "courses_avg":96
                                    }
                                },
                                {
                                    "IS":{
                                        "courses_dept":"adhe"
                                    }
                                }
                            ]
                        },
                        {
                            "GT":{
                                "courses_avg":99
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
                    //console.log(response.body);
                    expect(response.code).to.equal(200);
                }).catch(function (response: InsightResponse) {
                    //console.log(response.body);
                    expect.fail();
                });
        });

        it("Test performQuery: GT OR IS CASE Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                            "OR":[
                                {
                                    "GT":{
                                        "courses_avg":99
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
                   // "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            }

            return insight.performQuery(query).then(function (response: InsightResponse) {
                //console.log(response.body);
                expect(response.code).to.equal(200);
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
        });

        it("Test performQuery:INVALID NESTED Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "OR":[
                        {
                            "AND":[
                                {
                                    "GT":{
                                        "courses_ffff":90
                                    }
                                },
                                {
                                    "IS":{
                                        "courses_dept":"adhe"
                                    }
                                }
                            ]
                        },
                        {
                            "EQ":{
                                "courses_avg":95
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
                   // "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            };

            return insight.performQuery(query).then(function (response: InsightResponse) {
                //console.log(response.body);
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
        });


        it("Test performQuery: GT - Find courses_avg using NOT (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "NOT": { "NOT": {
                        "LT": {
                            "courses_avg":5
                        }
                    }}
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
            let ResponseBody = {
                render: 'TABLE',
                result:
                    [ { courses_dept: 'frst', courses_avg: 0 },
                        { courses_dept: 'lfs', courses_avg: 0 },
                        { courses_dept: 'lfs', courses_avg: 0 },
                        { courses_dept: 'wood', courses_avg: 1 },
                        { courses_dept: 'busi', courses_avg: 4 },
                        { courses_dept: 'busi', courses_avg: 4 },
                        { courses_dept: 'fopr', courses_avg: 4.5 }
                        ] }

            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                //console.log(response.body);
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
        });

        it("Test performQuery: GT - Find courses_avg Should be able to perform queries (200)", function () {
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
            let ResponseBody = {
             render: 'TABLE',
                result:
                [ { courses_dept: 'epse', courses_avg: 97.09 },
                    { courses_dept: 'math', courses_avg: 97.09 },
                    { courses_dept: 'math', courses_avg: 97.09 },
                    { courses_dept: 'epse', courses_avg: 97.09 },
                    { courses_dept: 'math', courses_avg: 97.25 },
                    { courses_dept: 'math', courses_avg: 97.25 },
                    { courses_dept: 'epse', courses_avg: 97.29 },
                    { courses_dept: 'epse', courses_avg: 97.29 },
                    { courses_dept: 'nurs', courses_avg: 97.33 },
                    { courses_dept: 'nurs', courses_avg: 97.33 },
                    { courses_dept: 'epse', courses_avg: 97.41 },
                    { courses_dept: 'epse', courses_avg: 97.41 },
                    { courses_dept: 'cnps', courses_avg: 97.47 },
                    { courses_dept: 'cnps', courses_avg: 97.47 },
                    { courses_dept: 'math', courses_avg: 97.48 },
                    { courses_dept: 'math', courses_avg: 97.48 },
                    { courses_dept: 'educ', courses_avg: 97.5 },
                    { courses_dept: 'nurs', courses_avg: 97.53 },
                    { courses_dept: 'nurs', courses_avg: 97.53 },
                    { courses_dept: 'epse', courses_avg: 97.67 },
                    { courses_dept: 'epse', courses_avg: 97.69 },
                    { courses_dept: 'epse', courses_avg: 97.78 },
                    { courses_dept: 'crwr', courses_avg: 98 },
                    { courses_dept: 'crwr', courses_avg: 98 },
                    { courses_dept: 'epse', courses_avg: 98.08 },
                    { courses_dept: 'nurs', courses_avg: 98.21 },
                    { courses_dept: 'nurs', courses_avg: 98.21 },
                    { courses_dept: 'epse', courses_avg: 98.36 },
                    { courses_dept: 'epse', courses_avg: 98.45 },
                    { courses_dept: 'epse', courses_avg: 98.45 },
                    { courses_dept: 'nurs', courses_avg: 98.5 },
                    { courses_dept: 'nurs', courses_avg: 98.5 },
                    { courses_dept: 'epse', courses_avg: 98.58 },
                    { courses_dept: 'nurs', courses_avg: 98.58 },
                    { courses_dept: 'nurs', courses_avg: 98.58 },
                    { courses_dept: 'epse', courses_avg: 98.58 },
                    { courses_dept: 'epse', courses_avg: 98.7 },
                    { courses_dept: 'nurs', courses_avg: 98.71 },
                    { courses_dept: 'nurs', courses_avg: 98.71 },
                    { courses_dept: 'eece', courses_avg: 98.75 },
                    { courses_dept: 'eece', courses_avg: 98.75 },
                    { courses_dept: 'epse', courses_avg: 98.76 },
                    { courses_dept: 'epse', courses_avg: 98.76 },
                    { courses_dept: 'epse', courses_avg: 98.8 },
                    { courses_dept: 'spph', courses_avg: 98.98 },
                    { courses_dept: 'spph', courses_avg: 98.98 },
                    { courses_dept: 'cnps', courses_avg: 99.19 },
                    { courses_dept: 'math', courses_avg: 99.78 },
                    { courses_dept: 'math', courses_avg: 99.78 } ] }

            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect(response.body == (ResponseBody));
                //console.log(response.body);
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
        });


        it("Test performQuery: LT - Find courses_avg Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "LT":{
                        "courses_avg":30
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg",
                        "courses_id"
                    ],
                    "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            };


            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(typeof(response.body));
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
        });

        it("Test performQuery: EQ - Find courses_avg Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "EQ":{
                        "courses_avg":90
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg",
                        "courses_id"
                    ],
                    "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            };


            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
        });



        it("Test performQuery: IS - Find courses_uuid Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "IS":{
                        "courses_uuid":'23232'
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg",
                        "courses_id"
                    ],
                    "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            };

            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
        });

        it("Test performQuery: PARTIAL NAME - exact match - Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "IS":{
                        "courses_instructor":"bendickson, dennis"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg",
                        "courses_id"
                    ],
                    "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            };
            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                //console.log(typeof(response.body));
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
        });

        it("Test performQuery: ABSENCE OF OPTIONS- Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "IS":{
                        "courses_instructor":"bendickson, dennis"
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
                expect(response.code).to.equal(200);
                console.log(response.body);
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
        });

        it("Test performQuery: JIRO - INVALID ORDER POSITION- Should NOT be able to perform queries (400)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "GT":{
                        "courses_avg":97
                    },
                    "ORDER":"courses_avg",
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
                //console.log(response.body);
                expect(response.code).to.equal(400);
            });
        });

        it("Test performQuery: JIRO - INVALID OPTIONS- Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "IS":{
                        "courses_instructor":"bendickson, dennis"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg",
                        "courses_id"
                    ],
                    "ORDER":"coursesd_avg",
                    "FORM":"TABLE"
                }
            };
            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                //console.log(response.body);
                expect(response.code).to.equal(400);
            });
        });

        it("Test performQuery: JIRO - INVALID OPTIONS - 2 - Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "GT":{
                        "courses_avg":97
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg",
                        "courses_id"
                    ],
                    "ORDER":"courses_uuid",
                    "FORM":"TABLE"
                }
            };
            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                //console.log(response.body);
                expect(response.code).to.equal(400);
            });
        });

        it("Test performQuery: JIRO - INVALID OPTIONS - 3 - Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "GT":{
                        "courses_avg":97
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg",
                        "courses_id"
                    ],
                    "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            };
            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                //console.log(response.body);
                //console.log(response.code);
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
        });

        it("Test performQuery: PARTIAL NAME - Match End -  Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "IS":{
                        "courses_instructor":"*elle"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg",
                        "courses_id"
                    ],
                    "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            };
            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                //console.log(response.body);
                //console.log(typeof(response.body));
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
        });

        it("Test performQuery: PARTIAL NAME - matchStart Should be able to perform queries (200)", function () {
            let query: QueryRequest =  {
                "WHERE":{
                    "IS":{
                        "courses_instructor":"kar*"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg",
                        "courses_instructor"
                    ],
                    "ORDER":"courses_avg",
                    "FORM":"TABLE"
                }
            };
            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                //console.log(typeof(response.body));
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
        });

        it("Test performQuery: FIREFLY: Firefly: Should be able to find all instructurs in a dept with a partial name. (200)", function () {
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
                                "courses_dept":"math"
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
            return insight.performQuery(query)
                .then(function (response: InsightResponse) {
                    //console.log(response.body);
                    expect(response.code).to.equal(200);
                }).catch(function (response: InsightResponse) {
                    //console.log(response.body);
                    expect.fail();
                });
        });


        it("Test performQuery: GT - single -  Find courses_avg using NOT (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "NOT": {
                        "GT": {
                            "courses_avg": 5
                        }
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
            let ResponseBody = {
                render: 'TABLE',
                result:
                    [ { courses_dept: 'frst', courses_avg: 0 },
                        { courses_dept: 'lfs', courses_avg: 0 },
                        { courses_dept: 'lfs', courses_avg: 0 },
                        { courses_dept: 'wood', courses_avg: 1 },
                        { courses_dept: 'busi', courses_avg: 4 },
                        { courses_dept: 'busi', courses_avg: 4 },
                        { courses_dept: 'fopr', courses_avg: 4.5 }
                    ] }

            return insight.performQuery(query).then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                //console.log(typeof(response.body));
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
        });

        it("Test performQuery: DEEPMIND (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "AND":[


                                {
                                    "GT":{
                                    "courses_avg":70
                                    }
                                },
                                {
                                    "LT":{
                                    "courses_avg":80
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
                    //console.log(response.body);
                    expect(response.code).to.equal(200);
                }).catch(function (response: InsightResponse) {
                    //console.log(response.body);
                    expect.fail();
                });
        });

        it("Test performQuery: invalid Nested key Find courses_avg Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "GT":{
                        "courses_a":46
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                            "courses_dept",
                                "courses_avg",
                                "courses_id"
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

        it("Test performQuery: invalid Nested key Find courses_avg Should be able to perform queries (200)", function () {
            let query: QueryRequest = {
                "WHERE":{
                    "IS":{
                        "courses_ins":"sdgsdgsg"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                            "courses_avg",
                            "courses_id"
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

});