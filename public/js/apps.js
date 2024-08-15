// Function to open the app in a modal
function openAppInModal(url) {
    const modal = document.getElementById('appModal');
    const iframe = document.getElementById('appFrame');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const closeModal = document.querySelector('#appModal .close');

    console.log('Opening app URL:', url); // Debug line to check URL

    iframe.src = url;
    modal.style.display = 'block';

    // Close the modal
    closeModal.onclick = function() {
        modal.style.display = 'none';
        iframe.src = ''; // Stop the app when closing the modal
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
 
// Function to fetch app data
async function fetchAppData(folderPath) {
    try {
        const response = await fetch(`${folderPath}/info.txt`);
        if (!response.ok) throw new Error(`Failed to fetch ${folderPath}/info.txt`);
        const data = await response.text();
        const appInfo = {};
        
        data.split('\n').forEach(line => {
            const [key, value] = line.split(':');
            if (key && value) {
                appInfo[key.trim()] = value.trim();
            }
        });
        return appInfo;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Function to load apps
async function loadApps() {
    const appFolders = ['/Apps/UselessWeb']; // Replace with actual app folder paths

    for (const folderPath of appFolders) {
        const appInfo = await fetchAppData(folderPath);

        if (!appInfo) {
            console.error(`No app info found for ${folderPath}`);
            continue;
        }

        const appImageSrc = `${folderPath}/app.png`;
        // Convert Category to lower-case and replace spaces with hyphens
        const appCategory = (appInfo.Category && appInfo.Category.toLowerCase().replace(/\s+/g, '-') + '-apps') || 'other-apps';

        const appGrid = document.querySelector(`#${appCategory} .app-grid`);

        if (!appGrid) {
            console.error(`No app grid found for category: ${appCategory}`);
            continue;
        }

        const appThumbnail = document.createElement('div');
        appThumbnail.className = 'app-thumbnail';

        const img = document.createElement('img');
        img.src = appImageSrc;
        img.alt = appInfo.Name || 'App Thumbnail';

        const title = document.createElement('p');
        title.textContent = appInfo.Name || 'Unknown Title';

        appThumbnail.appendChild(img);
        appThumbnail.appendChild(title);
        appGrid.appendChild(appThumbnail);

        // Make the app thumbnail clickable
        appThumbnail.onclick = () => openAppInModal(appInfo.URL);
    }
}

// Load the apps when the page is loaded
window.addEventListener('load', loadApps);
