// Function to open game URL in a new tab
function openGameInNewTab(url) {
    var win;

    if (url) {
        if (win) {
            win.focus();
        } else {
            win = window.open('about:blank', '_blank');
            win.document.open();
            win.document.write(`
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
            win.document.close();
        }
        // Change the button's state after opening the game
        const button = document.querySelector(`.game-thumbnail[data-url="${url}"] .game-link`);
        if (button) {
            button.style.backgroundColor = 'grey';
            button.style.borderColor = 'grey';
            button.innerHTML = "Opened";
        }
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
