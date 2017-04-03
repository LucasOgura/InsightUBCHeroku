/**
 * Created by lucas on 2017-03-25.
 */

var newLatLon;

$(document).ready(function () {
    console.log("js file being called");
    init().then(function () {
        console.log("success");
        coursesQuery();
        roomsQuery();
        scheduler();
        QueryControl();
    }).catch(function () {
        coursesQuery();
        roomsQuery();
        scheduler();
        QueryControl();
        console.log("init::errors");
    });
});

function init() {
    return new Promise(function (fulfill, reject) {
        $("#sectionsSearch").show();
        $("#coursesSearch").hide();
        $("#tabs").tabs();

        var promiseArray = [];
        //var p0 = initCoursesTab();
        var p1 = initCourseDropDown();
        var p2 = initBuildingsDropDown();
        var p3 = initRoomTypeDropDown();
        var p4 = initRoomFurnitureDropDown();
        var p5 = roomLatLonFetch();

        //promiseArray.push(p0);
        promiseArray.push(p1);
        promiseArray.push(p2);
        promiseArray.push(p3);
        promiseArray.push(p4);
        promiseArray.push(p5);
        console.log("In init, before promise.all");
        Promise.all(promiseArray).then(function () {
            return fulfill();
        }).catch(function () {
            return reject();
        });
    })
}
function generateTable(data) {
    $("#tblResults tr").remove();
    console.log("Inside generate table");
    var keys = [];
    for (var k in data[0]) keys.push(k);
    console.log(keys);
    var tbl_head = document.createElement("thead");
    var tbl_body = document.createElement("tbody");
    var odd_even = false;
    var tbl_row = tbl_head.insertRow();
    tbl_row.className = odd_even ? "odd" : "even";
    $.each(keys, function (k,v){
        var cell = tbl_row.insertCell();
        cell.appendChild(document.createTextNode(v.toString()));
    })
    console.log("DATA", data);
    $.each(data, function() {
        var tbl_row = tbl_body.insertRow();
        tbl_row.className = odd_even ? "odd" : "even";
        $.each(this, function (k,v){
            var cell = tbl_row.insertCell();
            cell.appendChild(document.createTextNode(v.toString()));
        })
        odd_even = !odd_even;
    })
    console.log("generating table");
    document.getElementById("tblResults").appendChild(tbl_head);
    document.getElementById("tblResults").appendChild(tbl_body);
    //$("#tblResults").appendChild(tbl_body);
}

function initCourseDropDown() {
    return new Promise(function (fulfill) {
        var query = {
            "WHERE":{
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept"
                ],
                "ORDER":"courses_dept",
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept"],
                "APPLY": []
            }
        };
        console.log("In initCourseDropDown, before ajax");
        $.ajax({
            url: 'http://localhost:4321/query',
            type: 'post',
            data: JSON.stringify(query),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                tempArray = data["result"];
                code = data["code"];
            }
        }).then(function () {
            console.log(code);
            console.log("Response", tempArray);
            for (var i = 0; i < tempArray.length; i++) {
                var tmpObj = tempArray[i];
                var val = tmpObj["courses_dept"];
                if (val !== "") {
                    $("#courseDept").append($('<option>', {
                        value: val,
                        text: val
                    }));
                    $("#sectionCourseDept").append($('<option>', {
                        value: val,
                        text: val
                    }));
                    $("#scheduleDepartmentDropdown").append($('<option>', {
                        value: val,
                        text: val
                    }));
                    $("#scheduleDepartmentDropdown2").append($('<option>', {
                        value: val,
                        text: val
                    }));
                }
            }
            fulfill();
        }).catch(function () {
            console.error("ERROR - Failed to submit query");
        });
    })
}
function initBuildingsDropDown() {
    return new Promise(function (fulfill) {
        var query = {
            "WHERE":{
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_fullname"
                ],
                "ORDER":"rooms_fullname",
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_fullname"],
                "APPLY": []
            }
        };
        console.log("In initBuildingsDropDown, before ajax");
        $.ajax({
            url: 'http://localhost:4321/query',
            type: 'post',
            data: JSON.stringify(query),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                tempArray = data["result"];
            }
        }).then(function () {
            console.log("Response", tempArray);
            for (var i = 0; i < tempArray.length; i++) {
                var tmpObj = tempArray[i];
                var val = tmpObj["rooms_fullname"];
                if (val !== "") {
                    $("#scheduleBuildingsDropdown").append($('<option>', {
                        value: val,
                        text: val
                    }));
                    $("#scheduleBuildingsDropdown2").append($('<option>', {
                        value: val,
                        text: val
                    }));
                }
            }
            fulfill();
        }).catch(function () {
            console.error("ERROR - Failed to submit query");
        });
    })
}

function initRoomTypeDropDown() {
    return new Promise(function (fulfill) {
        var query = {
            "WHERE":{
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_type"
                ],
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_type"],
                "APPLY": []
            }
        };
        console.log("In initRoomTypeDropDown, before ajax");
        $.ajax({
            url: 'http://localhost:4321/query',
            type: 'post',
            data: JSON.stringify(query),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                newTempArray = data["result"];
            }
        }).then(function () {
            console.log("Response", newTempArray);
            for (var i = 0; i < newTempArray.length; i++) {
                var tmpObj = newTempArray[i];
                var val = tmpObj["rooms_type"];
                if (val !== "") {
                    $("#roomsTypeDropDown1").append($('<option>', {
                        value: val,
                        text: val
                    }));
                }
                if (val !== "") {
                    $("#roomsTypeDropDown2").append($('<option>', {
                        value: val,
                        text: val
                    }));
                }
            }
            fulfill();
        }).catch(function () {
            console.error("ERROR - Failed to submit query");
        });
    })
}

function initRoomFurnitureDropDown() {
    return new Promise(function (fulfill) {
        var query = {
            "WHERE":{
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_furniture"
                ],
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": []
            }
        };
        console.log("In initRoomTypeDropDown, before ajax");
        $.ajax({
            url: 'http://localhost:4321/query',
            type: 'post',
            data: JSON.stringify(query),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                newFurnitureArray = data["result"];
            }
        }).then(function () {
            console.log("Response", newFurnitureArray);
            for (var i = 0; i < newFurnitureArray.length; i++) {
                var tmpObj = newFurnitureArray[i];
                var val = tmpObj["rooms_furniture"];
                if (val !== "") {
                    $("#roomsFurnitureDropDown1").append($('<option>', {
                        value: val,
                        text: val
                    }));
                }
                if (val !== "") {
                    $("#roomsFurnitureDropDown2").append($('<option>', {
                        value: val,
                        text: val
                    }));
                }
            }
            fulfill();
        }).catch(function () {
            console.error("ERROR - Failed to submit query");
        });
    })
}

function roomLatLonFetch() {
    return new Promise(function (fulfill) {
        var query = {
            "WHERE":{
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_shortname",
                    "rooms_fullname",
                    "rooms_lat",
                    "rooms_lon"

                ],
                "FORM":"TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname","rooms_fullname","rooms_lat","rooms_lon"],
                "APPLY": []
            }
        };
        $.ajax({
            url: 'http://localhost:4321/query',
            type: 'post',
            data: JSON.stringify(query),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                newLatLon = data["result"];
            }
        }).then(function () {
            fulfill(newLatLon);
        }).catch(function () {
            console.error("ERROR - Failed to submit query");
        });
    })
}

function coursesQuery() {
    return new Promise(function (fulfill) {
        $("#searchSection").on("click", function () {
            $("#sectionsSearch").show();
            $("#coursesSearch").hide();
        })
        $("#searchCourses").on("click", function () {
            $("#sectionsSearch").hide();
            $("#coursesSearch").show();
        })

        //We need a Query skeleton to start adding the values in place depending if the user checked off a box or not
        $("#btnSubmit").on('click', function (e) {
            console.log("button pressed");
            e.preventDefault();
            var query;
            var passApplied = $("#pass").is(':checked');
            var avgApplied = $("#average").is(':checked');
            var failApplied = $("#fail").is(':checked');
            var sectionSizeApplied = $("#sectionSize").is(':checked');
            var departmentApplied = $("#department").is(':checked');
            var sectionDepartmentApplied = $("#sectionDepartment").is(':checked');
            var courseNumberApplied = $("#courseNumber").is(':checked');
            var sectionInstructorApplied = $("#sectionInstructor").is(':checked');
            var courseTitleApplied = $("#courseTitle").is(':checked');
            var department = $("#courseDept").val();
            var sectionDepartment = $("#sectionCourseDept").val();

            //Section size is determined by the # of pass + fail students in the largest section
            var sectionSize = $("#sectionSizeInput").val().trim();
            var instructor = $("#sectionInstructorInput").val().trim();
            var courseNumber = $("#courseNumberInput").val().trim();
            var sectionInstructor = $("#sectionInstructorInput").val().trim();
            var courseTitle = $("#courseTitleInput").val().trim();
            var sectionSizeParameter = ($("#operator").val());
            var whereArray = [];
            var columnArray = [];
            var applyArray = [];
            var orderKeyArray = [];

            if ($('input[name=courseFilter]:checked').val() == 's') {

                if (sectionSizeApplied) {
                    var jsonSection= {};
                    jsonSection[sectionSizeParameter] = {'courses_size': parseInt(sectionSize)};
                    whereArray.push(jsonSection);
                }

                if (sectionDepartmentApplied) {
                    var jsonDepartment = {};
                    jsonDepartment['IS'] = {'courses_dept': sectionDepartment};
                    whereArray.push(jsonDepartment)
                }

                if (sectionInstructorApplied) {
                    var jsonInstructor = {};
                    jsonInstructor['IS'] = {'courses_instructor': instructor};
                    whereArray.push(jsonInstructor)
                }

                query = {
                    "WHERE": {
                        "AND": whereArray
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg",
                            "courses_id",
                            "courses_instructor",
                            "courses_title",
                            "courses_uuid",
                            "courses_size"
                        ],
                        "FORM": "TABLE"
                    }
                };
                console.log(query);
                $.ajax({
                    url: 'http://localhost:4321/query',
                    type: 'post',
                    data: JSON.stringify(query),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        result = data["result"];
                    }
                }).then(function () {
                    console.log(result);
                    if (result.length == 0)
                        alert("No results")
                    generateTable(result);
                    fulfill();
                }).catch(function () {
                    console.error("ERROR - Failed to submit query");
                });
            }

            else if ($('input[name=courseFilter]:checked').val() == 'c'){

                columnArray.push('courses_dept');
                columnArray.push('courses_id');
                columnArray.push('courses_title');

                if (departmentApplied) {
                    var jsonInstructor = {};
                    jsonInstructor['IS'] = {'courses_dept': department};
                    whereArray.push(jsonInstructor)
                }

                if (courseNumberApplied){
                    var jsonInstructor = {};
                    jsonInstructor['IS'] = {'courses_id': courseNumber};
                    whereArray.push(jsonInstructor)
                }

                if (courseTitleApplied){
                    var jsonInstructor = {};
                    jsonInstructor['IS'] = {'courses_title': courseTitle};
                    whereArray.push(jsonInstructor)
                }
                if (failApplied){
                    var jsonApplykeys = {};
                    jsonApplykeys['failStudents'] = {'SUM':'courses_fail'};
                    applyArray.push(jsonApplykeys);
                    columnArray.push('failStudents');
                    orderKeyArray.push('failStudents');
                }
                if (passApplied){
                    var jsonApplykeys = {};
                    jsonApplykeys['passStudents'] = {'SUM':'courses_pass'};
                    applyArray.push(jsonApplykeys);
                    columnArray.push('passStudents');
                    orderKeyArray.push('passStudents');
                }
                if (avgApplied){
                    var jsonApplykeys = {};
                    jsonApplykeys['courseAverage'] = {'AVG':'courses_avg'};
                    applyArray.push(jsonApplykeys);
                    columnArray.push('courseAverage');
                    orderKeyArray.push('courseAverage');
                }
                // when the order is being selected
                if (avgApplied == true || passApplied == true || failApplied == true){
                    query = {
                        "WHERE": {
                            "AND": whereArray
                        },
                        "OPTIONS": {
                            "COLUMNS": columnArray,
                            "ORDER": {
                                "dir": "DOWN",
                                "keys": orderKeyArray
                            },
                            "FORM": "TABLE"
                        },
                        "TRANSFORMATIONS": {
                            "GROUP": [
                                "courses_dept",
                                "courses_id",
                                "courses_title"
                            ],
                            "APPLY": applyArray
                        }
                    }
                }
                // when the order is not being selected
                else {
                    query = {
                        "WHERE": {
                            "AND": whereArray
                        },
                        "OPTIONS": {
                            "COLUMNS": [
                                "courses_dept",
                                "courses_id",
                                "courses_title"
                            ],
                            "FORM": "TABLE"
                        },
                        "TRANSFORMATIONS": {
                            "GROUP": [
                                "courses_dept",
                                "courses_id",
                                "courses_title"
                            ],
                            "APPLY": []
                        }
                    };
                }

                console.log(query);
                $.ajax({
                    url: 'http://localhost:4321/query',
                    type: 'post',
                    data: JSON.stringify(query),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        result = data["result"];
                    }
                }).then(function () {
                    console.log(result);
                    if (result.length == 0)
                        alert("No results");
                    generateTable(result);
                    fulfill();
                }).catch(function () {
                    console.error("ERROR - Failed to submit query");
                });
            }
        })
    })
}

function roomsQuery() {
    return new Promise(function (fulfill) {
        //We need a Query skeleton to start adding the values in place depending if the user checked off a box or not
        $("#btnSubmitRooms").on('click', function (e) {
            console.log("button pressed");
            e.preventDefault();
            var query;
            var rooms = $("#roomsAllBuilding").is(':checked');
            var roomsMetersBuildingApplied = $("#roomsMetersBuilding").is(':checked');
            var roomsSizeApplied = $("#roomsSize").is(':checked');
            var roomsSizeMetersApplied = $("#roomsSizeMeters").is(':checked');
            var roomsTypeApplied = $("#roomsType").is(':checked');
            var roomsTypeMetersApplied = $("#roomsTypeMeters").is(':checked');

            // first one
            var roomsInput = $("#roomsAllBuildingInput").val().trim();

            // second
            var roomsMeterInput = $("#roomsMeterInput").val().trim();
            var roomsMeterBuildingInput = $("#roomsMeterBuildingInput").val().trim();

            // third
            var roomsSizeInput = $("#roomsSizeInput").val().trim();

            // fourth
            var roomsSizeMetersInput = $("#roomsSizeMetersInput").val().trim();
            var roomsSizeMetersInput2 = $("#roomsSizeMetersInput2").val().trim();
            var roomsSizeMeterBuildingInput = $("#roomsSizeMeterBuildingInput").val().trim();

            // fifth
            var roomTypeInput1 = $("#roomsTypeDropDown1").val();
            var roomFurnitureInput1 = $("#roomsFurnitureDropDown1").val();

            // sixth
            var roomTypeInput2 = $("#roomsTypeDropDown2").val().trim();
            var roomFurnitureInput2 = $("#roomsFurnitureDropDown2").val().trim();
            var roomsTypeMetersInput = $("#roomsTypeMetersInput").val().trim();
            var roomsTypeMeterBuildingInput = $("#roomsTypeMeterBuildingInput").val().trim();

            var whereArray = [];
            var columnArray = [];
            var groupArray = [];
            var applyArray = [];
            var orderKeyArray = [];
            //distance between 49 and 50 degrees in metres
            var oneDegreeLat = 111119.99965975954;
            //distance between 123 and 124 degrees in metres
            var oneDegreeLon = 72506.21567005804;

            // 1st option: Search all rooms with certain name
            if (rooms) {
                var jsonInstructor = {};
                jsonInstructor['IS'] = {'rooms_shortname': roomsInput};
                whereArray.push(jsonInstructor);
            }

            // 2nd option: Search all rooms within certain distance of certain building
            if (roomsMetersBuildingApplied){
                var localLat;
                var localLon;

                for (var i = 0; i < newLatLon.length; i++){
                    if(newLatLon[i].rooms_shortname == roomsMeterBuildingInput){
                        localLat = newLatLon[i].rooms_lat;
                        localLon = newLatLon[i].rooms_lon;
                    }
                }

                var newLat1 = {};
                newLat1['GT'] = {'rooms_lat': localLat - roomsMeterInput/oneDegreeLat};
                console.log("newLat1: " + JSON.stringify(newLat1));
                whereArray.push(newLat1);

                var newLat2 = {};
                newLat2['LT'] = {'rooms_lat': localLat + roomsMeterInput/oneDegreeLat};
                whereArray.push(newLat2);

                var newLon1 = {};
                newLon1['GT'] = {'rooms_lon': localLon - roomsMeterInput/oneDegreeLon};
                whereArray.push(newLon1);

                var newLon2 = {};
                newLon2['LT'] = {'rooms_lon': localLon + roomsMeterInput/oneDegreeLon};
                whereArray.push(newLon2);
            }

            // 3rd option: Search all rooms bigger than size x
            if (roomsSizeApplied){
                var jsonInstructor1 = {};
                jsonInstructor1['GT'] = {'rooms_seats': parseInt(roomsSizeInput)};
                whereArray.push(jsonInstructor1);
            }

            // 4th option: Search all rooms bigger than size x and within y meters from building
            if (roomsSizeMetersApplied){
                var localLat_4;
                var localLon_4;

                for (var i = 0; i < newLatLon.length; i++){
                    if(newLatLon[i].rooms_shortname == roomsSizeMeterBuildingInput){
                        localLat_4 = newLatLon[i].rooms_lat;
                        localLon_4 = newLatLon[i].rooms_lon;
                    }
                }

                var newSeats_4 = {};
                newSeats_4['GT'] = {'rooms_seats': parseInt(roomsSizeMetersInput)};
                whereArray.push(newSeats_4);

                var newLat1_4 = {};
                newLat1_4['GT'] = {'rooms_lat': localLat_4 - roomsSizeMetersInput2/oneDegreeLat};
                whereArray.push(newLat1_4);

                var newLat2_4 = {};
                newLat2_4['LT'] = {'rooms_lat': localLat_4 + roomsSizeMetersInput2/oneDegreeLat};
                whereArray.push(newLat2_4);

                var newLon1_4 = {};
                newLon1_4['GT'] = {'rooms_lon': localLon_4 - roomsSizeMetersInput2/oneDegreeLon};
                whereArray.push(newLon1_4);

                var newLon2_4 = {};
                newLon2_4['LT'] = {'rooms_lon': localLon_4 + roomsSizeMetersInput2/oneDegreeLon};
                whereArray.push(newLon2_4);
            }

            query = {
                "WHERE": {
                    "AND": whereArray
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_number",
                        "rooms_address",
                        "rooms_seats",
                        "rooms_fullname"
                    ],
                    "FORM": "TABLE"
                }
            };

            // 5th option: Search all roomtypes
            if (roomsTypeApplied){
                var newRoomType1 = {};
                newRoomType1['IS'] = {'rooms_type': roomTypeInput1};
                whereArray.push(newRoomType1);

                var newFurnitureType1 = {};
                newFurnitureType1['IS'] = {'rooms_furniture': roomFurnitureInput1};
                whereArray.push(newFurnitureType1);

                query = {
                    "WHERE": {
                        "OR": whereArray
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_shortname",
                            "rooms_number",
                            "rooms_address",
                            "rooms_seats",
                            "rooms_type",
                            "rooms_furniture"
                        ],
                        "FORM": "TABLE"
                    }
                };
            }

            // 6th option
            if (roomsTypeMetersApplied){

                var newRoomType2 = {};
                var secondWhereArray = [];
                newRoomType2['IS'] = {'rooms_type': roomTypeInput2};
                whereArray.push(newRoomType2);

                var newFurnitureType2 = {};
                newFurnitureType2['IS'] = {'rooms_furniture': roomFurnitureInput2};
                whereArray.push(newFurnitureType2);

                var localLat_6;
                var localLon_6;

                for (var i = 0; i < newLatLon.length; i++){
                    if(newLatLon[i].rooms_shortname == roomsTypeMeterBuildingInput){
                        localLat_6 = newLatLon[i].rooms_lat;
                        localLon_6 = newLatLon[i].rooms_lon;
                    }
                }

                var newLat1_6 = {};
                newLat1_6['GT'] = {'rooms_lat': localLat_6 - roomsTypeMetersInput/oneDegreeLat};
                secondWhereArray.push(newLat1_6);

                var newLat2_6 = {};
                newLat2_6['LT'] = {'rooms_lat': localLat_6 + roomsTypeMetersInput/oneDegreeLat};
                secondWhereArray.push(newLat2_6);

                var newLon1_6 = {};
                newLon1_6['GT'] = {'rooms_lon': localLon_6 - roomsTypeMetersInput/oneDegreeLon};
                secondWhereArray.push(newLon1_6);

                var newLon2_6 = {};
                newLon2_6['LT'] = {'rooms_lon': localLon_6 + roomsTypeMetersInput/oneDegreeLon};
                secondWhereArray.push(newLon2_6);

                query = {
                    "WHERE": {
                        "AND": [
                            {
                                "OR": whereArray
                            },
                            {
                                "AND": secondWhereArray
                            }
                        ]
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_shortname",
                            "rooms_number",
                            "rooms_address",
                            "rooms_seats",
                            "rooms_type",
                            "rooms_furniture"
                        ],
                        "FORM": "TABLE"
                    }
                };
            }
            console.log(query);
            $.ajax({
                url: 'http://localhost:4321/query',
                type: 'post',
                data: JSON.stringify(query),
                dataType: 'json',
                contentType: 'application/json',
                statusCode:{
                    400: function() {
                        alert( "Please enter proper values!" );
                    }
                },
                success: function (data) {
                    result = data["result"];
                }
            }).then(function () {
                console.log(result);
                if (result.length == 0)
                    alert("No results");
                generateTable(result);
                fulfill();
            }).catch(function () {
                console.error("ERROR - Failed to submit query");
            });
        })
    })
}
function generateScheduleCourseTable(data){
    console.log("Inside generate table");
    //var tbl_head = document.createElement("thead");
    var tbl_body = document.createElement("tbody");
    var odd_even = false;
    console.log("DATA", data);
    $.each(data, function() {
        var tbl_row = tbl_body.insertRow();
        tbl_row.className = odd_even ? "odd" : "even";
        $.each(this, function (k,v){
            var cell = tbl_row.insertCell();
            cell.appendChild(document.createTextNode(v.toString()));
        });
        odd_even = !odd_even;
    });
    console.log("generating table");
    document.getElementById("addCoursesResults").appendChild(tbl_body);
}
function generateScheduleRoomsTable(data){
    console.log("Inside generate table");
    //var tbl_head = document.createElement("thead");
    var tbl_body = document.createElement("tbody");
    var odd_even = false;
    console.log("DATA", data);
    $.each(data, function() {
        var tbl_row = tbl_body.insertRow();
        tbl_row.className = odd_even ? "odd" : "even";
        $.each(this, function (k,v){
            var cell = tbl_row.insertCell();
            cell.appendChild(document.createTextNode(v.toString()));
        });
        odd_even = !odd_even;
    });
    console.log("generating table");
    document.getElementById("addRoomsResults").appendChild(tbl_body);
}

function scheduler(){
    var coursesArray = [];
    var coursesArrayNoDup = [];
    var roomsArrayNoDup = [];
    var roomsArray = [];
    var coursesIDArrayNoDup = [];
    var roomsDistanceArrayNoDup = [];
    var Nodup = [];
    //distance between 49 and 50 degrees in metres
    var oneDegreeLat = 111119.99965975954;
    //distance between 123 and 124 degrees in metres
    var oneDegreeLon = 72506.21567005804;


    $("#addCourses").on('click', function (e) {
        console.log("button pressed");
        e.preventDefault();
        if ($('input[name=courseAddType]:checked').val() == 'courseDeptOnly') {
            var selectedDepartment = $("#scheduleDepartmentDropdown").val().trim();
            var queryShow = {
                "WHERE": {
                    "AND": [


                        {
                            "IS": {
                                "courses_dept": selectedDepartment
                            }

                        },
                        {
                            "EQ": {
                                "courses_year": 2014
                            }
                        }
                    ]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "courses_dept",
                        "courses_id"
                        //,"countSection"
                    ],
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["courses_dept", "courses_id"],
                    "APPLY": [
                        //{"countSection": {"COUNT": "courses_uuid"}}
                    ]
                }
            }
            console.log(queryShow);
            $.ajax({
                url: 'http://localhost:4321/query',
                type: 'post',
                data: JSON.stringify(queryShow),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    coursesShow = data["result"];
                }
            }).then(function () {
                if (coursesShow.length == 0)
                    alert("No courses to add");
                if (!coursesArrayNoDup.includes(selectedDepartment)) {
                    generateScheduleCourseTable(coursesShow);
                    coursesArrayNoDup.push(selectedDepartment);
                }
                else {
                    alert("Course already added");
                }
            }).catch(function () {
                console.error("ERROR - Failed to submit query");
            });
        }
        else if ($('input[name=courseAddType]:checked').val() == 'courseDeptAndID') {
            var selectedDepartment = $("#scheduleDepartmentDropdown2").val().trim();
            var selectedCourseID = $("#courseNumberInputScheduler").val().trim();
            var queryShow = {
                "WHERE": {
                    "AND": [


                        {
                            "AND": [


                                {
                                    "IS": {
                                        "courses_dept": selectedDepartment
                                    }

                                },
                                {
                                    "IS": {
                                        "courses_id": selectedCourseID
                                    }
                                }
                            ]

                        },
                        {
                            "EQ": {
                                "courses_year": 2014
                            }
                        }
                    ]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "courses_dept",
                        "courses_id"
                        //,"countSection"
                    ],
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["courses_dept", "courses_id"],
                    "APPLY": [
                        //{"countSection": {"COUNT": "courses_uuid"}}
                    ]
                }
            }
            console.log(queryShow);
            $.ajax({
                url: 'http://localhost:4321/query',
                type: 'post',
                data: JSON.stringify(queryShow),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    coursesShow = data["result"];
                }
            }).then(function () {
                if (coursesShow.length == 0)
                    alert("No courses to add");
                var selectedDepartmentID = selectedDepartment + selectedCourseID;
                var courseIDObject = {
                    coursedept : selectedDepartment,
                    courseID : selectedCourseID
                }
                if (!coursesArrayNoDup.includes(selectedDepartment) && !Nodup.includes(selectedDepartmentID)) {
                    generateScheduleCourseTable(coursesShow);
                    coursesIDArrayNoDup.push(courseIDObject);
                    Nodup.push(selectedDepartmentID);
                }
                else {
                    alert("Course already added");
                }
            }).catch(function () {
                console.error("ERROR - Failed to submit query");
            });

        }
    })

    $("#addRooms").on('click', function (e) {
        console.log("button pressed");
        e.preventDefault();
        if ($('input[name=roomsAddType]:checked').val() == 'roomsBuildingOnly') {
            var selectedBuilding = $("#scheduleBuildingsDropdown").val().trim();
            var queryShow = {
                "WHERE": {
                    "AND": [
                        {
                            "IS": {
                                "rooms_fullname": selectedBuilding
                            }

                        }
                    ]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_fullname",
                        "rooms_number"

                    ],
                    "FORM": "TABLE"
                }
            };
            console.log(queryShow);
            $.ajax({
                url: 'http://localhost:4321/query',
                type: 'post',
                data: JSON.stringify(queryShow),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    roomsShow = data["result"];
                }
            }).then(function () {
                if (!roomsArrayNoDup.includes(selectedBuilding)) {
                    generateScheduleRoomsTable(roomsShow);
                    roomsArrayNoDup.push(selectedBuilding);
                }
                console.log(roomsArrayNoDup);
            }).catch(function () {
                console.error("ERROR - Failed to submit query");
            });
        }
        else if ($('input[name=roomsAddType]:checked').val() == 'roomsBuildingDistance') {
            var selectedBuilding = $("#scheduleBuildingsDropdown2").val().trim();
            // 2nd option: Search all rooms within certain distance of certain building
            var localLat;
            var localLon;
            var whereArray = [];
            var jsonRoomName = {};
            var roomsMeterInput = $("#roomsDistanceInput").val().trim();
            for (var i = 0; i < newLatLon.length; i++){
                if(newLatLon[i].rooms_fullname == selectedBuilding){
                    localLat = newLatLon[i].rooms_lat;
                    localLon = newLatLon[i].rooms_lon;
                }
            }
            var newLat1 = {};
            newLat1['GT'] = {'rooms_lat': localLat - roomsMeterInput/oneDegreeLat};
            console.log("newLat1: " + JSON.stringify(newLat1));
            whereArray.push(newLat1);

            var newLat2 = {};
            newLat2['LT'] = {'rooms_lat': localLat + roomsMeterInput/oneDegreeLat};
            whereArray.push(newLat2);

            var newLon1 = {};
            newLon1['GT'] = {'rooms_lon': localLon - roomsMeterInput/oneDegreeLon};
            whereArray.push(newLon1);

            var newLon2 = {};
            newLon2['LT'] = {'rooms_lon': localLon + roomsMeterInput/oneDegreeLon};
            whereArray.push(newLon2);

            var queryShow = {
                "WHERE": {
                    "AND": whereArray
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_fullname",
                        "rooms_number"

                    ],
                    "FORM": "TABLE"
                }
            };
            console.log(queryShow);
            $.ajax({
                url: 'http://localhost:4321/query',
                type: 'post',
                data: JSON.stringify(queryShow),
                dataType: 'json',
                contentType: 'application/json',
                statusCode:{
                    400: function() {
                        alert( "Please enter proper values!" );
                    }
                },
                success: function (data) {
                    roomsShow = data["result"];
                }
            }).then(function () {
                roomsDistanceArrayNoDup.push(whereArray);
                generateScheduleRoomsTable(roomsShow);
                console.log(roomsArrayNoDup);
            }).catch(function () {
                console.error("ERROR - Failed to submit query");
            });
        }
    });


    $("#btnSchedule").on('click', function (e) {
        console.log("button pressed");
        e.preventDefault();
        //For Courses query
        var departmentsArray = [];
        coursesArrayNoDup.forEach(function (department){
            var jsonDepartment = {};
            jsonDepartment['IS'] = {'courses_dept': department};
            departmentsArray.push(jsonDepartment);
        });
        coursesIDArrayNoDup.forEach(function (courseObject){
            var jsonDepartment = {};
            jsonDepartment['IS'] = {'courses_dept': courseObject.coursedept};
            var jsonID = {};
            jsonID['IS'] = {'courses_id': courseObject.courseID};
            var tempArray = [];
            tempArray.push(jsonDepartment);
            tempArray.push(jsonID);
            var jsonCourse = {};
            jsonCourse['AND'] = tempArray;
            departmentsArray.push(jsonCourse);
        })
        /*
         var jsonYear = {
         "EQ": {
         "courses_year": 2014
         }
         };
         whereArray.push(jsonYear);
         */
        var query = {
            "WHERE": {
                "AND": [ {
                    "EQ": {
                        "courses_year": 2014
                    }
                },
                    {
                        "OR": departmentsArray
                    }

                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "countSection",
                    "maxSize"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSize"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
                    "courses_dept",
                    "courses_id"
                ],
                "APPLY": [
                    {
                        "countSection": {
                            "COUNT": "courses_uuid"
                        }
                    },
                    {
                        "maxSize": {
                            "MAX": "courses_size"
                        }
                    }
                ]
            }
        };
        console.log(query);
        $.ajax({
            url: 'http://localhost:4321/query',
            type: 'post',
            data: JSON.stringify(query),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                courses = data["result"];
            }
        }).then(function () {
            coursesArray = courses;

            for (var j = 0; j < coursesArray.length; j++){
                var tempSec = coursesArray[j].countSection;
                var tempVal = tempSec/3;
                tempVal = Math.ceil(tempVal);
                coursesArray[j].sectionsToBeSch = tempVal;
                console.log("temp value: " + tempVal);
                console.log("temp Sec: " + tempSec);
            }

            console.log(coursesArray);
        }).catch(function () {
            console.error("ERROR - Failed to submit query");
        });
        //For Rooms query
        var whereArray = [];
        roomsArrayNoDup.forEach(function (building){
            var jsonBuildings = {};
            jsonBuildings['IS'] = {'rooms_fullname': building};
            whereArray.push(jsonBuildings);
        });
        roomsDistanceArrayNoDup.forEach(function (array) {
            var jsonRoom = {};
            jsonRoom['AND'] = array;
            whereArray.push(jsonRoom);
        })

        var roomQuery = {
            "WHERE": {
                "OR":whereArray
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_fullname",
                    "rooms_number",
                    "rooms_seats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["rooms_seats"]
                },
                "FORM": "TABLE"
            }
        };
        console.log(roomQuery);
        $.ajax({
            url: 'http://localhost:4321/query',
            type: 'post',
            data: JSON.stringify(roomQuery),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                rooms = data["result"];
            }
        }).then(function () {
            roomsArray = rooms;
            console.log("lecture rooms " + JSON.stringify(roomsArray));
        }).catch(function () {
            console.error("ERROR - Failed to submit query");
        });

        //Scheduling
        var scheduleOfOneRoom = [];
        var MultipleRoomSchedule = [];
        var MWFStartingTime = 8;
        var TTStartingTime = 8;
        /*var title = {
            courses_dept: "department",
            courses_id: "id",
            sectionSize: "size",
            sectionNumber: "section No",
            sectionDate: "Dates",
            timeBegin: "timeBegin",
            timeEnd: "timeEnd",
            room: "building",
            roomNo: "roomNo",
            roomSize: "roomSize"
        };
        scheduleOfOneRoom.push(title);*/

        var currentLength = 0;
        var unSchedulableCourses = 0;
        var unSchedulableSections = 0;
        var totalSectionsToBeScheduled = 0;
        var threshold = 0;

        for (var j = 0; j < coursesArray.length; j++){
            for (var i = 0; i < coursesArray[j].sectionsToBeSch; i++){
                totalSectionsToBeScheduled++;

                if (coursesArray[j].maxSize > roomsArray[currentLength].rooms_seats){
                    break;
                }

                if (MultipleRoomSchedule.length > roomsArray.length){
                    break;
                }

                if (threshold < 9){
                    var tempStart = MWFStartingTime;
                    var tempEnd = tempStart + 1;
                    var tempSectionMWF = {
                        courses_dept: coursesArray[j].courses_dept,
                        courses_id: coursesArray[j].courses_id,
                        sectionSize: coursesArray[j].maxSize,
                        sectionNumber: "00" + (i + 1),
                        sectionDate: "MWF",
                        timeBegin: tempStart,
                        timeEnd: tempEnd,
                        room: roomsArray[currentLength].rooms_fullname,
                        No: roomsArray[currentLength].rooms_number,
                        roomSize: roomsArray[currentLength].rooms_seats
                    };
                    scheduleOfOneRoom.push(tempSectionMWF);
                    threshold++;
                    MWFStartingTime++;
                }
                else if (threshold >= 9)  {
                    var tempStartTT = TTStartingTime;
                    var tempEndTT = tempStartTT + 1.5;
                    var tempSectionTT = {
                        courses_dept: coursesArray[j].courses_dept,
                        courses_id: coursesArray[j].courses_id,
                        sectionSize: coursesArray[j].maxSize,
                        sectionNumber: "00" + (i + 1),
                        sectionDate: "TueThu",
                        timeBegin: tempStartTT,
                        timeEnd: tempEndTT,
                        room: roomsArray[currentLength].rooms_fullname,
                        No: roomsArray[currentLength].rooms_number,
                        roomSize: roomsArray[currentLength].rooms_seats
                    };
                    scheduleOfOneRoom.push(tempSectionTT);
                    threshold++;
                    TTStartingTime += 1.5;
                }
                if (threshold == 15){
                    MultipleRoomSchedule.push(scheduleOfOneRoom);
                    currentLength++;
                    scheduleOfOneRoom = [];
                    count = 0;
                    MWFStartingTime = 8;
                    TTStartingTime = 8;
                    threshold=0;
                }
                /*
                 else if (threshold + coursesArray[j].sectionsToBeSch > 16){
                 MultipleRoomSchedule.push(scheduleOfOneRoom);
                 currentLength++;
                 scheduleOfOneRoom = [];
                 count = 0;
                 MWFStartingTime = 7;
                 scheduleOfOneRoom.push(title);
                 }
                 */
            }
        }
        if (threshold !=0) {
            MultipleRoomSchedule.push(scheduleOfOneRoom);
        }

        console.log(MultipleRoomSchedule);
        var finalSchedules = [].concat.apply([], MultipleRoomSchedule);
        console.log(finalSchedules);
        var title3 = {
            totalSections: "totalSections",
            Success: "Success",
            Fail: "Fail",
            Rate: "Quality"
        };
        var content3 = {
            courses_dept: totalSectionsToBeScheduled,
            courses_id: finalSchedules.length,
            Fail: totalSectionsToBeScheduled - finalSchedules.length,
            Rate: finalSchedules.length/totalSectionsToBeScheduled
        };
        finalSchedules.push(title3);
        finalSchedules.push(content3);
        generateTable(finalSchedules);
    });

    $("#Reset").on('click', function (e) {
        console.log("button pressed");
        e.preventDefault();
        $("#tblResults tr").remove();
        $("#addCoursesResults tr").remove();
        $("#addRoomsResults tr").remove();
        coursesArray = [];
        coursesArrayNoDup = [];
        roomsArrayNoDup = [];
        roomsArray = [];
        coursesIDArrayNoDup = [];
        roomsDistanceArrayNoDup = [];
        Nodup = [];
    })
}

function QueryControl() {
    $("#queryControl").on('click', function () {
        var inputQuery = $("#queryInput").val();
        console.log(inputQuery);
        $.ajax({
            url: 'http://localhost:4321/query',
            type: 'post',
            data: inputQuery,
            dataType: 'json',
            contentType: 'application/json',
            statusCode:{
                400: function() {
                    alert( "Please enter a proper query!" );
                }
            },
            success: function (data) {
                result = data["result"];
            }
        }).then(function () {
            console.log(result);
            generateTable(result);
            fulfill();
        }).catch(function () {
            console.error("ERROR - Failed to submit query");
        });
    });
}