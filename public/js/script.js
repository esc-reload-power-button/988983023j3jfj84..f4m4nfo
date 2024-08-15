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
    const gameFolders = ['games/SmashKarts', 'games/Minecraft']; // Updated paths

    for (const folderPath of gameFolders) {
        const gameInfo = await fetchGameData(folderPath);
        
        const gameImageSrc = `${folderPath}/game.png`;
        const gameCategory = gameInfo.Genre ? gameInfo.Genre.toLowerCase() + '-games' : 'unknown-games'; // Added a fallback

        const gameGrid = document.querySelector(`#${gameCategory} .game-grid`);
        
        if (gameGrid) { // Ensure the grid exists
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
        } else {
            console.error(`No game grid found for category: ${gameCategory}`);
        }
    }
}

// Load the games when the page is loaded
window.addEventListener('load', loadGames);
