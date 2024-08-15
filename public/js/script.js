// Function to open the game in a modal
function openGameInModal(url) {
    const modal = document.getElementById('gameModal');
    const iframe = document.getElementById('gameFrame');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    console.log('Opening game URL:', url); // Debug line to check URL

    iframe.src = url;
    modal.style.display = 'block';

    // Close the modal
    const closeModal = document.querySelector('.close');
    closeModal.onclick = function() {
        modal.style.display = 'none';
        iframe.src = ''; // Stop the game when closing the modal
    };

    // Toggle fullscreen mode
    fullscreenBtn.onclick = function() {
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) { /* Firefox */
            iframe.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) { /* IE/Edge */
            iframe.msRequestFullscreen();
        }
    };
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
        img.alt = gameInfo.Name || 'Game Thumbnail';

        const title = document.createElement('p');
        title.textContent = gameInfo.Name || 'Unknown Title';

        const description = document.createElement('p');
        description.textContent = gameInfo.Genre || 'No genre available.';

        gameThumbnail.appendChild(img);
        gameThumbnail.appendChild(title);
        gameThumbnail.appendChild(description);
        gameGrid.appendChild(gameThumbnail);

        // Make the game thumbnail clickable
        gameThumbnail.onclick = () => openGameInModal(gameInfo.URL);
    }
}


// Load the games when the page is loaded
window.addEventListener('load', loadGames);
