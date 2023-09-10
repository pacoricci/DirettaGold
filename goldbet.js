const goldBet = {
    /**
     This function extracts the “ei” attribute from each element of the input JSON array and returns them as a new array.
     * @param {Object} a The input JSON array
     * @returns {Array<string>} An array of strings representing the “ei” values
     */
    jsonToEiArray: function (a) {
        const result = [];
        for (let i = 0; i < a.length; i++) {
            result.push(a[i].ei);
        }
        return result;
    },

    /**
     * This function verifies if the data in the input JSON object matches the data on diretta.it
     * @param {JSON} nodo The input JSON object containing the data to check
     * @returns {Boolean} True if the data is consistent, false otherwise
     */
    check: function (nodo) {
        thereisntSpeciali = !nodo.td.includes('Speciali');
        direttaData = document.querySelector('div.duelParticipant__startTime').firstChild.innerText;
        goldData = nodo.ed.replaceAll('-', '.');
        equalData = (direttaData === goldData);
        return thereisntSpeciali && equalData;
    },

    firstCallback: function (firstTeam, secondTeam) {
        const xhttp1 = new XMLHttpRequest();
        xhttp1.onload = function () { goldBet.secondCallback(secondTeam, xhttp1.response); };
        xhttp1.open('POST', 'https://www.goldbet.it/scommesse/searchEvents/');
        jsonRequest = JSON.stringify({
            strSearch: firstTeam
        });
        xhttp1.send(jsonRequest);
    },
    secondCallback: function (secondTeam, firstResponse) {
        const xhttp2 = new XMLHttpRequest();
        xhttp2.onload = function () { goldBet.thirdCallback(firstResponse, xhttp2.response); };
        xhttp2.open('POST', 'https://www.goldbet.it/scommesse/searchEvents/');
        jsonRequest = JSON.stringify({
            strSearch: secondTeam
        });
        xhttp2.send(jsonRequest);
    },
    thirdCallback: function (firstResponse, secondResponse) {
        console.log(firstResponse);
        const firstTeamSearch = JSON.parse(firstResponse);
        const secondTeamSearch = JSON.parse(secondResponse);
        const firstEiArray = goldBet.jsonToEiArray(firstTeamSearch);
        const secondEiArray = goldBet.jsonToEiArray(secondTeamSearch);
        const intersectionArray = [];
        for (let i = 0; i < firstEiArray.length; i++) {
            if (secondEiArray.includes(firstEiArray[i])) intersectionArray.push(i);
        }
        var i = 0;
        var node = firstTeamSearch[intersectionArray[0]];
        while (!goldBet.check(node) && i < intersectionArray.length) {
            i++;
            if (i >= intersectionArray.length) {
                return 0;
            }
            node = firstTeamSearch[intersectionArray[i]];
        }
        cssAppendFastCode('GoldBet', node.oc);
    }
}