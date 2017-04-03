/**
 * Created by Haoyuan on 2017-03-01.
 */
import {expect} from 'chai';
import {InsightResponse, QueryRequest} from "../src/controller/IInsightFacade";
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
    it("Riviera(UP): Able to sort multiple keys", function () {
        let query: QueryRequest =  {
            "WHERE":{
                "AND": [{
                    "LT": {
                        "courses_avg": 97.2
                    }
                }, {
                    "GT": {
                        "courses_avg": 96.9
                    }
                }]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "sectionMAX"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["sectionMAX","courses_id"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept","courses_id"],
                "APPLY": [{
                    "sectionMAX": {
                        "MAX": "courses_avg"
                    }
                }]
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code).to.equal(200);
            console.log(response.body);
            expect(response.body).to.deep.equal({
                "render": "TABLE",
                "result": [
                    {
                        "courses_dept": "arst",
                        "courses_id": "550",
                        "sectionMAX": 96.94
                    },
                    {
                        "courses_dept": "spph",
                        "courses_id": "200",
                        "sectionMAX": 96.96
                    },
                    {
                        "courses_dept": "epse",
                        "courses_id": "534",
                        "sectionMAX": 97
                    },
                    {
                        "courses_dept": "psyc",
                        "courses_id": "549",
                        "sectionMAX": 97
                    },
                    {
                        "courses_dept": "crwr",
                        "courses_id": "599",
                        "sectionMAX": 97
                    },
                    {
                        "courses_dept": "math",
                        "courses_id": "541",
                        "sectionMAX": 97.09
                    },
                    {
                        "courses_dept": "epse",
                        "courses_id": "596",
                        "sectionMAX": 97.09
                    }
                ]
            });
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    it("Riviera(DOWN): Able to sort multiple keys", function () {
        let query: QueryRequest =  {
            "WHERE":{
                "AND": [{
                    "LT": {
                        "courses_avg": 97.2
                    }
                }, {
                    "GT": {
                        "courses_avg": 96.9
                    }
                }]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "sectionMAX"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["sectionMAX","courses_id"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept","courses_id"],
                "APPLY": [{
                    "sectionMAX": {
                        "MAX": "courses_avg"
                    }
                }]
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code).to.equal(200);
            console.log(response.body);
            expect(response.body).to.deep.equal({
                "render": "TABLE",
                "result": [
                    {
                        "courses_dept": "epse",
                        "courses_id": "596",
                        "sectionMAX": 97.09
                    },
                    {
                        "courses_dept": "math",
                        "courses_id": "541",
                        "sectionMAX": 97.09
                    },
                    {
                        "courses_dept": "crwr",
                        "courses_id": "599",
                        "sectionMAX": 97
                    },
                    {
                        "courses_dept": "psyc",
                        "courses_id": "549",
                        "sectionMAX": 97
                    },
                    {
                        "courses_dept": "epse",
                        "courses_id": "534",
                        "sectionMAX": 97
                    },
                    {
                        "courses_dept": "spph",
                        "courses_id": "200",
                        "sectionMAX": 96.96
                    },
                    {
                        "courses_dept": "arst",
                        "courses_id": "550",
                        "sectionMAX": 96.94
                    }
                ]
            });
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    xit("Taurus: Should be able to find the average of all courses within a department", function () {
        let query: QueryRequest =  {
            "WHERE":{},
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "deptAVG"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["deptAVG","courses_dept"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept"],
                "APPLY": [{
                    "deptAVG": {
                        "AVG": "courses_avg"
                    }
                }]
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code).to.equal(200);
            console.log(response.body);
            expect(response.body).to.deep.equal({
                "render": "TABLE",
                "result": [
                    {
                        "courses_dept": "aanb",
                        "deptAVG": 91.1
                    },
                    {
                        "courses_dept": "epse",
                        "deptAVG": 89.94
                    },
                    {
                        "courses_dept": "onco",
                        "deptAVG": 89.82
                    },
                    {
                        "courses_dept": "biof",
                        "deptAVG": 89.77
                    },
                    {
                        "courses_dept": "cell",
                        "deptAVG": 89.15
                    },
                    {
                        "courses_dept": "etec",
                        "deptAVG": 89.05
                    },
                    {
                        "courses_dept": "zool",
                        "deptAVG": 89
                    },
                    {
                        "courses_dept": "chil",
                        "deptAVG": 88.93
                    },
                    {
                        "courses_dept": "edcp",
                        "deptAVG": 88.39
                    },
                    {
                        "courses_dept": "gsat",
                        "deptAVG": 87.83
                    },
                    {
                        "courses_dept": "plan",
                        "deptAVG": 87.67
                    },
                    {
                        "courses_dept": "fish",
                        "deptAVG": 87.65
                    },
                    {
                        "courses_dept": "edst",
                        "deptAVG": 87.62
                    },
                    {
                        "courses_dept": "medi",
                        "deptAVG": 87.41
                    },
                    {
                        "courses_dept": "bota",
                        "deptAVG": 87.41
                    },
                    {
                        "courses_dept": "sts",
                        "deptAVG": 87.25
                    },
                    {
                        "courses_dept": "cnps",
                        "deptAVG": 87.04
                    },
                    {
                        "courses_dept": "midw",
                        "deptAVG": 86.93
                    },
                    {
                        "courses_dept": "phth",
                        "deptAVG": 86.59
                    },
                    {
                        "courses_dept": "cnto",
                        "deptAVG": 86.54
                    },
                    {
                        "courses_dept": "lais",
                        "deptAVG": 86.5
                    },
                    {
                        "courses_dept": "hunu",
                        "deptAVG": 86.47
                    },
                    {
                        "courses_dept": "spph",
                        "deptAVG": 86.36
                    },
                    {
                        "courses_dept": "audi",
                        "deptAVG": 86.35
                    },
                    {
                        "courses_dept": "hgse",
                        "deptAVG": 86.23
                    },
                    {
                        "courses_dept": "rhsc",
                        "deptAVG": 85.99
                    },
                    {
                        "courses_dept": "ccst",
                        "deptAVG": 85.77
                    },
                    {
                        "courses_dept": "info",
                        "deptAVG": 85.4
                    },
                    {
                        "courses_dept": "eece",
                        "deptAVG": 85.4
                    },
                    {
                        "courses_dept": "obst",
                        "deptAVG": 85.36
                    },
                    {
                        "courses_dept": "rsot",
                        "deptAVG": 85.28
                    },
                    {
                        "courses_dept": "libe",
                        "deptAVG": 85.08
                    },
                    {
                        "courses_dept": "udes",
                        "deptAVG": 84.97
                    },
                    {
                        "courses_dept": "pcth",
                        "deptAVG": 84.96
                    },
                    {
                        "courses_dept": "jrnl",
                        "deptAVG": 84.93
                    },
                    {
                        "courses_dept": "sans",
                        "deptAVG": 84.92
                    },
                    {
                        "courses_dept": "gbpr",
                        "deptAVG": 84.9
                    },
                    {
                        "courses_dept": "anat",
                        "deptAVG": 84.9
                    },
                    {
                        "courses_dept": "gpp",
                        "deptAVG": 84.89
                    },
                    {
                        "courses_dept": "eced",
                        "deptAVG": 84.88
                    },
                    {
                        "courses_dept": "bmeg",
                        "deptAVG": 84.84
                    },
                    {
                        "courses_dept": "sowk",
                        "deptAVG": 84.77
                    },
                    {
                        "courses_dept": "libr",
                        "deptAVG": 84.74
                    },
                    {
                        "courses_dept": "name",
                        "deptAVG": 84.63
                    },
                    {
                        "courses_dept": "iar",
                        "deptAVG": 84.6
                    },
                    {
                        "courses_dept": "nurs",
                        "deptAVG": 84.53
                    },
                    {
                        "courses_dept": "arst",
                        "deptAVG": 84.49
                    },
                    {
                        "courses_dept": "mrne",
                        "deptAVG": 84.41
                    },
                    {
                        "courses_dept": "dent",
                        "deptAVG": 84.32
                    },
                    {
                        "courses_dept": "hinu",
                        "deptAVG": 84.28
                    },
                    {
                        "courses_dept": "phrm",
                        "deptAVG": 84.25
                    },
                    {
                        "courses_dept": "ceen",
                        "deptAVG": 84.25
                    },
                    {
                        "courses_dept": "medg",
                        "deptAVG": 84.23
                    },
                    {
                        "courses_dept": "nrsc",
                        "deptAVG": 84.21
                    },
                    {
                        "courses_dept": "iwme",
                        "deptAVG": 84
                    },
                    {
                        "courses_dept": "rmes",
                        "deptAVG": 83.86
                    },
                    {
                        "courses_dept": "educ",
                        "deptAVG": 83.72
                    },
                    {
                        "courses_dept": "dani",
                        "deptAVG": 83.57
                    },
                    {
                        "courses_dept": "path",
                        "deptAVG": 83.23
                    },
                    {
                        "courses_dept": "crwr",
                        "deptAVG": 83.1
                    },
                    {
                        "courses_dept": "bait",
                        "deptAVG": 83.04
                    },
                    {
                        "courses_dept": "adhe",
                        "deptAVG": 82.94
                    },
                    {
                        "courses_dept": "thtr",
                        "deptAVG": 82.81
                    },
                    {
                        "courses_dept": "bafi",
                        "deptAVG": 82.79
                    },
                    {
                        "courses_dept": "bams",
                        "deptAVG": 82.78
                    },
                    {
                        "courses_dept": "baul",
                        "deptAVG": 82.68
                    },
                    {
                        "courses_dept": "cics",
                        "deptAVG": 82.56
                    },
                    {
                        "courses_dept": "basm",
                        "deptAVG": 82.55
                    },
                    {
                        "courses_dept": "baen",
                        "deptAVG": 82.55
                    },
                    {
                        "courses_dept": "larc",
                        "deptAVG": 82.51
                    },
                    {
                        "courses_dept": "spha",
                        "deptAVG": 82.5
                    },
                    {
                        "courses_dept": "babs",
                        "deptAVG": 82.46
                    },
                    {
                        "courses_dept": "surg",
                        "deptAVG": 82.43
                    },
                    {
                        "courses_dept": "soil",
                        "deptAVG": 82.38
                    },
                    {
                        "courses_dept": "fipr",
                        "deptAVG": 82.15
                    },
                    {
                        "courses_dept": "ba",
                        "deptAVG": 82.02
                    },
                    {
                        "courses_dept": "pers",
                        "deptAVG": 82.01
                    },
                    {
                        "courses_dept": "bama",
                        "deptAVG": 81.92
                    },
                    {
                        "courses_dept": "envr",
                        "deptAVG": 81.7
                    },
                    {
                        "courses_dept": "food",
                        "deptAVG": 81.68
                    },
                    {
                        "courses_dept": "phar",
                        "deptAVG": 81.66
                    },
                    {
                        "courses_dept": "isci",
                        "deptAVG": 81.65
                    },
                    {
                        "courses_dept": "swed",
                        "deptAVG": 81.58
                    },
                    {
                        "courses_dept": "russ",
                        "deptAVG": 81.52
                    },
                    {
                        "courses_dept": "ufor",
                        "deptAVG": 81.5
                    },
                    {
                        "courses_dept": "bapa",
                        "deptAVG": 81.41
                    },
                    {
                        "courses_dept": "bahr",
                        "deptAVG": 81.35
                    },
                    {
                        "courses_dept": "pols",
                        "deptAVG": 81.32
                    },
                    {
                        "courses_dept": "dhyg",
                        "deptAVG": 81.28
                    },
                    {
                        "courses_dept": "atsc",
                        "deptAVG": 81.27
                    },
                    {
                        "courses_dept": "basc",
                        "deptAVG": 81.25
                    },
                    {
                        "courses_dept": "arch",
                        "deptAVG": 81.24
                    },
                    {
                        "courses_dept": "caps",
                        "deptAVG": 81.16
                    },
                    {
                        "courses_dept": "scan",
                        "deptAVG": 81.12
                    },
                    {
                        "courses_dept": "fnel",
                        "deptAVG": 81.05
                    },
                    {
                        "courses_dept": "punj",
                        "deptAVG": 81
                    },
                    {
                        "courses_dept": "appp",
                        "deptAVG": 80.7
                    },
                    {
                        "courses_dept": "ends",
                        "deptAVG": 80.61
                    },
                    {
                        "courses_dept": "ursy",
                        "deptAVG": 80.35
                    },
                    {
                        "courses_dept": "baac",
                        "deptAVG": 80.27
                    },
                    {
                        "courses_dept": "arbc",
                        "deptAVG": 80.09
                    },
                    {
                        "courses_dept": "musc",
                        "deptAVG": 80
                    },
                    {
                        "courses_dept": "port",
                        "deptAVG": 79.99
                    },
                    {
                        "courses_dept": "civl",
                        "deptAVG": 79.96
                    },
                    {
                        "courses_dept": "igen",
                        "deptAVG": 79.87
                    },
                    {
                        "courses_dept": "mine",
                        "deptAVG": 79.77
                    },
                    {
                        "courses_dept": "grsj",
                        "deptAVG": 79.74
                    },
                    {
                        "courses_dept": "germ",
                        "deptAVG": 79.7
                    },
                    {
                        "courses_dept": "micb",
                        "deptAVG": 79.53
                    },
                    {
                        "courses_dept": "cens",
                        "deptAVG": 79.49
                    },
                    {
                        "courses_dept": "kin",
                        "deptAVG": 79.33
                    },
                    {
                        "courses_dept": "cohr",
                        "deptAVG": 79.08
                    },
                    {
                        "courses_dept": "chbe",
                        "deptAVG": 79.06
                    },
                    {
                        "courses_dept": "mech",
                        "deptAVG": 79.01
                    },
                    {
                        "courses_dept": "enph",
                        "deptAVG": 78.99
                    },
                    {
                        "courses_dept": "grek",
                        "deptAVG": 78.97
                    },
                    {
                        "courses_dept": "ling",
                        "deptAVG": 78.84
                    },
                    {
                        "courses_dept": "cnrs",
                        "deptAVG": 78.68
                    },
                    {
                        "courses_dept": "lfs",
                        "deptAVG": 78.42
                    },
                    {
                        "courses_dept": "lled",
                        "deptAVG": 78.39
                    },
                    {
                        "courses_dept": "fnh",
                        "deptAVG": 78.28
                    },
                    {
                        "courses_dept": "phys",
                        "deptAVG": 78.21
                    },
                    {
                        "courses_dept": "frst",
                        "deptAVG": 78.13
                    },
                    {
                        "courses_dept": "urst",
                        "deptAVG": 78.09
                    },
                    {
                        "courses_dept": "cons",
                        "deptAVG": 77.98
                    },
                    {
                        "courses_dept": "cpen",
                        "deptAVG": 77.94
                    },
                    {
                        "courses_dept": "bioc",
                        "deptAVG": 77.9
                    },
                    {
                        "courses_dept": "arth",
                        "deptAVG": 77.87
                    },
                    {
                        "courses_dept": "hebr",
                        "deptAVG": 77.76
                    },
                    {
                        "courses_dept": "fhis",
                        "deptAVG": 77.75
                    },
                    {
                        "courses_dept": "eosc",
                        "deptAVG": 77.75
                    },
                    {
                        "courses_dept": "fnis",
                        "deptAVG": 77.73
                    },
                    {
                        "courses_dept": "rgla",
                        "deptAVG": 77.64
                    },
                    {
                        "courses_dept": "apbi",
                        "deptAVG": 77.62
                    },
                    {
                        "courses_dept": "cpsc",
                        "deptAVG": 77.58
                    },
                    {
                        "courses_dept": "anth",
                        "deptAVG": 77.56
                    },
                    {
                        "courses_dept": "coec",
                        "deptAVG": 77.54
                    },
                    {
                        "courses_dept": "fre",
                        "deptAVG": 77.27
                    },
                    {
                        "courses_dept": "cogs",
                        "deptAVG": 77.07
                    },
                    {
                        "courses_dept": "bala",
                        "deptAVG": 77.05
                    },
                    {
                        "courses_dept": "asic",
                        "deptAVG": 76.94
                    },
                    {
                        "courses_dept": "visa",
                        "deptAVG": 76.93
                    },
                    {
                        "courses_dept": "relg",
                        "deptAVG": 76.71
                    },
                    {
                        "courses_dept": "apsc",
                        "deptAVG": 76.63
                    },
                    {
                        "courses_dept": "soci",
                        "deptAVG": 76.47
                    },
                    {
                        "courses_dept": "chin",
                        "deptAVG": 76.46
                    },
                    {
                        "courses_dept": "econ",
                        "deptAVG": 76.4
                    },
                    {
                        "courses_dept": "astr",
                        "deptAVG": 76.37
                    },
                    {
                        "courses_dept": "comm",
                        "deptAVG": 76.36
                    },
                    {
                        "courses_dept": "korn",
                        "deptAVG": 76.35
                    },
                    {
                        "courses_dept": "itst",
                        "deptAVG": 76.26
                    },
                    {
                        "courses_dept": "law",
                        "deptAVG": 76.22
                    },
                    {
                        "courses_dept": "biol",
                        "deptAVG": 76
                    },
                    {
                        "courses_dept": "mtrl",
                        "deptAVG": 75.94
                    },
                    {
                        "courses_dept": "fist",
                        "deptAVG": 75.93
                    },
                    {
                        "courses_dept": "clch",
                        "deptAVG": 75.84
                    },
                    {
                        "courses_dept": "elec",
                        "deptAVG": 75.8
                    },
                    {
                        "courses_dept": "stat",
                        "deptAVG": 75.75
                    },
                    {
                        "courses_dept": "last",
                        "deptAVG": 75.47
                    },
                    {
                        "courses_dept": "wood",
                        "deptAVG": 75.36
                    },
                    {
                        "courses_dept": "fopr",
                        "deptAVG": 75.2
                    },
                    {
                        "courses_dept": "scie",
                        "deptAVG": 75.19
                    },
                    {
                        "courses_dept": "mdvl",
                        "deptAVG": 74.89
                    },
                    {
                        "courses_dept": "latn",
                        "deptAVG": 74.88
                    },
                    {
                        "courses_dept": "ital",
                        "deptAVG": 74.71
                    },
                    {
                        "courses_dept": "geog",
                        "deptAVG": 74.54
                    },
                    {
                        "courses_dept": "asia",
                        "deptAVG": 74.54
                    },
                    {
                        "courses_dept": "span",
                        "deptAVG": 74.35
                    },
                    {
                        "courses_dept": "poli",
                        "deptAVG": 74.32
                    },
                    {
                        "courses_dept": "clst",
                        "deptAVG": 74.32
                    },
                    {
                        "courses_dept": "chem",
                        "deptAVG": 74.29
                    },
                    {
                        "courses_dept": "nest",
                        "deptAVG": 74.19
                    },
                    {
                        "courses_dept": "hist",
                        "deptAVG": 74.06
                    },
                    {
                        "courses_dept": "engl",
                        "deptAVG": 73.97
                    },
                    {
                        "courses_dept": "fren",
                        "deptAVG": 73.66
                    },
                    {
                        "courses_dept": "geob",
                        "deptAVG": 73.56
                    },
                    {
                        "courses_dept": "laso",
                        "deptAVG": 73.51
                    },
                    {
                        "courses_dept": "arcl",
                        "deptAVG": 73.32
                    },
                    {
                        "courses_dept": "japn",
                        "deptAVG": 73.19
                    },
                    {
                        "courses_dept": "fmst",
                        "deptAVG": 72.76
                    },
                    {
                        "courses_dept": "psyc",
                        "deptAVG": 72.59
                    },
                    {
                        "courses_dept": "phil",
                        "deptAVG": 72.58
                    },
                    {
                        "courses_dept": "astu",
                        "deptAVG": 72.27
                    },
                    {
                        "courses_dept": "math",
                        "deptAVG": 72.03
                    },
                    {
                        "courses_dept": "busi",
                        "deptAVG": 70.64
                    },
                    {
                        "courses_dept": "wrds",
                        "deptAVG": 70.29
                    },
                    {
                        "courses_dept": "rmst",
                        "deptAVG": 69.92
                    },
                    {
                        "courses_dept": "vant",
                        "deptAVG": 68.31
                    },
                    {
                        "courses_dept": "test",
                        "deptAVG": 60
                    }
                ]
            });
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    it("Taurus(2): Should be able to find the average of all courses within a department", function () {
        let query: QueryRequest =  {
            "WHERE":{
                "IS": {
                "courses_dept": "cpsc"
            }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "deptAVG"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["deptAVG","courses_dept"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept","courses_id"],
                "APPLY": [{
                    "deptAVG": {
                        "AVG": "courses_avg"
                    }
                }]
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code).to.equal(200);
            console.log(response.body);
            expect(response.body).to.deep.equal({
                "render": "TABLE",
                "result": [
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "449",
                        "deptAVG": 90.38
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "501",
                        "deptAVG": 89.78
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "490",
                        "deptAVG": 89.77
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "547",
                        "deptAVG": 88.6
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "503",
                        "deptAVG": 88.1
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "527",
                        "deptAVG": 87.47
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "507",
                        "deptAVG": 87.46
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "509",
                        "deptAVG": 86.04
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "540",
                        "deptAVG": 85.86
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "543",
                        "deptAVG": 85.82
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "589",
                        "deptAVG": 85.76
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "522",
                        "deptAVG": 85.17
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "521",
                        "deptAVG": 85.07
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "319",
                        "deptAVG": 84.51
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "544",
                        "deptAVG": 84.32
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "500",
                        "deptAVG": 83.97
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "502",
                        "deptAVG": 82.97
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "513",
                        "deptAVG": 82.69
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "301",
                        "deptAVG": 81.84
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "515",
                        "deptAVG": 81.83
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "445",
                        "deptAVG": 80.88
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "312",
                        "deptAVG": 80.69
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "418",
                        "deptAVG": 80.5
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "411",
                        "deptAVG": 80.18
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "444",
                        "deptAVG": 78.82
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "344",
                        "deptAVG": 78.47
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "310",
                        "deptAVG": 78.25
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "430",
                        "deptAVG": 77.4
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "311",
                        "deptAVG": 77.26
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "410",
                        "deptAVG": 77.12
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "314",
                        "deptAVG": 76.78
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "304",
                        "deptAVG": 76.31
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "340",
                        "deptAVG": 75.7
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "121",
                        "deptAVG": 75.55
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "302",
                        "deptAVG": 75.52
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "416",
                        "deptAVG": 74.91
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "421",
                        "deptAVG": 74.91
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "221",
                        "deptAVG": 74.5
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "259",
                        "deptAVG": 74.46
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "110",
                        "deptAVG": 74.41
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "404",
                        "deptAVG": 74.33
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "213",
                        "deptAVG": 74.05
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "210",
                        "deptAVG": 74
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "313",
                        "deptAVG": 73.99
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "425",
                        "deptAVG": 73.94
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "322",
                        "deptAVG": 73.13
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "422",
                        "deptAVG": 72.99
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "303",
                        "deptAVG": 72.77
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "317",
                        "deptAVG": 72.58
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "420",
                        "deptAVG": 72.24
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "415",
                        "deptAVG": 70.93
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "320",
                        "deptAVG": 70.1
                    },
                    {
                        "courses_dept": "cpsc",
                        "courses_id": "261",
                        "deptAVG": 69.17
                    }
                ]
            });
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    it("Sagittarius: Apply: COUNT should be supported", function () {
        let query: QueryRequest =  {
            "WHERE":{
                "AND": [{
                    "GT": {
                        "courses_avg": 98
                    }
                }, {
                    "GT": {
                        "courses_avg": 97
                    }
                }]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "countSection"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["countSection","courses_id"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept","courses_id"],
                "APPLY": [{
                    "countSection": {
                        "COUNT": "courses_id"
                    }
                }]
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect(response.code).to.equal(200);
            console.log(response.body);
            expect(response.body).to.deep.equal({
                "render": "TABLE",
                "result": [
                    {
                        "courses_dept": "nurs",
                        "courses_id": "578",
                        "countSection": 1
                    },
                    {
                        "courses_dept": "cnps",
                        "courses_id": "574",
                        "countSection": 1
                    },
                    {
                        "courses_dept": "eece",
                        "courses_id": "541",
                        "countSection": 1
                    },
                    {
                        "courses_dept": "math",
                        "courses_id": "527",
                        "countSection": 1
                    },
                    {
                        "courses_dept": "epse",
                        "courses_id": "519",
                        "countSection": 1
                    },
                    {
                        "courses_dept": "nurs",
                        "courses_id": "509",
                        "countSection": 1
                    },
                    {
                        "courses_dept": "epse",
                        "courses_id": "449",
                        "countSection": 1
                    },
                    {
                        "courses_dept": "epse",
                        "courses_id": "421",
                        "countSection": 1
                    },
                    {
                        "courses_dept": "spph",
                        "courses_id": "300",
                        "countSection": 1
                    }
                ]
            })
        }).catch(function (response: InsightResponse) {
            expect.fail();
        });
    });

    it("Sagittarius(2): Apply: COUNT should be supported", function () {
        let query: QueryRequest =
            {
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_furniture",
                        "countRows"
                    ],
                    "ORDER": "rooms_furniture",
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_furniture"],
                    "APPLY": [{
                        "countRows": {
                            "COUNT": "rooms_seats"
                        }
                    }]
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
                            "rooms_furniture": "Classroom-Fixed Tables\/Fixed Chairs",
                            "countRows": 9
                        },
                        {
                            "rooms_furniture": "Classroom-Fixed Tables\/Movable Chairs",
                            "countRows": 37
                        },
                        {
                            "rooms_furniture": "Classroom-Fixed Tables\/Moveable Chairs",
                            "countRows": 2
                        },
                        {
                            "rooms_furniture": "Classroom-Fixed Tablets",
                            "countRows": 27
                        },
                        {
                            "rooms_furniture": "Classroom-Hybrid Furniture",
                            "countRows": 6
                        },
                        {
                            "rooms_furniture": "Classroom-Learn Lab",
                            "countRows": 3
                        },
                        {
                            "rooms_furniture": "Classroom-Movable Tables & Chairs",
                            "countRows": 40
                        },
                        {
                            "rooms_furniture": "Classroom-Movable Tablets",
                            "countRows": 18
                        },
                        {
                            "rooms_furniture": "Classroom-Moveable Tables & Chairs",
                            "countRows": 10
                        },
                        {
                            "rooms_furniture": "Classroom-Moveable Tablets",
                            "countRows": 1
                        }
                    ]
                });
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });


    it("Sample Query I - performQuery: able to perform query when the dataset is added", function () {
        let query: QueryRequest = {
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
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.body);
                expect(response.body).to.deep.equal({
                    "render": "TABLE",
                    "result": [
                        {
                            "rooms_shortname": "OSBO",
                            "rooms_address": "6108 Thunderbird Boulevard",
                            "maxSeats": 442
                        },
                        {
                            "rooms_shortname": "HEBB",
                            "rooms_address": "2045 East Mall",
                            "maxSeats": 375
                        },
                        {
                            "rooms_shortname": "LSC",
                            "rooms_address": "2350 Health Sciences Mall",
                            "maxSeats": 350
                        }
                    ]
                });
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Sample Query II - performQuery: able to perform query when the dataset is added", function () {
        let query: QueryRequest = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture"
                ],
                "ORDER": "rooms_furniture",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": []
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.body);
                expect(response.body).to.deep.equal({
                    "render": "TABLE",
                    "result": [{
                        "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs"
                    }, {
                        "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs"
                    }, {
                        "rooms_furniture": "Classroom-Fixed Tables/Moveable Chairs"
                    }, {
                        "rooms_furniture": "Classroom-Fixed Tablets"
                    }, {
                        "rooms_furniture": "Classroom-Hybrid Furniture"
                    }, {
                        "rooms_furniture": "Classroom-Learn Lab"
                    }, {
                        "rooms_furniture": "Classroom-Movable Tables & Chairs"
                    }, {
                        "rooms_furniture": "Classroom-Movable Tablets"
                    }, {
                        "rooms_furniture": "Classroom-Moveable Tables & Chairs"
                    }, {
                        "rooms_furniture": "Classroom-Moveable Tablets"
                    }]
                });
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Sample Query III - performQuery: able to perform query when the dataset is added", function () {
        let query: QueryRequest = {
            "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" }}, { "GT": { "rooms_seats": 200}}]},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "totalSeats",
                    "maxSeats",
                    "avgSeats",
                    "minLat"],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["totalSeats"]},
                "FORM": "TABLE" },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "totalSeats": {
                        "SUM": "rooms_seats"}},
                    {"maxSeats": {
                        "MAX": "rooms_seats"}},
                    {"avgSeats": {
                        "AVG": "rooms_seats"}},
                    {"minLat": {
                        "MIN": "rooms_lat"}}
                ]}
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.body);
                expect(response.body).to.deep.equal({
                    "render": "TABLE",
                    "result": [
                        {
                            "rooms_shortname": "SRC",
                            "totalSeats": 897,
                            "maxSeats": 299,
                            "avgSeats": 299,
                            "minLat": 49.2683
                        },
                        {
                            "rooms_shortname": "LSC",
                            "totalSeats": 700,
                            "maxSeats": 350,
                            "avgSeats": 350,
                            "minLat": 49.26236
                        },
                        {
                            "rooms_shortname": "OSBO",
                            "totalSeats": 442,
                            "maxSeats": 442,
                            "avgSeats": 442,
                            "minLat": 49.26047
                        },
                        {
                            "rooms_shortname": "HEBB",
                            "totalSeats": 375,
                            "maxSeats": 375,
                            "avgSeats": 375,
                            "minLat": 49.2661
                        },
                        {
                            "rooms_shortname": "ANGU",
                            "totalSeats": 260,
                            "maxSeats": 260,
                            "avgSeats": 260,
                            "minLat": 49.26486
                        },
                        {
                            "rooms_shortname": "PHRM",
                            "totalSeats": 236,
                            "maxSeats": 236,
                            "avgSeats": 236,
                            "minLat": 49.26229
                        },
                        {
                            "rooms_shortname": "LSK",
                            "totalSeats": 205,
                            "maxSeats": 205,
                            "avgSeats": 205,
                            "minLat": 49.26545
                        }
                    ]
                });
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Sample Query IV - performQuery: able to perform query when the dataset is added", function () {
        let query: QueryRequest = {
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
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }]
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
                            "rooms_shortname": "OSBO",
                            "maxSeats": 442
                        },
                        {
                            "rooms_shortname": "HEBB",
                            "maxSeats": 375
                        },
                        {
                            "rooms_shortname": "LSC",
                            "maxSeats": 350
                        }
                    ]
                });
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Sample Query V - performQuery: a valid ORDER key should be accepted", function () {
        let query: QueryRequest = {
            "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" }}, { "GT": { "rooms_seats": 200}}]},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "totalSeats",
                    "maxSeats",
                    "avgSeats",
                    "minLat"],
                "ORDER": "totalSeats",
                "FORM": "TABLE" },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "totalSeats": {
                        "SUM": "rooms_seats"}},
                    {"maxSeats": {
                        "MAX": "rooms_seats"}},
                    {"avgSeats": {
                        "AVG": "rooms_seats"}},
                    {"minLat": {
                        "MIN": "rooms_lat"}}
                ]}
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.body);
                expect(response.body).to.deep.equal({
                    "render": "TABLE",
                    "result": [
                        {
                            "rooms_shortname": "LSK",
                            "totalSeats": 205,
                            "maxSeats": 205,
                            "avgSeats": 205,
                            "minLat": 49.26545
                        },
                        {
                            "rooms_shortname": "PHRM",
                            "totalSeats": 236,
                            "maxSeats": 236,
                            "avgSeats": 236,
                            "minLat": 49.26229
                        },
                        {
                            "rooms_shortname": "ANGU",
                            "totalSeats": 260,
                            "maxSeats": 260,
                            "avgSeats": 260,
                            "minLat": 49.26486
                        },
                        {
                            "rooms_shortname": "HEBB",
                            "totalSeats": 375,
                            "maxSeats": 375,
                            "avgSeats": 375,
                            "minLat": 49.2661
                        },
                        {
                            "rooms_shortname": "OSBO",
                            "totalSeats": 442,
                            "maxSeats": 442,
                            "avgSeats": 442,
                            "minLat": 49.26047
                        },
                        {
                            "rooms_shortname": "LSC",
                            "totalSeats": 700,
                            "maxSeats": 350,
                            "avgSeats": 350,
                            "minLat": 49.26236
                        },
                        {
                            "rooms_shortname": "SRC",
                            "totalSeats": 897,
                            "maxSeats": 299,
                            "avgSeats": 299,
                            "minLat": 49.2683
                        }
                    ]
                });
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Sample Query VI - performQuery: MIN key should be supported", function () {
        let query: QueryRequest = {
            "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" }}, { "LT": { "rooms_seats": 20}}]},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "totalSeats",
                    "minSeats"
                ],
                "ORDER": "totalSeats",
                "FORM": "TABLE" },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "totalSeats": {
                        "SUM": "rooms_seats"}},
                    {"minSeats": {
                        "MIN": "rooms_seats"}}
                ]}
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect(response.code).to.equal(200);
                console.log(response.body);
                expect(response.body).to.deep.equal({
                    "render": "TABLE",
                    "result": [
                        {
                            "rooms_shortname": "ORCH",
                            "totalSeats": 16,
                            "minSeats": 16
                        },
                        {
                            "rooms_shortname": "BUCH",
                            "totalSeats": 18,
                            "minSeats": 18
                        },
                        {
                            "rooms_shortname": "FSC",
                            "totalSeats": 18,
                            "minSeats": 18
                        },
                        {
                            "rooms_shortname": "BIOL",
                            "totalSeats": 32,
                            "minSeats": 16
                        },
                        {
                            "rooms_shortname": "SPPH",
                            "totalSeats": 42,
                            "minSeats": 12
                        },
                        {
                            "rooms_shortname": "SOWK",
                            "totalSeats": 44,
                            "minSeats": 12
                        },
                        {
                            "rooms_shortname": "ANGU",
                            "totalSeats": 48,
                            "minSeats": 16
                        },
                        {
                            "rooms_shortname": "PHRM",
                            "totalSeats": 63,
                            "minSeats": 7
                        },
                        {
                            "rooms_shortname": "WOOD",
                            "totalSeats": 84,
                            "minSeats": 10
                        },
                        {
                            "rooms_shortname": "IBLC",
                            "totalSeats": 86,
                            "minSeats": 8
                        },
                        {
                            "rooms_shortname": "MCML",
                            "totalSeats": 92,
                            "minSeats": 6
                        }
                    ]
                });
            }).catch(function (response: InsightResponse) {
                expect.fail();
            });
    });

    it("Invalid Query I - COLUMNS terms must correspond to either GROUP terms or to terms defined in the APPLY", function () {
        let query: QueryRequest = {
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
                    "randomStuff"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid Query II - GROUP must contain at least one term", function () {
        let query: QueryRequest = {
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
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid Query III - GROUP and APPLY always appear together", function () {
        let query: QueryRequest = {
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
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid Query IV - GROUP and APPLY always appear together", function () {
        let query: QueryRequest = {
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
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid Query V(1) - MAX/MIN/AVG should only be requested of numeric keys,", function () {
        let query: QueryRequest = {
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
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_shortname"
                    }
                }]
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid Query V(2) - MAX/MIN/AVG should only be requested of numeric keys,", function () {
        let query: QueryRequest = {
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
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MIN": "rooms_shortname"
                    }
                }]
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid Query V(3) - MAX/MIN/AVG should only be requested of numeric keys,", function () {
        let query: QueryRequest = {
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
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "SUM": "rooms_shortname"
                    }
                }]
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid Query V(4) - MAX/MIN/AVG should only be requested of numeric keys,", function () {
        let query: QueryRequest = {
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
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "AVG": "rooms_shortname"
                    }
                }]
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid Query VI - No two APPLY targets should have the same name", function () {
        let query: QueryRequest = {
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
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "SUM": "rooms_seats"}},
                    {"maxSeats": {
                        "MAX": "rooms_seats"}}
                ]
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid Query VII - ORDER key should be in the COLUMN", function () {
        let query: QueryRequest =  {
            "WHERE":{
                "AND": [{
                    "GT": {
                        "courses_avg": 97
                    }
                }, {
                    "GT": {
                        "courses_avg": 97
                    }
                }]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "countSection"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["sectionMAX","courses_id"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept","courses_id"],
                "APPLY": [{
                    "countSection": {
                        "COUNT": "courses_id"
                    }
                }]
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid Query VIII - ORDER key should be in the COLUMN", function () {
        let query: QueryRequest = {
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
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats","rooms_lat"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid query VIIII - performQuery: a valid ORDER key should be accepted", function () {
        let query: QueryRequest = {
            "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" }}, { "GT": { "rooms_seats": 200}}]},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "totalSeats",
                    "maxSeats",
                    "avgSeats",
                    "minLat"],
                "ORDER": "totalSeats",
                "FORM": "TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid query IX - performQuery: a valid ORDER key should be accepted", function () {
        let query: QueryRequest = {
            "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" }}, { "GT": { "rooms_seats": 200}}]},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "totalSeats",
                    "maxSeats",
                    "avgSeats",
                    "minLat"],
                "ORDER": "totalSeats",
                "FORM": "TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid query X - performQuery: a valid ORDER key should be accepted", function () {
        let query: QueryRequest = {
            "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" }}, { "GT": { "rooms_seats": 200}}]},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "totalSeats"],
                "ORDER": "totalSeats",
                "FORM": "TABLE"
            }
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid query XI - performQuery: a valid ORDER key should be accepted", function () {
        let query: QueryRequest = {
            "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" }}, { "GT": { "rooms_seats": 200}}]},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "totalSeats",
                    "maxSeats",
                    "avgSeats"],
                "ORDER": "totalSeats",
                "FORM": "TABLE" },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [
                    {"maxSeats": {
                        "MAX": "rooms_seats"}},
                    {"avgSeats": {
                        "AVG": "rooms_seats"}}
                ]}
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid query XII - performQuery: a valid ORDER key should be accepted", function () {
        let query: QueryRequest = {
            "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" }}, { "GT": { "rooms_seats": 200}}]},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "max_Seats",
                    "avgSeats"],
                "ORDER": "avgSeats",
                "FORM": "TABLE" },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [
                    {"max_Seats": {
                        "MAX": "rooms_seats"}},
                    {"avgSeats": {
                        "AVG": "rooms_seats"}}
                ]}
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid query XIII - performQuery: an invalid ORDER key should not be accepted", function () {
        let query: QueryRequest = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "max_Seats",
                    "maxSeats",
                    "avgSeats"],
                "ORDER": "avgSeats",
                "FORM": "TABLE" },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [
                    {"maxSeats": {
                        "MAX": "rooms_seats"}},
                    {"avgSeats": {
                        "AVG": "rooms_seats"}}
                ]}
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid query XIV - Vineseed: references a wrong dataset in GROUP.", function () {
        let query: QueryRequest = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "maxSeats",
                    "avgSeats"],
                "ORDER": "avgSeats",
                "FORM": "TABLE" },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_shortname"],
                "APPLY": [
                    {"maxSeats": {
                        "MAX": "rooms_seats"}},
                    {"avgSeats": {
                        "AVG": "rooms_seats"}}
                ]}
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid query XV - Sunergy: invalid key in GROUP.", function () {
        let query: QueryRequest = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats",
                    "avgSeats"],
                "ORDER": "avgSeats",
                "FORM": "TABLE" },
            "TRANSFORMATIONS": {
                "GROUP": ["maxSeats","rooms_shortname"],
                "APPLY": [
                    {"maxSeats": {
                        "MAX": "rooms_seats"}},
                    {"avgSeats": {
                        "AVG": "rooms_seats"}}
                ]}
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid query XVI - Sunergy: invalid key in GROUP.", function () {
        let query: QueryRequest = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "avgSeats"],
                "ORDER": "avgSeats",
                "FORM": "TABLE" },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname","courses_shortname"],
                "APPLY": [
                    {"maxSeats": {
                        "MAX": "rooms_seats"}},
                    {"avgSeats": {
                        "AVG": "rooms_seats"}}
                ]}
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid query XVII - Sunergy: invalid key in GROUP.", function () {
        let query: QueryRequest = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "avgSeats"],
                "ORDER": "avgSeats",
                "FORM": "TABLE" },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_shortname"],
                "APPLY": [
                    {"maxSeats": {
                        "MAX": "rooms_seats"}},
                    {"avgSeats": {
                        "AVG": "rooms_seats"}}
                ]}
        };
        return insight.performQuery(query)
            .then(function (response: InsightResponse) {
                expect.fail();
            }).catch(function (response: InsightResponse) {
                expect(response.code).to.equal(400);
            });
    });

    it("Invalid query XVII - Sunergy: invalid key in GROUP.", function () {
        let query: QueryRequest =  {
            "WHERE":{
                "AND": [{
                    "LT": {
                        "courses_avg": 97.2
                    }
                }, {
                    "GT": {
                        "courses_avg": 96.9
                    }
                }]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "sectionMAX"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["sectionMAX","courses_id"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept","rooms_id","courses_id"],
                "APPLY": [{
                    "sectionMAX": {
                        "MAX": "courses_avg"
                    }
                }]
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid query XVIII - Sunergy: invalid key in GROUP.", function () {
        let query: QueryRequest =  {
            "WHERE":{
                "AND": [{
                    "LT": {
                        "courses_avg": 97.2
                    }
                }, {
                    "GT": {
                        "courses_avg": 96.9
                    }
                }]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg",
                    "sectionMAX"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["courses_avg"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname","courses_avg","courses_dept"],
                "APPLY": [{
                    "sectionMAX": {
                        "MAX": "courses_avg"
                    }
                }]
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid query XVIII - Sunergy: invalid key in GROUP.", function () {
        let query: QueryRequest =  {
            "WHERE":{
                "AND": [{
                    "LT": {
                        "courses_avg": 97.2
                    }
                }, {
                    "GT": {
                        "courses_avg": 96.9
                    }
                }]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "sectionMAX"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["sectionMAX","courses_id"]
                },
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept","courses_id"],
                "APPLY": [{
                    "sectionMAX": {
                        "COUNT": "randomStuff"
                    }
                }]
            }
        };
        return insight.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Invalid query XVIIII - order key should be in column", function () {
        let query: QueryRequest =  {
            "WHERE":{
                "GT":{
                    "rooms_seats":400
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_fullname",
                    "rooms_href"
                ],
                "ORDER":"rooms_shortname",
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