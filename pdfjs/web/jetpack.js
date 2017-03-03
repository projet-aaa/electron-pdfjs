/**
 * Created by stoakes on 03/03/17.
 */

/**
 * Send current page to API
 * @param ttl int the current iteration. Will stop the retry if >= 2
 */
function sendpage(ttl) {

    var req = new XMLHttpRequest();
    req.open('POST', api + "/alerts?bearer=" + token, true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("Accept", "application/json");
    req.send(JSON.stringify({"session": session, "text": page.toString(), "alertType": "page"}));

    req.onload = function () {
        if (req.status != 201 && ttl < 2) {//if error code, replay the request.
            getNewToken();
            sendpage(ttl+1);
        }
    };

}

/**
 * Re-authenticate on the api
 */
function getNewToken() {
    var req = new XMLHttpRequest();
    var data = "_username=" + username + "&_password=" + password;

    req.open('POST', api + '/login_check', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.setRequestHeader('Accept', 'application/json');

    //request result handler
    req.onload = function () {
        var json = JSON.parse(req.responseText);//parse the request result.
        token = json.token; //assign it to global variable

    };

    req.send(null);

}


/**
 * Try to authenticate on API.
 * Uses username and password global variable to get a token.
 * Populate the token variable
 * Called when Connection button is pressed
 */
function loginProcedure() {

    // Fill the global variables with content of form.
    username = document.getElementById('usernameInput').value
    password = document.getElementById('passwordInput').value;

    var req = new XMLHttpRequest();
    var data = "_username=" + username + "&_password=" + password;

    req.open('POST', api + '/login_check', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.setRequestHeader('Accept', 'application/json');

    // Send result handler
    req.onload = function () {

        var response = req.status;
        var reloadCounter = 0;

        while (response != 200 && reloadCounter < 3) {

            response = getNewToken();
            reloadCounter++;

        }

        // Parse the JSON with to token inside.
        var json = JSON.parse(req.responseText);

        if (json.token != undefined) {
            // Store the token value and start displaying the pdfjs div.
            token = json.token;
            document.getElementById('resultLogin').innerHTML = 'Connection succeeded';
            document.getElementById('resultLogin').className = 'jt-alert jt-alert-success';
            getSessionList(0);
        }
        else {
            document.getElementById('resultLogin').innerHTML = 'Connection failed';
            document.getElementById('resultLogin').className = 'jt-alert jt-alert-warning';
        }


    };

    // Actually send username and password to get the token.
    req.send(data);
}

/**
 * Validate a session and make PDF div visible
 */
function enterPDF() {
    session = document.getElementById('sessionList').value;
    document.getElementById('tokenForm').style.display = 'none';
    document.body.style.backgroundColor = '#404040';
    document.getElementById('outerContainer').style.display = 'block';
    PDFViewerApplication.zoomOut();
    PDFViewerApplication.zoomIn();

    // Connect to the node server.
    socket.emit('action', { type : "SERVER/AUTHENTIFY", payload : {  username: username, isTeacher: true } });

}


/**
 * Populate the global list of session : sessionList
 * @param ttl int the number of times the query has alredy been replayed.
 */
function getSessionList(ttl) {
    if (ttl < 3) {
        var req = new XMLHttpRequest();
        req.open('GET', api + "/sessions?bearer=" + token, true);
        req.setRequestHeader("Content-type", "application/ld+json");
        req.setRequestHeader("Accept", "application/ld+json");
        req.send();

        req.onload = function () {
            if (req.status != 200) {//if error code, replay the request.
                getSessionList(ttl + 1);
            }
            else {
                var response = JSON.parse(req.responseText);
                sessionList = response['hydra:member'];
                displaySessionList();

            }

        }
    }
    return false;
}

/**
 * Iterate over sessionList global var to populate the sessionList select with options
 */
function displaySessionList() {
    var sessionSelect = document.getElementById("sessionList");

    //clear the current options
    while (sessionSelect.firstChild) {
        sessionSelect.removeChild(sessionSelect.firstChild);
    }
    //add option from query result
    for (sessionid in sessionList) {
        var option = document.createElement("option");
        option.text = sessionList[sessionid].name;
        option.value = sessionList[sessionid]['@id'];
        sessionSelect.add(option);
    }
}

/**
 * Sockets : @see @hardkey & @gibss
 */
