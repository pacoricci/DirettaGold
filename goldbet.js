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
        const thereisntSpeciali = !nodo.td.includes('Speciali');
        const direttaData = document.querySelector('div.duelParticipant__startTime').firstChild.innerText;
        const goldData = nodo.ed.replaceAll('-', '.');
        const equalData = (direttaData === goldData);
        return thereisntSpeciali && equalData;
    },

    firstCallback: async function (firstTeam, secondTeam) {
        var jsonRequest = JSON.stringify({
            strSearch: firstTeam
        });
        const promiseOne = makeRequest({
            method: 'POST',
            url: 'https://www.goldbet.it/scommesse/searchEvents/',
            params: jsonRequest
        });
        jsonRequest = JSON.stringify({
            strSearch: secondTeam
        });
        const promiseTwo = makeRequest({
            method: 'POST',
            url: 'https://www.goldbet.it/scommesse/searchEvents/',
            params: jsonRequest
        });
        searchesRow = await Promise.all([promiseOne, promiseTwo]);
        const firstTeamSearch = JSON.parse(searchesRow[0]);
        const secondTeamSearch = JSON.parse(searchesRow[1]);
        const firstEiArray = this.jsonToEiArray(firstTeamSearch);
        const secondEiArray = this.jsonToEiArray(secondTeamSearch);
        const intersectionArray = [];
        for (let i = 0; i < firstEiArray.length; i++) {
            if (secondEiArray.includes(firstEiArray[i])) intersectionArray.push(i);
        }
        var i = 0;
        var node = firstTeamSearch[intersectionArray[0]];
        while (!this.check(node) && i < intersectionArray.length) {
            i++;
            if (i >= intersectionArray.length) {
                return 0;
            }
            node = firstTeamSearch[intersectionArray[i]];
        }
        cssAppendFastCode('GoldBet', node.oc);
    }
}