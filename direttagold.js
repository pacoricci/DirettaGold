/**
 * This function sends a request to www.goldebet.it and receives a JSON response.
 * The request is based on the text entered in the search bar of https://www.goldbet.it/scommesse/
 * @param {string} text The query text for the search
 * @returns {JSON} A JSON object containing a list of matching results
 */
function searchGold(text) {
    return $.ajax({
        url: 'https://www.goldbet.it/scommesse/searchEvents/',
        data: '{"strSearch":"' + text + '"}',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'Post',
        async: false,
        dataType: 'json'
    }).responseJSON;
}
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
function cssAppendFastCode() {
    const myStyle = document.createElement('style');
    myStyle.innerHTML = `
      .prematchLink[title="GoldBet"]::after {
        content: "Fastcode: ${oc}";
        font-size: 16px;
        text-indent: 30px;
        pointer-events: none;
        display: flex;
        align-items: center;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(myStyle);
}
function init() {
    const participantInterval = setInterval(() => {
        if (document.querySelectorAll('a.participant__overflow').length === 2) {
            clearInterval(participantInterval);
            second()
        }
    }, 100);
    function second() {
        const aTeams = document.querySelectorAll('a.participant__overflow');
        const firstTeam = aTeams[0].firstChild.textContent.toLowerCase();
        const secondTeam = aTeams[1].firstChild.textContent.toLowerCase();
        const firstTeamSearch = searchGold(firstTeam);
        const secondTeamSearch = searchGold(secondTeam);
        console.log(typeof firstTeamSearch);
        // Arrays intesection
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
        oc = node.oc;
        cssAppendFastCode();
    }
}


var oc = 0;
const goldQuery = 'a.prematchLink[title="GoldBet"]';
console.log('Inizio');
init();