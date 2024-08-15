// Sample function to fetch game data
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

async function loadGames() {
    // Use paths relative to the root of the web server
    const gameFolders = ['/games/Smash%20Karts', '/games/Minecraft']; // Note: Space is replaced with %20

    for (const folderPath of gameFolders) {
        const gameInfo = await fetchGameData(folderPath);
        
        const gameImageSrc = `${folderPath}/game.png`; // Assuming the image is always named game.png
        const gameCategory = gameInfo.Genre.toLowerCase() + '-games';
        
        const gameGrid = document.querySelector(`#${gameCategory} .game-grid`);
        
        const gameThumbnail = document.createElement('div');
        gameThumbnail.className = 'game-thumbnail';
        
        const img = document.createElement('img');
        img.src = gameImageSrc;
        img.alt = gameInfo.Name;
        
        const p = document.createElement('p');
        p.textContent = gameInfo.Name;

        gameThumbnail.appendChild(img);
        gameThumbnail.appendChild(p);
        gameGrid.appendChild(gameThumbnail);
    }
}

// Load the games when the page is loaded
window.addEventListener('load', loadGames);
