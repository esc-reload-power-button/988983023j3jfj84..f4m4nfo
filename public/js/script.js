// Function to open the game in a new cloaked tab
function openGameInCloakedTab(url) {
    // Create a new cloaked tab
    const win = window.open('about:blank', '_blank');
    win.document.open();
    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Inbox</title>
            <link rel="icon" href="https://img.icons8.com/?size=100&id=P7UIlhbpWzZm&format=png&color=000000" type="image/png">
            <style>
                body {

    
          
            
    

          
          Expand Down
    
    
  
                    margin: 0;
                    overflow: hidden;
                }
                iframe {
                    width: 100vw;
                    height: 100vh;
                    border: none;
                }
            </style>
        </head>
        <body>
            <iframe src="${url}" sandbox="allow-same-origin allow-scripts"></iframe>
        </body>
        </html>
    `);
    win.document.close();
}
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
// Function to load games
async function loadGames() {
    const gameFolders = ['/games/SmashKarts', '/games/Minecraft']; // Only Smash Karts for now
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
        img.alt = gameInfo.Name || 'Game Thumbnail';
        const title = document.createElement('p');
        title.textContent = gameInfo.Name || 'Unknown Title';
        gameThumbnail.appendChild(img);
        gameThumbnail.appendChild(title);
        gameGrid.appendChild(gameThumbnail);
        // Make the game thumbnail clickable
        gameThumbnail.onclick = () => openGameInCloakedTab(gameInfo.URL);
    }
}
// Load the games when the page is loaded
window.addEventListener('load', loadGames);
