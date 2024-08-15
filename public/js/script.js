// Function to fetch game data from info.txt
async function fetchGameData(folderPath) {
    const response = await fetch(`${folderPath}/info.txt`);
    const data = await response.text();
    const gameInfo = {};
    
    data.split('\n').forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
            gameInfo[key.trim()] = value.trim();
        }
    });
    return gameInfo;
}

// Function to load games and add event listeners
async function loadGames() {
    const gameFolders = ['/games/SmashKarts', '/games/Minecraft']; // Update with correct paths

    for (const folderPath of gameFolders) {
        const gameInfo = await fetchGameData(folderPath);
        
        const gameImageSrc = `${folderPath}/game.png`;
        const gameCategory = gameInfo.Genre.toLowerCase() + '-games';
        
        const gameGrid = document.querySelector(`#${gameCategory} .game-grid`);
        
        const gameThumbnail = document.createElement('div');
        gameThumbnail.className = 'game-thumbnail';
        
        const img = document.createElement('img');
        img.src = gameImageSrc;
        img.alt = gameInfo.Name;
        
        const p = document.createElement('p');
        p.textContent = gameInfo.Name;
        
        const link = document.createElement('a');
        link.href = '#'; // Placeholder, will be updated with JavaScript
        link.className = 'game-link';
        link.addEventListener('click', function(event) {
            event.preventDefault();
            openGameInNewTab(gameInfo.URL);
        });

        gameThumbnail.appendChild(img);
        gameThumbnail.appendChild(p);
        gameThumbnail.appendChild(link);
        gameGrid.appendChild(gameThumbnail);
    }
}

// Function to open the game in a new tab with an about:blank intermediary
function openGameInNewTab(gameUrl) {
    const newTab = window.open('about:blank', '_blank');

    newTab.document.open();
    newTab.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Game</title>
        </head>
        <body>
            <iframe src="${gameUrl}" style="width:100%; height:100%; border:none;"></iframe>
        </body>
        </html>
    `);
    newTab.document.close();
}

// Load the games when the page is loaded
window.addEventListener('load', loadGames);
