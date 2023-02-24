//2qb
function GetLichessMoves() {
    let movesTag = document.querySelectorAll("kwdb");
    let moveList = Array.from(movesTag).map((element, index) => {
        let moveNumber = Math.floor(index / 2) + 1;
        let moveText = element.textContent;
        //moveText = moveText.replace(/[+#]/g, "");
        return (index % 2 === 0) ? `${moveNumber}. ${moveText}` : moveText;
    });
    return moveList.join(" ");
};

function SendMovesToServer() {
    const moves = GetLichessMoves();
    const data = { moves: moves };
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    };
    fetch('http://localhost:5000/moves', requestOptions)
        .then(response => {
            console.log('Moves sent successfully:', data);
        })
        .catch(error => {
            console.error('Error sending moves:', error);
        });
}

const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            let addedNodes = Array.from(mutation.addedNodes);
            let removedNodes = Array.from(mutation.removedNodes);
            let changedNodes = addedNodes.concat(removedNodes).filter(node => node.tagName === 'KWDB');
            if (changedNodes.length > 0) {
                SendMovesToServer();
                break;
            }
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});