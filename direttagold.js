/**
 * This function adds a CSS style to display the fastcode to the user 
 */
function cssAppendFastCode(site, oc) {
    const innerHTML = `
    <style>
        .prematchLink[title="${site}"]::after {
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
            const aTeams = document.querySelectorAll('a.participant__overflow');
            const firstTeam = aTeams[0].firstChild.textContent.toLowerCase();
            const secondTeam = aTeams[1].firstChild.textContent.toLowerCase();
            goldBet.firstCallback(firstTeam, secondTeam);
        }
    }, 100);
}

init();