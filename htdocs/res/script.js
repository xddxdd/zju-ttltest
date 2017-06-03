
var ws;
var batchId = 0;    /* Used for chip testing */
var batchStep = -1; /* Counter for chip testing */

/* void init()
 * Codes to be run on page load. Includes WebSocket receive code.
 */
function init() {
    function listGates() {
        var newHtml = "";
        Object.keys(gateData).forEach(function(key, index) {
            newHtml += "<li><a href='#' onclick=\"$('#gate-select').html('" + this[key] + " <span class=caret></span>');$('#resultTable tbody').html(drawResultTable($('#rawdata').text(), '" + key + "', '" + this[key] + "'))\">" + this[key] + "</a></li>"
        }, gateData);
        return newHtml;
        
    }
    function listChips() {
        var newHtml = "";
        for(var i = 0; i < chip.length; i++) {
            newHtml += "<li><a href='#' onclick=\"switchChip(" + i + ")\">" + chip[i]['name'] + "</a></li>"
        }
        return newHtml;
    }
    ws = initWs();
    $('#known-gates').html(listGates());
    $('#known-chips').html(listChips());
}

/* void initWs()
 * Returns a WebSocket object for Arduino communication.
 */
function initWs() {
    ws = new WebSocket("ws://127.0.0.1:8999/ws");
    ws.onopen = function() {
        sendWs("S");
    };
    ws.onmessage = function(message) {
        if(message.data == 'ERR') {
            sendNotification("danger", "Arduino Communication Error! Please refresh page.");
        } else if(message.data.indexOf('/') >= 0) {
            $("#portTable").html(drawPortTable(message.data.split("/")));
            if(batchStep < 0) sendNotification("success", "Updated Arduino Information!");
        } else if(batchStep >= 0) {
            checkChipNext(batchId, message.data);
        } else {
            $('#resultTable tbody').html(drawResultTable(message.data, message.data, name));
            $('#kMap').html(drawKMap(message.data));
            $("#rawdata").text(message.data);
            $("#sop").text(findSOP(message.data));
            $("#gate").text(findGate(message.data));
            sendNotification('success', 'Test success!');
        }
    };
    ws.onclose = function() {
        sendNotification("danger", "Disconnected from Arduino! Reconnecting...")
        setTimeout("ws = initWs()", 3000)
    };
    return ws;
}

/* void sendWs(string message)
 * Send a WebSocket message to Arduino backend.
 */
function sendWs(message) {
    try {
        ws.send(message);
    } catch (InvalidStateError) {
        sendNotification('danger', 'Could not send command to Arduino!');
    }
};

/* void sendNotification(string type, string message)
 * Send a notification (bootstrap based) on top of page.
 */
function sendNotification(type, message) {
    $('#notification').html("<li class='alert alert-" + type
        + "'>" + message + "</li>");
}

/* void runTest(int size)
 * Requests Arduino to test [size] pins and send back output.
 * size = [1,2,3,4].
 */
function runTest(size) {
    sendNotification('info', 'Waiting for Arduino to finish the test...');
    sendWs(size);
}

/* string drawResultTable(string data, string expected, string name)
 * Returns HTML code for a value table of given data,
 * and differences between data and expected value.
 */
function drawResultTable(data, expected, name) {
    /* TODO: Fail "available after test" */
    if(data == "Available after you run a test.") return;
    var size = Math.floor(Math.log2(data.length));
    var newHtml = "<td>Group</td>";
    var expect = expected;
    while(expect.length < data.length) expect += expect;
    expect = expect.substring(0, data.length);
    for (var i = 0; i < size; i++) {
        newHtml += "<td>" + (size - i) + "</td>";
    }
    newHtml += "<td>OUT</td>";
    if(name) newHtml += "<td>EXPECT</td>";
    $("#resultTable thead tr").html(newHtml);
    var colspan = size + 2;
    newHtml = "";
    var flag = 1;
    for (var i = 0; i < data.length; i++) {
        if(expect[i] != data[i]) {
            newHtml += "<tr class='danger'>";
            flag = 0;
        } else {
            newHtml += "<tr>";
        }
        newHtml += "<td>#" + (i + 1) + "</td>";
        binary = i.toString(2);
        while (binary.length < size) binary = "0" + binary;
        for (var j = 0; j < size; j++) {
            newHtml += "<td>" + binary[j] + "</td>";
        }
        newHtml += "<td>" + data[i] + "</td>";
        if(name) newHtml += "<td>" + expect[i] + "</td>";
        newHtml += "</tr>";
    }
    if(flag) {
        $("#gate").html(name + " <span class='label label-success'>OK</span>");
    } else {
        $("#gate").html(name + " <span class='label label-danger'>Bad</span>");
    }
    return newHtml;
}

/* string drawKMap(string data)
 * Returns HTML code for a K-Map of given data.
 */
function drawKMap(data) {
    var tableSize = Math.floor(Math.log2(data.length));
    if (tableSize == 1) {
        newHtml = "<tr><td rowspan=3>K-Map</td><td colspan=2>Pin 1</td></tr>"
            + "<tr><td>0</td><td>1</td></tr>"
            + "<tr><td>" + data[0] + "</td><td>" + data[1] + "</td></tr>";
    } else if (tableSize == 2) {
        newHtml = "<tr><td colspan=2 rowspan=2>K-Map</td><td colspan=2>Pin 1</td></tr>"
            + "<tr><td>0</td><td>1</td></tr>"
            + "<tr><td rowspan=2>Pin 2</td><td>0</td><td>" + data[0] + "</td><td>" + data[1] + "</td></tr>"
            + "<tr><td>1</td><td>" + data[2] + "</td><td>" + data[3] + "</td></tr>";
    } else if (tableSize == 3) {
        newHtml = "<tr><td colspan=2 rowspan=2>K-Map</td><td colspan=4>Pin 2 & Pin 1</td></tr>"
        + "<tr><td>00</td><td>01</td><td>11</td><td>10</td></tr>"
        + "<tr><td rowspan=2>Pin 3</td><td>0</td>"
            + "<td>" + data[0] + "</td>"
            + "<td>" + data[1] + "</td>"
            + "<td>" + data[3] + "</td>"
            + "<td>" + data[2] + "</td></tr>"
        + "<tr><td>1</td>"
            + "<td>" + data[4] + "</td>"
            + "<td>" + data[5] + "</td>"
            + "<td>" + data[7] + "</td>"
            + "<td>" + data[6] + "</td></tr>";
    } else if (tableSize == 4) {
        newHtml = "<tr><td colspan=2 rowspan=2>K-Map</td><td colspan=4>Pin 2 & Pin 1</td></tr>"
            + "<tr><td>00</td><td>01</td><td>11</td><td>10</td></tr>"
            + "<tr><td rowspan=4>Pin 4<br />Pin 3</td><td>00</td>"
                + "<td>" + data[0] + "</td>"
                + "<td>" + data[1] + "</td>"
                + "<td>" + data[3] + "</td>"
                + "<td>" + data[2] + "</td></tr>"
            + "<tr><td>10</td>"
                + "<td>" + data[4] + "</td>"
                + "<td>" + data[5] + "</td>"
                + "<td>" + data[7] + "</td>"
                + "<td>" + data[6] + "</td></tr>"
            + "<tr><td>11</td>"
                + "<td>" + data[12] + "</td>"
                + "<td>" + data[13] + "</td>"
                + "<td>" + data[15] + "</td>"
                + "<td>" + data[14] + "</td></tr>"
            + "<tr><td>01</td>"
                + "<td>" + data[8] + "</td>"
                + "<td>" + data[9] + "</td>"
                + "<td>" + data[11] + "</td>"
                + "<td>" + data[10] + "</td></tr>";
    }
    return newHtml;
}

/* void changePort(int port, char newPin)
 * Requests Arduino to change ports it run tests on.
 * Uses ASCII characters for recording pins >= 10, see code.
 */
function changePort(port, newPin) {
    if (newPin < 2) newPin = "/"; /* Disallow Pin 0 & 1 for COM */
    if (newPin == 10) newPin = ":";
    if (newPin == 11) newPin = ";";
    if (newPin == 12) newPin = "<";
    if (newPin == 13) newPin = "=";
    if (newPin == 14) newPin = ">";
    if (newPin == 15) newPin = "?";
    if (newPin == 16) newPin = "@";
    if (newPin == 17) newPin = "A";
    if (newPin == 18) newPin = "B";
    if (newPin == 19) newPin = "C";
    sendNotification('info', 'Changing Arduino Port <-> Chip Pin relationship...');
    sendWs("C" + port + newPin + "S");
}

/* string drawPortTable(string data)
 * Returns HTML code for a Port <-> Pin relationship table of Arduino.
 */
function drawPortTable(data) {
    function generatePortMenu(id, data) {
        function generatePortMenuSubLoop(id, data, i) {
            newHtml = '';
            newHtml += "<li><a href='#' onclick='changePort(" + (id + 1) + "," + i + ")'>" + i;
            if (i >= 14) newHtml += " (A" + (i-14) + ")";
            if (data[id] == i) {
                newHtml += " (current)</a></li>";
            } else if (data.indexOf(i.toString()) >= 0) {
                newHtml += " (used)</a></li>";
            } else if (i == id + 2) {
                newHtml += " (default)</a></li>";
            } else {
                newHtml += "</a></li>";
            }
            return newHtml;
        }
        var newHtml = '<div class="btn-group" role="group">';
        /* Default part */
        newHtml += '<button type="button" class="btn btn-default" onclick="changePort(' + (id + 1) + ',' + (id + 2) + ')">def</button>';
        /* Digital part */
        newHtml += '<div class="btn-group">'
            + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
            + 'D';
        newHtml += ' <span class="caret"></span></button><ul class="dropdown-menu">';
        for (var j = 2; j <= 13 ; j++) newHtml += generatePortMenuSubLoop(id, data, j);
        newHtml += "</ul></div>";
        if(id == 4) {
            /* Analog part */
            newHtml += '<div class="btn-group">'
                + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                + 'A';
            newHtml += ' <span class="caret"></span></button><ul class="dropdown-menu">';
            for (var j = 14; j <= 19 ; j++) newHtml += generatePortMenuSubLoop(id, data, j);
            newHtml += "</ul></div>";
        }
        /* Off part */
        newHtml += '<button type="button" class="btn btn-default" onclick="changePort(' + (id + 1) + ',-1)">off</button>';
        newHtml += "</div>";
        return newHtml;
    }
    var newHtml = "<thead><tr><td>Port</td><td>Pin</td></tr></thead><tbody>";
    for (var i = 0; i < 5; i++) {
        newHtml += "<tr><td>";
        if(i == 4) {
            newHtml += "OUT";
        } else {
            newHtml += i + 1;
        }
        newHtml += "</td><td>" + data[i];
        if (data[i] >= 14) {
            newHtml += " (A" + (data[i]-14) + ")";
        } else if(data[i] == -1) {
            newHtml += " (off)";
        }
        newHtml += "</td></tr><tr><td colspan=2>" + generatePortMenu(i, data) +"</td></tr>";
    }
    newHtml += "</tbody>";
    return newHtml;
}

/* string findSOP(string data)
 * Calculates SOP of test result based on division & conquer,
 * and a table of preset minimal SOP values calculated with Python code.
 * (see gensop folder for python code)
 * (WARNING: NOT PROMISED to return minimal SOP)
 */
function findSOP(data) {
    var tableSize = Math.floor(Math.log2(data.length));
    var tableCount = Math.floor(Math.pow(2, tableSize));
    if (sop[data]) {
        return sop[data];
    } else {
        var response = "";
        if (data.substring(0, Math.floor(tableCount / 2)) == data.substring(Math.floor(tableCount / 2), tableCount)) {
            return findSOP(data.substring(0, Math.floor(tableCount / 2)));
        }
        /* First part */
        var sub = findSOP(data.substring(0, Math.floor(tableCount / 2)));
        if (sub == '1') {
            response += "P" + tableSize + "'";
        } else if (sub == '0') {
            /* Do nothing */
        } else {
            response += "P" + tableSize + "' * " + sub.split(' + ').join(' + P' + tableSize + "' * ");
        }
        /* Second part */
        sub = findSOP(data.substring(Math.floor(tableCount / 2), tableCount));
        if (sub == '1') {
            if (response != "") response += " + ";
            response += "P" + tableSize;
        } else if (sub == '0') {
            /* Do nothing */
        } else {
            if (response != "") response += " + ";
            response += "P" + tableSize + " * " + sub.split(' + ').join(' + P' + tableSize + " * ");
        }
        /* Filter */
        if (response == "P" + tableSize + "' + P" + tableSize) return "1";
        if (response == "") return "0";
        return response;
    }
}

/* string findGate(string data)
 * Compares given test data with a preset value table of different logic gates
 * to find out what gate it is.
 */
function findGate(data) {
    var half = Math.floor(data.length / 2);
    if(gateData[data]) return gateData[data];
    if(data.substring(0, half) == data.substring(half, half * 2)) return findGate(data.substring(0, half));
    return 'Unknown';
}

/* void checkChip(int id)
 * Automatically switch ports and check a given chip's every gate.
 * This code is separated to 2 parts to avoid infinite loop
 * waiting for Arduino's reply.
 */
function checkChip(id) {
    var chipPinPort = chip[id]['pinPort'];
    var chipSet = chip[id]['set'];
    var command = "";
    batchId = id;
    if(batchStep >= chipSet.length) {
        batchStep = -1;
        sendWs('S');
        $('#chipcheck').removeAttr('disabled');
        $('#chipselect').removeAttr('disabled');
        return;
    }
    if(batchStep < 0) {
        /* Update R/W pins */
        i = 0;
        batchStep = 0;
        $("#chipresult").html('<tr><td colspan=5>Test results for ' + chip[id]['name'] + ':</td></tr>');
        $('#chipcheck').attr('disabled', 'disabled');
        $('#chipselect').attr('disabled', 'disabled');
        sendNotification('info', 'Running test...');
    }
    if(chip[id]['type'] == 'general') {
        /* Use truth table to check chip */
        /* Use sendWs to avoid unnecessary port config report */
        for(var j = 0; j < chipSet[batchStep]['writeTo'].length; j++) {
            command += 'C' + (j+1) + chipPinPort[chipSet[batchStep]['writeTo'][j]];
        }
        for(var j = chipSet[batchStep]['writeTo'].length; j < 4; j++) {
            command += 'C' + (j+1) + '/';
        }
        command += 'C5' + chipPinPort[chipSet[batchStep]['readFrom']] + 'S' + chipSet[batchStep]['writeTo'].length;
        sendWs(command);
    } else if(chip[id]['type'] == 'direct') {
        /* Use direct digital operations to check chips, especially flip flops */
        for(var j = 0; j < chipSet[batchStep]['setHigh'].length; j++) {
            command += 'H' + chipPinPort[chipSet[batchStep]['setHigh'][j]];
        }
        for(var j = 0; j < chipSet[batchStep]['setLow'].length; j++) {
            command += 'L' + chipPinPort[chipSet[batchStep]['setLow'][j]];
        }
        command += 'R' + chipPinPort[chipSet[batchStep]['readFrom']];
        sendWs(command);
    }
}

/* void checkChipNext(int id, string data)
 * Gets data from WebSocket, compare it to preset gate result,
 * and reports if the gate works normally.
 * Then, it starts a new loop checking next gate (like a for loop).
 * This code is the 2nd part of checkChip() to avoid infinite loop
 * waiting for Arduino's reply.
 */
function checkChipNext(id, data) {
    if(chip[id]['type'] == 'general') {
        /* Use truth table to check chip */
        var newHtml = '<tr><td>#' + (batchStep+1) + '</td><td><small>' + (chip[id]['set'][batchStep]['comment'] ? chip[id]['set'][batchStep]['comment'] : '') + '</small></td>';
        if(data == chip[id]['set'][batchStep]['result']) {
            newHtml += '<td><span class="label label-success">OK</span></td>';
        } else {
            newHtml += '<td><span class="label label-danger">Fail</span></td>';
        }
        newHtml += '<td>';
        for(var i = 0; i < chip[id]['set'][batchStep]['writeTo'].length; i++) {
            newHtml += '<span class="label label-info">' + chip[id]['set'][batchStep]['writeTo'][i] + '</span> ';
        }
        newHtml += '-> <span class="label label-info">' + chip[id]['set'][batchStep]['readFrom'] + '</span> ';
        if(data == chip[id]['set'][batchStep]['result']) {
            newHtml += '</td><td>result: <span class="label label-info">' + data + "</span></td></tr>";
        } else {
            newHtml += '</td><td>expect: <span class="label label-info">'+ chip[id]['set'][batchStep]['result'] + '</span>, actual: <span class="label label-info">' + data + "</span></td></tr>";
        }
        $('#chipresult').append(newHtml);
    } else if(chip[id]['type'] == 'direct') {
        /* Use direct digital operations to check chips, especially flip flops */
        var newHtml = '<tr><td>#' + (batchStep+1) + '</td><td><small>' + (chip[id]['set'][batchStep]['comment'] ? chip[id]['set'][batchStep]['comment'] : '') + '</small></td>';
        if(data == chip[id]['set'][batchStep]['result']) {
            newHtml += '<td><span class="label label-success">OK</span></td>';
        } else {
            newHtml += '<td><span class="label label-danger">Fail</span></td>';
        }
        newHtml += '<td>';
        for(var i = 1; i <= 14; i++) {
            if(chip[id]['set'][batchStep]['setHigh'].indexOf(i) >= 0) {
                 newHtml += '<span class="label label-success">' + i + '</span> ';
            } else if(chip[id]['set'][batchStep]['setLow'].indexOf(i) >= 0) {
                 newHtml += '<span class="label label-danger">' + i + '</span> ';
            }
        }
        newHtml += '-> <span class="label label-info">' + chip[id]['set'][batchStep]['readFrom'] + '</span> ';
        if(data == chip[id]['set'][batchStep]['result']) {
            newHtml += '</td><td>result: <span class="label label-info">' + data + "</span></td></tr>";
        } else {
            newHtml += '</td><td>expect: <span class="label label-success">'+ chip[id]['set'][batchStep]['result'] + '</span>, actual: <span class="label label-danger">' + data + "</span></td></tr>";
        }
        $('#chipresult').append(newHtml);
    }
    /* Continue to next loop */
    batchStep++;
    checkChip(id);
}

/* void switchChip(int id)
 * Switch between different chip presets for testing.
 * Updates image, select box, result table and check button operations.
 */
function switchChip(id) {
    /*TODO*/
    $("#chipimg").attr('src', 'chips/' + chip[id]['img']);
    $("#chipselect").html(chip[id]['name'] + ' <span class="caret"></span>')
    $("#chipresult").html('<tr><td>Shows result after you run a test.</td></tr>');
    $("#chipcheck").attr('onclick', 'checkChip(' + id + ')');
}

/* void switchMenu(string item)
 * Switch between different pages (sections)
 * by showing / hiding.
 * Items processed are #menu-[item] and #section-[item].
 */
function switchMenu(item) {
    items = ['gate', 'chip', 'about'];
    for(var i = 0; i < items.length; i++) {
        if(item == items[i]) {
            if($('#menu-' + items[i]).hasClass('active')) {
                /* Item already shown, continues to show */
                /* Do nothing */
            } else {
                /* Item hidden, now needs to show */
                $('#menu-' + items[i]).addClass('active');
                $('#section-' + items[i]).removeClass('hidden');
            }
        } else {
            if($('#menu-' + items[i]).hasClass('active')) {
                /* Item already shown, now needs to hide */
                $('#menu-' + items[i]).removeClass('active');
                $('#section-' + items[i]).addClass('hidden');
            } else {
                /* Item hidden, continues to hide */
                /* Do nothing */
            }
        }
    }
}
