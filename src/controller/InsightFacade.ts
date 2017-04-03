/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest, GeoResponse} from "./IInsightFacade";

import Log from "../Util";
import {writeFileSync} from "fs";
import {readFileSync} from "fs";
import indexOf = require("core-js/library/fn/array/index-of");
import forEach = require("core-js/fn/array/for-each");
import * as parse5 from 'parse5';
import http = require("http");
import {Address} from "cluster";
import {urlEncodedBodyParser} from "restify";
let ids: string[] = [];
let processedData: Object[] = [];
let processedRoomsData : Object[] = [];
let currentID = "";
let problemIDs: string[] = [];
let StringKeys: string[] = ["courses_dept","courses_id","courses_instructor","courses_title","courses_uuid","rooms_fullname","rooms_shortname","rooms_number","rooms_name","rooms_address","rooms_type","rooms_furniture","rooms_href"];
let NumberKeys: string[] = ["courses_size","courses_avg","courses_pass","courses_fail","courses_audit","courses_year","rooms_lat","rooms_lon","rooms_seats"];
let allKeys: string[] = ["courses_size","courses_avg","courses_pass","courses_fail","courses_audit","courses_dept","courses_id","courses_instructor","courses_title","courses_uuid","courses_year","rooms_fullname","rooms_shortname","rooms_number","rooms_name","rooms_address","rooms_type","rooms_furniture","rooms_href","rooms_lat","rooms_lon","rooms_seats"];
let coursesKeys: string[] = ["courses_size","courses_avg","courses_pass","courses_fail","courses_audit","courses_dept","courses_id","courses_instructor","courses_title","courses_uuid","courses_year"];
let roomsKeys: string[] = ["rooms_fullname","rooms_shortname","rooms_number","rooms_name","rooms_address","rooms_type","rooms_furniture","rooms_href","rooms_lat","rooms_lon","rooms_seats"];
let code = ""; //This is shortname
let fullname = "";
let address = "";
let addresses: string[] =[];
let latLonArray: any[] = [];
let groupKeys: any[] = [];
let applyKeys: any[] = [];

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace("InsightFacadeImpl::init()");
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        let that = this;
        if (id == "courses") {
            return new Promise(function (fulfill, reject) {
                try {
                    let parse5 = require("parse5");
                    var JSZip = require("jszip");
                    var options = {base64: true};
                    var zip = new JSZip();
                    console.log("#1 " + processedData.length);
                    zip.loadAsync(content, options)
                        .then(function (zip: any) {
                            var promises: Promise<"string">[] = [];
                            zip.folder("courses").forEach(function (relativePath: any, file: any) {
                                let p = file.async("string");
                                promises.push(p);
                            });
                            console.log("#2 " + "ProcessedData:" + processedData.length);
                            that.deleteData(id);
                            Promise.all(promises).then(function (files) {
                                //console.log("latlonAddress: " + latlonAddresses);
                                if (typeof files === "undefined" || files.length < 1) {
                                    //console.log("in here");
                                    reject({
                                        code: 400,
                                        body: {"error": "unexpected end of JSON input"}
                                    });
                                }
                                return files;
                            }).then(function (files: any) {
                                console.log("#3 " + "ProcessedData:" + processedData.length + " files length:" + files.length);
                                //Separate into HTMLParser here
                                files.forEach(function (file: string) {
                                    let results: any;
                                    if (file != null) {
                                        try {
                                            var o = JSON.parse(file);
                                            results = o.result;
                                        }
                                        catch (err) {
                                            reject({
                                                code: 400,
                                                body: {"error": "unexpected end of JSON input"}
                                            })
                                        }
                                    }
                                    if ((!(o.hasOwnProperty("result"))) || (typeof o !== "object")) {
                                        //    console.log("in");
                                        reject({
                                            code: 400,
                                            body: {"error": "unexpected end of JSON input"}
                                        });
                                    }
                                    if (results.length > 0) {
                                        results.forEach(function (arrObject: any) {
                                            let year = 1900;
                                            if (arrObject["Section"] != 'overall')
                                                year = arrObject["Year"];
                                            let courseData = {
                                                courses_dept: arrObject["Subject"],
                                                courses_id: arrObject["Course"],
                                                courses_avg: arrObject["Avg"],
                                                courses_instructor: arrObject["Professor"],
                                                courses_title: arrObject["Title"],
                                                courses_pass: arrObject["Pass"],
                                                courses_fail: arrObject["Fail"],
                                                courses_audit: arrObject["Audit"],
                                                courses_uuid: (arrObject["id"]).toString(),
                                                courses_year: Number(year),
                                                courses_size: arrObject["Pass"] + arrObject["Fail"]
                                            };
                                            that.processData(courseData);
                                        })
                                    }
                                    //console.log("#4 Inside 204 fulfill block " + "ProcessedData:" + processedData.length);
                                });
                                console.log("#5 Inside 204 fulfill block " + "ProcessedData:" + processedData.length);
                                if (processedData.length == 0 || Object.keys(processedData).length == 0 || typeof processedData == "undefined") {
                                    reject({
                                        code: 400,
                                        body: {"error": "processedData is empty or undefined"}
                                    })
                                }
                                that.save(JSON.stringify(processedData));
                                if (!that.checkID(id)) {
                                    that.addID(id);
                                    console.log("#6 Inside 204 fulfill block " + "ProcessedData:" + processedData.length);
                                    fulfill({
                                        code: 204,
                                        body: "the operation was successful and the id was new (not added in this session or was previously cached)."
                                    })
                                }
                                else {
                                    fulfill({
                                        code: 201,
                                        body: "the operation was successful and the id already existed (was added in this session or was previously cached)."
                                    })
                                }
                            });
                            console.log("ProcessedData: Out" + processedData.length);
                        })
                        .catch(function () {
                            reject({
                                code: 400,
                                body: {"error": "unexpected end of JSON input"}
                            })
                        });
                }
                catch (err) {
                    reject({
                        code: 400,
                        body: {"error": "unexpected end of JSON input"}
                    })
                }
            })
        }
        else {
            return new Promise(function (fulfill, reject) {
                try {
                    let parse5 = require("parse5");
                    var JSZip = require("jszip");
                    var options = {base64: true};
                    var zip = new JSZip();
                    console.log("#1 " + processedRoomsData.length);
                    zip.loadAsync(content, options)
                        .then(function (zip: any) {
                            return zip.file("index.htm").async("string")
                        }).then(function (data: any) {
                        let htmlIndex = parse5.parse(data);
                        that.parseAddresses(htmlIndex.childNodes);
                        //console.log("address: " + addresses);
                        let latlonAddressesPreParse: any = [];
                        addresses.forEach(function (address) {
                            latlonAddressesPreParse.push(that.latLonSearch((address)))
                        });
                        return Promise.all(latlonAddressesPreParse);
                    }).then(function (latlonAddressesPostParse: any) {
                        //console.log(latlonAddressesPostParse);
                        latLonArray = latlonAddressesPostParse;
                        var promises: Promise<"string">[] = [];
                        zip.folder("campus/discover/buildings-and-classrooms").forEach(function (relativePath: any, file: any) {
                            let p = file.async("string");
                            promises.push(p);
                        });
                        console.log("#2 " + "ProcessedData:" + processedRoomsData.length);
                        that.deleteData(id);
                        return promises;
                    }).then(function (promises: any) {
                        Promise.all(promises).then(function (files) {
                            //console.log("latlonAddress: " + latlonAddresses);
                            if (typeof files === "undefined" || files.length < 1) {
                                //console.log("in here");
                                reject({
                                    code: 400,
                                    body: {"error": "unexpected end of JSON input"}
                                });
                            }
                            return files;
                        }).then(function (files: any) {
                            for (let i = 1; i < files.length; i++) {
                                if (files[i] != null) {
                                    try {
                                        let file = files[i];
                                        code = "";
                                        address = "";
                                        fullname = "";
                                        let htmlobject: any = parse5.parse(file, {treeAdapter: parse5.treeAdapters.default}) as parse5.AST.Default.Document[];
                                        that.depthSearch(htmlobject.childNodes);
                                        console.log(processedRoomsData.length);
                                    }
                                    catch (err) {
                                        reject({
                                            code: 400,
                                            body: {"error": "unexpected end of file input"}
                                        })
                                    }
                                }
                            }
                        })
                            .then(function (){
                                console.log("#5 Inside 204 fulfill block " + "processedRoomsData:" + processedRoomsData.length);
                                if (processedRoomsData.length == 0 || Object.keys(processedRoomsData).length == 0 || typeof processedRoomsData == "undefined") {
                                    reject({
                                        code: 400,
                                        body: {"error": "processedRoomsData is empty or undefined"}
                                    })
                                }
                                that.save(JSON.stringify(processedRoomsData));
                                if (!that.checkID(id)) {
                                    that.addID(id);
                                    console.log("#6 Inside 204 fulfill block " + "processedRoomsData:" + processedRoomsData.length);
                                    fulfill({
                                        code: 204,
                                        body: "the operation was successful and the id was new (not added in this session or was previously cached)."
                                    })
                                }
                                else {
                                    fulfill({
                                        code: 201,
                                        body: "the operation was successful and the id already existed (was added in this session or was previously cached)."
                                    })
                                }
                            });
                        console.log("processedRoomsData: Out" + processedRoomsData.length);
                    })
                        .catch(function () {
                            reject({
                                code: 400,
                                body: {"error": "unexpected end of JSON input"}
                            })
                        });
                }
                catch (err) {
                    reject({
                        code: 400,
                        body: {"error": "unexpected end of JSON input"}
                    })
                }
            })
        }
    }

    depthSearch(node: any): void {
        let that = this;
        for (let i = 0; i < node.length; i++) {
            if (typeof node[i].attrs != "undefined") {
                for (let j = 0; j < node[i].attrs.length; j++) {
                    let url;
                    let ModifiedAddress;
                    if (node[i].attrs[j].value == "canonical") {
                        code = node[i].attrs[j+1].value.replace(/\s/g,'');
                    }
                    if (node[i].attrs[j].value == "building-info") {
                        fullname = that.findInfo(node[i].childNodes,"fullname");
                        address = that.findInfo(node[i].childNodes, "address");
                    }
                    if (node[i].attrs[j].value == "odd views-row-first" || node[i].attrs[j].value == "odd"
                        || node[i].attrs[j].value == "even"|| node[i].attrs[j].value == "even views-row-last"
                        || node[i].attrs[j].value == "odd views-row-last"|| node[i].attrs[j].value == "odd views-row-first views-row-last") {
                        //that.latLonSearch(address).then(function (arr: any) {
                        let lat = 0;
                        let lon = 0;
                        let currentAddress = address;
                        latLonArray.forEach(function (jsonlatlon :any){
                            if (jsonlatlon.address == currentAddress)
                            {lat = jsonlatlon.lat;
                                lon = jsonlatlon.lon;}
                        });
                        let roomsData = {
                            rooms_fullname: fullname,
                            rooms_shortname: code,
                            rooms_number: that.findInfo(node[i].childNodes, "number"),
                            rooms_name: code + "_" + that.findInfo(node[i].childNodes, "number"),
                            rooms_address: currentAddress,
                            rooms_lat: lat,
                            rooms_lon: lon,
                            rooms_seats: Number(that.findInfo(node[i].childNodes, "seats").replace(/\s/g, '')),
                            rooms_type: that.findInfo(node[i].childNodes, "type").replace(/^[\t\n\ ]+|[\t\n\ ]+$/g, ''),
                            rooms_furniture: that.findInfo(node[i].childNodes, "furniture").replace(/^[\t\n\ ]+|[\t\n\ ]+$/g, ''),
                            rooms_href: that.findInfo(node[i].childNodes, "href")
                        };
                        if (code != "MAUD" && code != "NIT")
                            processedRoomsData.push(roomsData);
                        //console.log(roomsData);
                        //})
                    }
                }
            }
            if (typeof node[i].childNodes != "undefined") {
                that.depthSearch(node[i].childNodes);
            }
        }
    }
    parseAddresses(node: any) : void {
        let that = this;
        for (let i = 0; i < node.length; i++) {
            if (typeof node[i].attrs != "undefined") {
                for (let j = 0; j < node[i].attrs.length; j++) {
                    if (node[i].attrs[j].value == "views-field views-field-field-building-address")
                    {
                        let address = node[i].childNodes[0].value.replace(/^[\t\n\ ]+|[\t\n\ ]+$/g,'');
                        if (address != "Address")
                            addresses.push(address);
                    }
                }
            }
            if (typeof node[i].childNodes != "undefined") {
                that.parseAddresses(node[i].childNodes);
            }
        }
    }

    latLonSearch (string : string): Promise<any>{
        let that = this;
        let parsedLatLon : any;
        let path = "/api/v1/team66/" + string.replace(/ /g,"%20");
        let options = {
            host: "skaha.cs.ubc.ca",
            port: 11316,
            path: path
        };
        return new Promise (function (fulfill, reject){
            //if (string !== "1895 Lower Mall BC V6T 1Z4" && string !== "6331 Crescent Road BC V6T 1Z2")
            http.get(options, function (res: any) {
                let latLonObject : any = "";
                res.on("data", function(data : any){
                    latLonObject += data;
                });
                res.on("end",function(){
                    //console.log(latLonObject);
                    parsedLatLon = JSON.parse(latLonObject);
                    let templat = parsedLatLon.lat;
                    let templon = parsedLatLon.lon;
                    let newJSON = {address: string, lat: templat, lon: templon};
                    fulfill(newJSON);
                    fulfill(latLonObject);
                });
            }).on("error", function (error: any) {
                reject(error);
            });
            //reject({"error": "unable to retrieve lat lon information"})
        });
    }

    findInfo(node: any, find: string): string {
        if (find == "fullname") {
            //if (node[i].attrs[j].value == "views-field views-field-title") {
            return node[1].childNodes[0].childNodes[0].value;
            //}
        }
        if (find == "address") {
            //if (node[i].attrs[j].value == "views-field views-field-field-building-address") {
            return node[3].childNodes[0].childNodes[0].value;
            //}
        }
        else {
            let result = "";
            for (let i = 0; i < node.length; i++) {
                if (typeof node[i].attrs != "undefined") {
                    for (let j = 0; j < node[i].attrs.length; j++) {
                        if (find == "number") {
                            if (node[i].attrs[j].value == "views-field views-field-field-room-number") {
                                result = node[i].childNodes[1].childNodes[0].value;
                                break;
                            }
                        }
                        if (find == "seats") {
                            if (node[i].attrs[j].value == "views-field views-field-field-room-capacity") {
                                result = node[i].childNodes[0].value;
                                break;
                            }
                        }
                        if (find == "type") {
                            if (node[i].attrs[j].value == "views-field views-field-field-room-type") {
                                result = node[i].childNodes[0].value;
                                break;
                            }
                        }
                        if (find == "furniture") {
                            if (node[i].attrs[j].value == "views-field views-field-field-room-furniture") {
                                result = node[i].childNodes[0].value;
                                break;
                            }
                        }
                        if (find == "href") {
                            if (node[i].attrs[j].value == "views-field views-field-nothing") {
                                result = node[i].childNodes[1].attrs[0].value;
                                break;
                            }
                        }
                    }
                }
                if (result !="")
                    break;
            }
            return result;
        }
    }

    checkID(id: string): boolean {
        if (ids.includes(id))
            return true;
        else return false;
    }
    addID(id:string): void {
        ids.push(id);
    }
    save(data: string): void {
        //let options = {encoding: "string"}
        writeFileSync("cache.txt",data);
    }
    processData(data: Object): void {
        processedData.push(data);
    }
    deleteData(id: string): void {
        if (id == "courses")
            processedData = [];
        else if (id == "rooms")
            processedRoomsData = [];
    }
    deleteID(id: string):void {
        let index = ids.indexOf(id);
        if (index > -1) {
            ids.splice(index, 1);
        }
    }

    removeDataset(id: string): Promise<InsightResponse> {
        let that = this;
        return new Promise (function (fulfill, reject) {
            try {
                if (that.checkID(id)) {
                    that.deleteData(id);
                    that.deleteID(id);
                    fulfill({code: 204, body: "the operation was successful."})
                }

                else {
                    reject({
                        code: 404,
                        body: "the operation was unsuccessful because the delete was for a resource that was not previously added."
                    })
                }
            }
            catch(error) {
                reject({
                    code: 404,
                    body: "the operation was unsuccessful because the delete was for a resource that was not previously added."
                })
            }
        })
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {
        //return null;
        let that = this;
        //store the name of columns we want to show here
        let view :string[] = [];
        let order: string;
        let JSONresult: Object;
        return new Promise (function (fulfill, reject) {
            try {
                if (!that.hasID(query)) {
                    reject({
                        code: 424,
                        body: {"missing": problemIDs}
                    })
                }

                if (!that.isValid(query)) {
                    reject({
                        code: 400,
                        body: {"error": "Query is not valid"}
                    })
                }
                console.log(" isValid Passed ");
                console.log(" hasID Passed ");
                let testQuery = JSON.stringify(query);
                let parsedTestQuery = JSON.parse(testQuery);
                //parse OPTIONS Information
                parsedTestQuery.OPTIONS.COLUMNS.forEach(function (column:any) {
                    view.push(column);
                });
                //parse course data using WHERE
                //console.log("processedData: " + processedData.length);
                let coursesData = that.searchProcessedData(query);
                console.log(" searchprocessedData Passed  ");
                console.log("coursesData: " + coursesData.length);

                let CorrectColumnCourseData: Object[] = [];

                //Keep only the columns asked by the query
                if (parsedTestQuery.TRANSFORMATIONS !== undefined){
                    groupKeys = parsedTestQuery.TRANSFORMATIONS.GROUP;
                    applyKeys = parsedTestQuery.TRANSFORMATIONS.APPLY;
                    let appliedCourseData = that.groupHelper(coursesData);

                    appliedCourseData.forEach(function (course: any){
                        let courseColumned = JSON.parse(JSON.stringify(course,view));
                        CorrectColumnCourseData.push(courseColumned);
                    })
                }
                else coursesData.forEach(function (course: any) {
                    let courseColumned = JSON.parse(JSON.stringify(course,view));
                    CorrectColumnCourseData.push(courseColumned);
                });

                if (typeof(parsedTestQuery.OPTIONS.ORDER) == "string") {
                    let a = CorrectColumnCourseData;
                    //sort courseData based on order
                    if (parsedTestQuery.OPTIONS.ORDER !== undefined) {
                        order = parsedTestQuery.OPTIONS.ORDER;
                        CorrectColumnCourseData.sort(function (a: any, b: any) {
                            if (b[order] > a[order]) return -1;
                            if (b[order] < a[order]) return 1;
                            return 0;
                        })
                    }
                }
                else {
                    if (parsedTestQuery.OPTIONS.ORDER !== undefined) {
                        let dir = parsedTestQuery.OPTIONS.ORDER.dir;
                        let orderKey = parsedTestQuery.OPTIONS.ORDER.keys;
                        for (let i = 0; i < orderKey.length; i++) {
                            let keyIndex = orderKey.length - 1 - i;
                            CorrectColumnCourseData = that.orderCourses(dir,CorrectColumnCourseData,orderKey[keyIndex])
                        }
                    }
                }
                JSONresult = {
                    render: parsedTestQuery.OPTIONS.FORM,
                    result: CorrectColumnCourseData
                };
                //console.log(JSONresult);
                fulfill({
                    code: 200,
                    body: JSONresult
                });
                console.log("FULFILLED PROMISE");
            }
            catch (error){
                reject({
                    code: 400,
                    body: {"error": "Query is not valid"}
                })
            }
        })
    }
    orderCourses(dir: string, courseData: any, orderKey: string): any {
        if (dir == "DOWN"){
            courseData.sort(function (a: any, b: any) {
                if (b[orderKey] < a[orderKey]) return -1;
                if (b[orderKey] > a[orderKey]) return 1;
                return 0;
            })
        }
        else if (dir == "UP") {
            courseData.sort(function (a: any, b: any) {
                if (b[orderKey] < a[orderKey]) return 1;
                if (b[orderKey] > a[orderKey]) return -1;
                return 0;
            })
        }
        return courseData;
    }



    groupHelper(courseData: any) : any {
        let that = this;
        let multipleGroupCourse: any = [];
        let groups: any = [];
        courseData.forEach(function (course: any) {
            let groupAttribute: string = "";
            for (let i = 0; i < groupKeys.length; i++) {
                let key = groupKeys[i];
                let Attribute = course[key];
                groupAttribute += Attribute;
            }
            if (!groups.includes(groupAttribute)) {
                groups.push(groupAttribute);
                let GroupCourse = [];
                GroupCourse.push(course);
                multipleGroupCourse.push(GroupCourse);
            }
            else {
                let IndexOfKeys = groups.indexOf(groupAttribute);
                multipleGroupCourse[IndexOfKeys].push(course);
            }
        });
        return that.applyHelper(multipleGroupCourse);
    }

    applyHelper(multipleGroupCourse : any) : any {
        let newColumnElement : any;                         //This is the new Item of Column that needs to be returned
        let postAppliedData  : any = [];                    //This is an array of courses/rooms objects that will be returned

        let strApplyKeys = JSON.stringify(applyKeys);
        let parsedApplyKeys = JSON.parse(strApplyKeys);     //This is an array of all keys specified under APPLY

        multipleGroupCourse.forEach(function (singleCourse : any){
            parsedApplyKeys.forEach(function(applyKey : any){
                newColumnElement = Object.keys(applyKey);
                let newApplyKey = applyKey[newColumnElement];   //An object that has specified name, operator key and info requested
                let operatorKey = Object.keys(newApplyKey)[0];  //Operator key, include MAX, MIN, SUM, COUNT and AVG
                let targetAttr = newApplyKey[operatorKey];      //Target attribute of rooms/courses that is requested
                let targetAttrVal : any;

                    targetAttrVal = singleCourse[0][targetAttr];
                    for (let j = 1; j < singleCourse.length; j++){
                        if (operatorKey == "MAX")
                            if (targetAttrVal < singleCourse[j][targetAttr]){
                                targetAttrVal = singleCourse[j][targetAttr];
                            }

                        if (operatorKey == "MIN")
                             if (targetAttrVal > singleCourse[j][targetAttr]){
                                targetAttrVal = singleCourse[j][targetAttr];
                        }

                        if (operatorKey == "SUM")
                            targetAttrVal = targetAttrVal + singleCourse[j][targetAttr];
                        }

                    singleCourse[0][newColumnElement] = targetAttrVal;

                if (operatorKey == "AVG"){
                    targetAttrVal = singleCourse[0][targetAttr];
                    targetAttrVal = targetAttrVal * 10;
                    targetAttrVal = Number(targetAttrVal.toFixed(0));
                    for (let j = 1; j < singleCourse.length; j++){
                        let tempTargetAttr = singleCourse[j][targetAttr] * 10;
                        tempTargetAttr = Number(tempTargetAttr.toFixed(0));
                        targetAttrVal = targetAttrVal + tempTargetAttr;
                    }
                    targetAttrVal = Number(targetAttrVal.toFixed(0));
                    targetAttrVal = targetAttrVal/singleCourse.length;
                    targetAttrVal = targetAttrVal / 10;
                    targetAttrVal = Number(targetAttrVal.toFixed(2));
                    singleCourse[0][newColumnElement] = targetAttrVal;
                }

                if (operatorKey == "COUNT"){
                    let uniqueAttrList : any = [];
                    for (let j = 0; j < singleCourse.length; j++){
                        if (!uniqueAttrList.includes(singleCourse[j][targetAttr])){
                            uniqueAttrList.push(singleCourse[j][targetAttr]);
                        }
                    }
                    targetAttrVal = uniqueAttrList.length;
                    singleCourse[0][newColumnElement] = targetAttrVal;
                }
            });
            postAppliedData.push(singleCourse[0]);
        });
        return postAppliedData;
    }

    hasID(query: QueryRequest): boolean {
        problemIDs = [];
        let testQuery = JSON.stringify(query);
        let parsedTestQuery = JSON.parse(testQuery);
        let key1 = Object.keys(parsedTestQuery.WHERE)[0];
        let filter = parsedTestQuery.WHERE[key1];
        if (key1 == "GT" || key1 == "LT" || key1 == "EQ"|| key1 == "IS") {
            if (!this.hasIDKey(filter))
                return false;
        }
        else if (key1 == "AND" || key1 == "OR") {
            if (!this.hasIDFilter(filter)) {
                return false;
            }
        }
        else if (key1 == "NOT") {

            if (!this.hasIDNot(filter))
                return false;
        }
        return true;
    }

    hasIDKey(filter: any): boolean {
        console.log(" Inside hasIDKey ");
        let key: any = Object.keys(filter)[0];
        let id = key.substr(0,key.indexOf("_"));
        if (!ids.includes(id)) {
            problemIDs.push(id);
            return false;
        }
        return true;
    }

    hasIDFilter(filter: any): boolean {
        console.log(" Inside hasIDFilter ");
        let that = this;
        filter.forEach(function ( NextFilter: any) {
            let key: any = Object.keys(NextFilter)[0];
            if (key == "AND" || key == "OR") {
                if (!(that.hasIDFilter(NextFilter[key])))
                    return false;
            }
            else if (key == "NOT") {
                if (!that.hasIDNot(NextFilter[key]))
                    return false;
            }
            else if (key == "GT" || key == "LT" || key == "EQ" || key == "IS") {
                if (!that.hasIDKey(NextFilter[key]))
                    return false;
            }
        });
        return true;
    }

    hasIDNot(filter: any): boolean {
        console.log(" Inside hasIDNot ");
        let that = this;
        let key: any = Object.keys(filter)[0];
        if (key == "AND" || key == "OR") {
            if (!(that.hasIDFilter(filter[key])))
                return false;
        }
        else if (key == "NOT") {
            if (!that.hasIDNot(filter[key]))
                return false;
        }
        else if (key == "GT" || key == "LT" || key == "EQ" || key == "IS") {
            if (!that.hasIDKey(filter[key]))
                return false;
        }
        return true;
    }

    isValid(query: QueryRequest): boolean {
        try {
            console.log(" Inside isValid ");
            let testQuery = JSON.stringify(query);
            let parsedTestQuery = JSON.parse(testQuery);
            if (typeof(query) == "string" || testQuery.length <= 2 || typeof(query) == undefined
                || typeof query == null || !(query.hasOwnProperty("WHERE")) || !(query.hasOwnProperty("OPTIONS"))
                || parsedTestQuery.OPTIONS.FORM !== "TABLE" || parsedTestQuery.OPTIONS.COLUMNS.length == 0){
                return false;
            }

            if (parsedTestQuery.OPTIONS.ORDER !== undefined && typeof(parsedTestQuery.OPTIONS.ORDER) == 'string') {
                //check the order key is in the allKeys or Columns when TRANSFORMATION is not present
                if (parsedTestQuery.TRANSFORMATIONS == undefined) {
                    if (!allKeys.includes(parsedTestQuery.OPTIONS.ORDER)) {
                        return false;
                    }

                    if (!parsedTestQuery.OPTIONS.COLUMNS.includes(parsedTestQuery.OPTIONS.ORDER))
                        return false;
                }
                //check the order key is from group/apply and also if it's in the column.
                else {
                    if (!parsedTestQuery.OPTIONS.COLUMNS.includes(parsedTestQuery.OPTIONS.ORDER))
                        return false;
                }

            }

            if (parsedTestQuery.OPTIONS.ORDER !== undefined && typeof(parsedTestQuery.OPTIONS.ORDER) !== 'string'){
                let orderKeys = parsedTestQuery.OPTIONS.ORDER.keys;
                let columnKeys = parsedTestQuery.OPTIONS.COLUMNS;
                for (let i = 0; i < orderKeys.length; i++){
                    if (!columnKeys.includes(orderKeys[i])){
                        return false;
                    }
                }
            }

            if (parsedTestQuery.TRANSFORMATIONS !== undefined){
                if (parsedTestQuery.TRANSFORMATIONS.GROUP.length == 0 || parsedTestQuery.TRANSFORMATIONS.GROUP == undefined || parsedTestQuery.TRANSFORMATIONS.APPLY == undefined) {
                    return false;
                }


                let columnKeys = parsedTestQuery.OPTIONS.COLUMNS;
                let localGroupKeys = parsedTestQuery.TRANSFORMATIONS.GROUP;
                let localApplyKeys = parsedTestQuery.TRANSFORMATIONS.APPLY;
                let localApplyKeysList : any = [];
                let requestApplyObjectList : any = [];
                for (let i = 0; i < localApplyKeys.length; i++){
                    let singleApplyKey = localApplyKeys[i];
                    let columnKeyfromApply = (Object.keys(singleApplyKey))[0];
                    if (columnKeyfromApply.includes('_')){return false;}
                    let requestApplyObject = singleApplyKey[columnKeyfromApply];
                    requestApplyObjectList.push(requestApplyObject);
                    if (!localApplyKeysList.includes(columnKeyfromApply)) {
                        localApplyKeysList.push(columnKeyfromApply);
                    }
                    else return false;
                }

                //check if the group keys include newly-defined apply keys(they should not appear here)
                for (let i = 0; i < localApplyKeysList.length; i++){
                    if (localGroupKeys.includes(localApplyKeysList[i])){
                        return false;
                    }
                }

                for (let i = 0; i < columnKeys.length; i++){
                    if (!localGroupKeys.includes(columnKeys[i]) && !localApplyKeysList.includes(columnKeys[i])){
                        return false;
                    }
                }

                // check if the group keys come from both keys of courses and rooms;
                let coursesCounter = 0;
                let roomsCounter = 0;
                for (let i = 0; i < localGroupKeys.length; i++){
                    if (localGroupKeys.length !== 0){
                        if (!coursesKeys.includes(localGroupKeys[i]) && (!roomsKeys.includes(localGroupKeys[i]))){
                            return false;
                        }

                        if (coursesKeys.includes(localGroupKeys[i])){
                            coursesCounter++;
                        }
                        if (roomsKeys.includes(localGroupKeys[i])){
                            roomsCounter++;
                        }
                    }
                }
                if (coursesCounter * roomsCounter > 0){
                    return false;
                }

                let operatorList : any = [];
                for (let i = 0; i < requestApplyObjectList.length; i++){
                    let operator = Object.keys(requestApplyObjectList[i]);
                    operatorList.push(operator);
                }

                for (let i = 0; i < localApplyKeys.length; i++){
                    let singleApplyKey = localApplyKeys[i];
                    let columnKeyfromApply = (Object.keys(singleApplyKey))[0];
                    let requestApplyObject = singleApplyKey[columnKeyfromApply];
                    let operatorKey = operatorList[i][0];
                    let targetAttr = requestApplyObject[operatorKey];

                    if (operatorKey == "MAX" || operatorKey == "MIN" || operatorKey == "SUM" || operatorKey == "AVG") {
                        if (!NumberKeys.includes(targetAttr)) {
                            return false;
                        }
                    }

                    else if (!allKeys.includes(targetAttr)){
                        return false;
                    }
                }
            }

            if (parsedTestQuery.WHERE.ORDER !== undefined) {
                return false;
            }

            let datasetCounter = 0;
            if (testQuery.includes("courses")){
                datasetCounter++;
                currentID = "courses";
            }
            if (testQuery.includes("rooms")){
                datasetCounter++;
                currentID = "rooms";
            }
            if (datasetCounter > 1){
                currentID = "";
                return false;
            }

            if (Object.keys(parsedTestQuery.WHERE).length == 0){
                return true;
            }

            //Must edit code form here below to pass complex queries
            let key1 = Object.keys(parsedTestQuery.WHERE)[0];
            if (key1 == "AND" || key1 == "OR") {
                let filter = parsedTestQuery.WHERE[key1];
                if (this.isValidFilter(filter)) {
                    return true;
                }
            }
            else if (key1 == "NOT") {
                let filter = parsedTestQuery.WHERE[key1];
                if (this.isValidNot(filter)) {
                    return true;
                }
            }
            else if (key1 == "GT" || key1 == "LT" || key1 == "EQ"|| key1 == "IS") {
                let filter = parsedTestQuery.WHERE;
                if (this.isValidKey(filter)) {
                    return true;
                }
            }
            else return false;
        }
        catch (error){
            return false;
        }
    }

    isValidNot(filter: any): boolean {
        console.log(" Inside isValidNot ");
        let that = this;
        let key: any = Object.keys(filter)[0];
        //let a: any = filter[key];
        if (key == "GT" || key == "LT" || key == "EQ"|| key== "IS") {
            return that.isValidKey(filter);
        }
        else if (key == "NOT") {
            return that.isValidNot(filter[key]);
        }
        else if (key == "AND"|| key == "OR") {
            return that.isValidFilter(filter[key]);
        }
        else
            return false;
    }

    isValidKey(filter: any): boolean {
        console.log(" Inside isValidKey ");
        let key: any = Object.keys(filter)[0];
        let key2: any = Object.keys(filter[key])[0];
        let a: any = filter[key][key2];
        if (key == "GT" || key == "LT" || key == "EQ") {
            if (!(typeof(a) == "number")) {
                return false;
            }

            if (!(NumberKeys.includes(key2))) {
                return false;
            }
            else return true;
        }
        else if (key == "IS") {
            if (!(typeof(a) == "string")) {
                return false;
            }
            if (!(StringKeys.includes(key2)))
                return false; //false should be returned here and be rejected
            else return true;
        }
        else return false;
    }

    isValidFilter(filter: any): boolean {
        console.log(" Inside isValidFilter ");
        let that = this;
        if (filter.length < 1)
            return false;

        let booleanValue = true;

        filter.forEach(function ( NextFilter: any) {
            let key: any = Object.keys(NextFilter)[0];
            if (key == "AND" || key == "OR") {
                if (!(that.isValidFilter(NextFilter[key])))
                    booleanValue = false;
                //return false;
            }
            else if (key == "NOT") {
                if (!that.isValidNot(NextFilter[key]))
                    booleanValue = false;
                //return false;
            }
            else if (key == "GT" || key == "LT" || key == "EQ" || key == "IS") {
                if (!that.isValidKey(NextFilter)){
                    booleanValue = false;
                    //return false;
                }
            }
            else return false;
        });
        return booleanValue;
    }

    searchProcessedData(query: QueryRequest): Object[] {
        console.log(" Inside searchProcessedData ");
        let that = this;
        let courses: Object[] = [];
        let testQuery = JSON.stringify(query);
        let parsedTestQuery = JSON.parse(testQuery);
        let comparator  = Object.keys(parsedTestQuery.WHERE)[0];
        if (Object.keys(parsedTestQuery.WHERE).length == 0){
            return that.searchKey("emptyWhere");
        }
        let filter = parsedTestQuery.WHERE;
        if (comparator == "AND") {
            courses = that.searchAND(filter[comparator]);
        }
        else if (comparator == "OR") {
            courses = that.searchOR(filter[comparator]);
        }
        else if (comparator == "NOT") {
            courses = that.searchNOT(filter);
        }
        else
            courses = that.searchKey(filter);
        console.log(courses.length);
        return courses;
    }

    searchKey(filter: any): Object[] {
        console.log(" Inside searchKey ");
        let searchData : any;
        if (currentID == "courses"){searchData = processedData}
        if (currentID == "rooms"){searchData = processedRoomsData}
        if (filter == "emptyWhere"){return searchData;}
        let courses: Object[] = [];
        let comparator: any = Object.keys(filter)[0];
        let subject: any = Object.keys(filter[comparator])[0];
        let threshold: any = filter[comparator][subject];
        searchData.forEach(function(course: any) {
            if (comparator == "GT") {
                if (course[subject] > threshold)
                    courses.push(course);
            }
            else if (comparator == "LT") {
                if (course[subject] < threshold)
                    courses.push(course);
            }
            else if (comparator == "EQ") {
                if (course[subject] == (threshold))
                    courses.push(course);
            }
            else if (comparator == "IS") {
                // looking for partial match
                if (threshold.includes("*")){
                    if (new RegExp("^" + threshold.split("*").join(".*") + "$").test(course[subject])) {
                        courses.push(course);
                        //console.log(course[subject]);
                    }
                }
                // looking for exact match
                else if (course[subject] == threshold){
                    if (course[subject] == (threshold))
                        courses.push(course);
                }
            }
        });
        return courses;
    }
    searchAND(filter: any): Object[] {
        console.log(" Inside searchAND ");
        let that = this;
        let ProcessedCourses: Object = [];
        let courses: Object[] = [];
        filter.forEach(function( NextFilter: any){
            let key: any = Object.keys(NextFilter)[0];
            if (key == "AND") {
                ProcessedCourses = that.searchAND(NextFilter[key])
            }
            if (key == "OR") {
                ProcessedCourses = that.searchOR(NextFilter[key])
            }
            else if (key == "NOT") {
                ProcessedCourses = that.searchNOT(NextFilter)
            }
            else if (key == "GT" || key == "LT" || key == "EQ" || key == "IS") {
                ProcessedCourses = that.searchKey(NextFilter)
            }
            courses.push(ProcessedCourses);
        });
        return that.mergeAND(courses);
    }

    searchOR(filter: any): Object[] {
        console.log(" Inside searchOR ");
        let that = this;
        let ProcessedCourses: Object = [];
        let courses: Object[] = [];
        filter.forEach(function( NextFilter: any){
            let key: any = Object.keys(NextFilter)[0];
            if (key == "AND") {
                ProcessedCourses = that.searchAND(NextFilter[key])
            }
            if (key == "OR") {
                ProcessedCourses = that.searchOR(NextFilter[key])
            }
            else if (key == "NOT") {
                ProcessedCourses = that.searchNOT(NextFilter)
            }
            else if (key == "GT" || key == "LT" || key == "EQ" || key == "IS") {
                ProcessedCourses = that.searchKey(NextFilter)
            }
            courses.push(ProcessedCourses);
        });
        return that.mergeOR(courses);
    }
    searchNOT(filter: any): Object[] {
        let that = this;
        let ProcessedCourses: Object = [];
        let key: any = Object.keys(filter)[0];
        let NextKey: any = Object.keys(filter[key])[0];
        let NextFilter = filter[key];
        if (NextKey == "AND") {
            ProcessedCourses = that.searchAND(NextFilter[NextKey]); //[key])
        }
        if (NextKey == "OR") {
            ProcessedCourses = that.searchOR(NextFilter[NextKey])
        }
        else if (NextKey == "NOT") {
            ProcessedCourses = that.searchNOT(NextFilter)
        }
        else if (NextKey == "GT" || NextKey == "LT" || NextKey == "EQ" || NextKey == "IS") {
            ProcessedCourses = that.searchKey(NextFilter)
        }
        let courses = that.negate(ProcessedCourses);
        return courses;
    }

    mergeAND(courses: any): Object[] {
        console.log(" Inside mergeAND ");
        courses.sort();
        let mergedCourses: any = courses[0];
        let mergedCourses2: Object[]=  [];
        for(let i = 1; i < courses.length; i++) {
            let mergedCourses2 =  [];
            for (let j = 0; j < mergedCourses.length; j++) {
                if (courses[i].includes(mergedCourses[j]))
                    mergedCourses2.push(mergedCourses[j]);
            }
            mergedCourses = mergedCourses2;
        }
        return mergedCourses;
    }

    mergeOR(courses: any): Object[] {
        console.log(" Inside mergeOR ");
        courses.sort();
        courses.reverse();
        let mergedcourses = courses[0];
        for (let i = 1; i < courses.length; i++){
            courses[i].forEach(function(course: any){
                if ((mergedcourses.indexOf(course)) == -1){
                    mergedcourses.push(course);}
            })
        }
        console.log("mergedcourses length" + mergedcourses.length);
        return mergedcourses;
        /*let mergedCourses : any = [];
        for (let a = 0; a < courses.length; a++){
            courses[a].forEach(function(course: any) {
                mergedCourses.push(course);
            })
        }
        let mergedOrCourses: Object[] = [];
        for (let i = 0; i < mergedCourses.length; i++){
            if (!mergedOrCourses.includes(mergedCourses[i]))
                mergedOrCourses.push(mergedCourses[i]);
        }
        return mergedOrCourses;
        */
    }

    negate(courses: any): Object[] {
        console.log(" Inside Negate ");
        let searchData : any;
        if (currentID == "courses"){
            searchData = processedData.slice()}
        else if (currentID == "rooms") {
            searchData = processedRoomsData.slice()}
        //let results: Object[] = [];
        courses.forEach(function (course: any){
            let index = searchData.indexOf(course);
            searchData.splice(index,1);
        });
        return searchData;
    }
}