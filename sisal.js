const sisal = {
    matchFilter: function (a) {
        const result = [];
        var b;
        for (let i = 0; i < a.length; i++) {
            b = a[i].avvenimentoFeList;
            for (let j = 0; j < b.length; j++) {
                if (b[j].eventType === 'MATCH') {
                    result.push(b[j]);
                }
            }
        }
        return result;
    },
    check: function (node) {
        const direttaData = document.querySelector('div.duelParticipant__startTime')
        .firstChild.innerText.replaceAll(':','.');
        const sisalData = node.formattedDataAvvenimento
        .replaceAll('/', '.').replaceAll(' ore', '');
        console.log(direttaData);
        console.log(sisalData);
        return (direttaData === sisalData);
    },
    firstCallback: async function (firstTeam, secondTeam) {
        const promiseOne = makeRequest({
            method: 'GET',
            url: `https://betting.sisal.it/api/cerca-palinsesto-sport/search?q=${firstTeam}&offerId=0&entity=${firstTeam}&entityType=TEAM&sport=CALCIO`
        });
        const promiseTwo = makeRequest({
            method: 'GET',
            url: `https://betting.sisal.it/api/cerca-palinsesto-sport/search?q=${secondTeam}&offerId=0&entity=${secondTeam}&entityType=TEAM&sport=CALCIO`
        });
        const searchesRow = await Promise.all([promiseOne, promiseTwo]);
        const firstTeamSearch = JSON.parse(searchesRow[0]).queryContainer;
        const secondTeamSearch = JSON.parse(searchesRow[1]).queryContainer;
        const firstArray = this.matchFilter(firstTeamSearch);
        const secondArray = this.matchFilter(secondTeamSearch);
        console.log(firstArray);
        console.log(secondArray);
        var oc = undefined;
        for (let i = 0; i < Math.min(firstArray.length, secondArray.length); i++) {
            if (firstArray[i].eventId === secondArray[i].eventId && this.check(firstArray[i])) {
                oc = firstArray[i].codiceAvvenimento;
            }
        }
        if (oc === undefined) return 0;
        cssAppendFastCode('Sisal', oc);
    }
}