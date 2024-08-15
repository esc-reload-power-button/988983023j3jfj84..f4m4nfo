// Function to fetch game data
async function fetchGameData(folderPath) {
    try {
        const response = await fetch(`${folderPath}/info.txt`);
        if (!response.ok) throw new Error(`Failed to fetch ${folderPath}/info.txt`);
        const data = await response.text();
        const gameInfo = {};
        
        data.split('\n').forEach(line => {
            const [key, value] = line.split(':');
            if (key && value) {
                gameInfo[key.trim()] = value.trim();
            }
        });
        return gameInfo;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Function to open game URL in a new tab
function openGameInNewTab('https://www.example.com') {
    try {
        const newTab = window.open('about:blank', '_blank');
        newTab.document.open();
        newTab.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Loading...</title>
            </head>
            <body style="margin: 0; height: 100vh; overflow: hidden;">
                <iframe src="${url}" style="width: 100%; height: 100%; border: none;"></iframe>
            </body>
            </html>
        `);
        newTab.document.close();
    } catch (error) {
        console.error('Failed to open game in new tab:', error.message);
    }
}

// Function to load games
async function loadGames() {
    const gameFolders = ['/games/SmashKarts']; // Only Smash Karts for now

    for (const folderPath of gameFolders) {
        const gameInfo = await fetchGameData(folderPath);

        if (!gameInfo) {
            console.error(`No game info found for ${folderPath}`);
            continue;
        }

        const gameImageSrc = `${folderPath}/game.png`;
        const gameCategory = (gameInfo.Genre && gameInfo.Genre.toLowerCase().replace(/\s+/g, '-') + '-games') || 'unknown-games';
        
        const gameGrid = document.querySelector(`#${gameCategory} .game-grid`);
        
        if (!gameGrid) {
            console.error(`No game grid found for category: ${gameCategory}`);
            continue;
        }

        const gameThumbnail = document.createElement('div');
        gameThumbnail.className = 'game-thumbnail';
        
        const img = document.createElement('img');
        img.src = gameImageSrc;
        img.alt = gameInfo.Name;
        
        const p = document.createElement('p');
        p.textContent = gameInfo.Name;
        
        const link = document.createElement('a');
        link.href = '#'; // Placeholder
        link.className = 'game-link';
        link.textContent = 'Play'; // Add a text to make it clickable
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

// Load the games when the page is loaded
window.addEventListener('load', loadGames);
