/**
 * This function extracts the “ei” attribute from each element of the input JSON array and returns them as a new array.
 * @param {Object} a The input JSON array
 * @returns {Array<string>} An array of strings representing the “ei” values
 */
function jsonToEiArray(a) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result.push(a[i].ei);
    }
    return result;
}

/**
 * This function verifies if the data in the input JSON object matches the data on diretta.it
 * @param {JSON} nodo The input JSON object containing the data to check
 * @returns {Boolean} True if the data is consistent, false otherwise
 */
function check(nodo) {
    thereisntSpeciali = !nodo.td.includes('Speciali');
    direttaData = document.querySelector('div.duelParticipant__startTime').firstChild.innerText;
    goldData = nodo.ed.replaceAll('-', '.');
    equalData = (direttaData === goldData);
    return thereisntSpeciali && equalData;
}

/**
 * This function adds a CSS style to display the fastcode to the user 
 */
function cssAppendFastCode(oc) {
    const innerHTML = `
    <style>
        .prematchLink[title="GoldBet"]::after {
        content: "Fastcode: ${oc}";
        font-size: 16px;
        text-indent: 30px;
        pointer-events: none;
        display: flex;
        align-items: center;
        white-space: nowrap;
      }
      </style> 
    `;
    const parser = new DOMParser();
    const parsed = parser.parseFromString(innerHTML, 'text/html');
    const myStyle = parsed.querySelector('style');
    document.querySelector('head').appendChild(myStyle);
}

function init() {
    var counter = 0;
    const participantInterval = setInterval(() => {
        counter++;
        if (counter > 50) {
            return 0
        }
        if (document.querySelectorAll('a.participant__overflow').length === 2) {
            clearInterval(participantInterval);
            second()
        }
    }, 100);
}

function second() {
    const aTeams = document.querySelectorAll('a.participant__overflow');
    const firstTeam = aTeams[0].firstChild.textContent.toLowerCase();
    const xhttp1 = new XMLHttpRequest();
    xhttp1.onload = function () { third(xhttp1.response); };
    xhttp1.open('POST', 'https://www.goldbet.it/scommesse/searchEvents/');
    jsonRequest = JSON.stringify({
        strSearch: firstTeam
    });
    xhttp1.send(jsonRequest);
}

function third(firstResponse) {
    const aTeams = document.querySelectorAll('a.participant__overflow');
    const secondTeam = aTeams[1].firstChild.textContent.toLowerCase();
    const xhttp2 = new XMLHttpRequest();
    xhttp2.onload = function () { forth(firstResponse, xhttp2.response); };
    xhttp2.open('POST', 'https://www.goldbet.it/scommesse/searchEvents/');
    jsonRequest = JSON.stringify({
        strSearch: secondTeam
    });
    xhttp2.send(jsonRequest);
}

function forth(firstResponse, secondResponse) {
    const firstTeamSearch = JSON.parse(firstResponse);
    const secondTeamSearch = JSON.parse(secondResponse);
    const firstEiArray = jsonToEiArray(firstTeamSearch);
    const secondEiArray = jsonToEiArray(secondTeamSearch);
    const intersectionArray = [];
    for (let i = 0; i < firstEiArray.length; i++) {
        if (secondEiArray.includes(firstEiArray[i])) intersectionArray.push(i);
    }
    var i = 0;
    var node = firstTeamSearch[intersectionArray[0]];
    while (!check(node) && i < intersectionArray.length) {
        i++;
        if (i >= intersectionArray.length) {
            return 0;
        }
        node = firstTeamSearch[intersectionArray[i]];
    }
    cssAppendFastCode(node.oc);
}

init();