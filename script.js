firebase.initializeApp({
    apiKey: "AIzaSyC8t1ZrFPW5CVaLefxlegzyacLrdCg7gIo",
    authDomain: "kocovinometr-2.firebaseapp.com",
    databaseURL: "https://kocovinometr-2.firebaseio.com",
    projectId: "kocovinometr-2",
    storageBucket: "kocovinometr-2.appspot.com",
    messagingSenderId: "1055920872408",
    appId: "1:1055920872408:web:2c62bd56b6ace9d07770ad"
});


const appBar = new mdc.topAppBar.MDCTopAppBar(document.getElementById("app-bar"));
const pointsDiag = new mdc.dialog.MDCDialog(document.getElementById("points-diag"));

document.querySelectorAll(".mdc-button, #points-diag .mdc-list-item").forEach(function(elem) {
    new mdc.ripple.MDCRipple(elem);
});

if (!getParam("id")) {
    location.href = "?id=" + makeid(10);
}

let pointsAdd = 1,
    database = firebase.database(),
    id = getParam("id"),
    dbref = database.ref("users/" + id),
    dbrefParent = database.ref("users"),
    loaded = false;


dbrefParent.on('value', function(snapshot) {
    db = snapshot.val();
    if (db[id]) {
        renderPoints(db[id], db);
        loaded = true;
    } else {
        dbref.set({
            amount: 0,
            name: "Alkoholik"
        });
    }
});

function renderPoints(input, parent) {
    document.getElementById("dl").textContent = `${input.amount}dl`;
    document.getElementById("rank").textContent = `Jste ${calculateRank(parent)}. nejlepší`;
    document.getElementById("name").textContent = `Jméno: ${input.name}`;
    var html = "";
    for (var elem in parent) {
        if (elem != "Example") {
            html += `<div class="mdc-card mdc-card--outlined rival">
            <div class="mdc-typography--headline6">${parent[elem].name}: ${parent[elem].amount}dl</div>
        </div>`;
        }
    }
    document.getElementById("rivals").innerHTML = html;
}

function calculateRank(db) {
    var array = [],
        rank = 1,
        finalrank = false;
    for (var elem in db) {
        array.push(db[elem].amount);
    }
    array.sort(function(a, b) {
        return b - a;
    });
    array.forEach(function(val) {
        if (val == db[id].amount) {
            finalrank = rank;
        } else {
            rank++;
        }

    });
    return finalrank;
}

function addPoint(amount) {
    if (db[id].amount + amount * pointsAdd < 0) {
        dbref.set({
            amount: 0,
            name: db[id].name
        });
        return;
    }
    dbref.set({
        amount: db[id].amount + amount * pointsAdd,
        name: db[id].name
    });
}

function changeName() {
    var person = prompt("Zadejte nové jméno", "Alkoholik");

    if (person == null || person == "") {

    } else {
        dbref.set({
            amount: db[id].amount,
            name: person
        });
    }
}

function getParam(param) {
    return new URL(window.location.href).searchParams.get(param);
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}