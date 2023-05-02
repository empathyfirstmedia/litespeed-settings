// ==UserScript==
// @name         LightSpeed / VendHQ Toolbox 2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Modifies the Lightspeed POS
// @author       Tyler Hall Tech
// @require      none
// @require      none
// @match        https://*.vendhq.com/*
// @match        https://*.vendhq.com/register.php*
// @match        https://*.merchantos.com/register.php*
// @match        https://*.lightspeedapp.com/*
// @match        https://*.lightspeedpos.com/*
// @match        https://*.merchantos.com/*
// @match        https://*.vendhq.com/*
// @icon         <$ICON$>
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/tyhallcsu/litespeed-settings/main/litespeed-toolbox.user.js
// @downloadURL  https://raw.githubusercontent.com/tyhallcsu/litespeed-settings/main/litespeed-toolbox.user.js
// ==/UserScript==

(function() {
    'use strict';

    // URL of the new logo
    const newLogoUrl = 'https://cdn.shopify.com/s/files/1/0069/0444/7046/files/Perfectly_Healthy_Logo_by_Tyler_2-bfds_130x@2x.png';

    // URL of the old logo to be replaced
    const oldLogoUrl = 'https://vendfrontendassets.freetls.fastly.net/images/logos/lightspeed-logo-white-v3.svg';

    // Function to update the logo based on the "whitelabelLogo" setting
    function updateLogo() {
        const whitelabelLogoEnabled = localStorage.getItem('whitelabelLogo') === 'true';
        const logoImages = document.querySelectorAll('img');
        for (const logoImage of logoImages) {
            if (whitelabelLogoEnabled && logoImage.src === oldLogoUrl) {
                logoImage.src = newLogoUrl;
            } else if (!whitelabelLogoEnabled && logoImage.src === newLogoUrl) {
                logoImage.src = oldLogoUrl;
            }
        }
    }

    // Create a MutationObserver to monitor changes in the DOM
    const observer = new MutationObserver(updateLogo);

    // Start observing the entire document for changes
    observer.observe(document, { childList: true, subtree: true });

    // Function to add the "Export All Customers" button based on the "Setting 2" setting
    function addExportAllCustomersButton(enabled) {
        const exportPagesDiv = document.querySelector('.export-pages');
        if (!exportPagesDiv) return;

        // Remove the existing "Export All Customers" button if it exists
        const existingButton = document.querySelector('.export-all-customers-button');
        if (existingButton) {
            existingButton.remove();
        }

        // If the setting is enabled, add the "Export All Customers" button
        if (enabled) {
            const numberOfPages = exportPagesDiv.querySelectorAll('.btn.download-icon').length;
            const pageSize = (numberOfPages + 1) * 1000;
            const exportAllButton = document.createElement('a');
            exportAllButton.className = 'export-all-customers-button vd-btn vd-btn--supplementary trigger-inventory-tour-guidance-adding-catalog';
            exportAllButton.href = `/customer?format=csv&page=1&page_size=${pageSize}&dir=ASC&order=DEFAULT`;
            exportAllButton.textContent = 'Export All Customers';
            exportPagesDiv.appendChild(exportAllButton);
    }
}

// Define a variable to store the input value (barcode) temporarily.
let barcodeInput = '';

// Define a function to handle keydown events.
const handleKeydown = (event) => {
    // Check if the current page is the /webregister page
    if (window.location.pathname === '/webregister') {
        // Append the key pressed to the barcode input, except for the "Enter" key
        if (event.key !== 'Enter') {
            barcodeInput += event.key;
        } else {
            // If the "Enter" key is pressed, process the barcode input
            if (barcodeInput.length > 0) {
                // Find the search field on the webpage
                const searchField = document.querySelector('input.vd-autocomplete-input');
                if (searchField) {
                    // Set the value of the search field to the barcode input
                    searchField.value = barcodeInput;

                    // Trigger an 'input' event on the search field to notify React
                    const inputEvent = new Event('input', { bubbles: true });
                    searchField.dispatchEvent(inputEvent);

                    // Trigger a 'change' event on the search field to update the search results
                    const changeEvent = new Event('change', { bubbles: true });
                    searchField.dispatchEvent(changeEvent);
                }
            }
            // Reset the barcode input
            barcodeInput = '';
        }
    }
};

// Function to handle barcode input based on the "Setting 3" setting
function handleBarcodeInput(enabled) {
    if (enabled) {
        document.addEventListener('keydown', handleKeydown);
    } else {
        document.removeEventListener('keydown', handleKeydown);
    }
}

// Call the updateLogo and addExportAllCustomersButton functions initially
updateLogo();
addExportAllCustomersButton(localStorage.getItem('setting2') === 'true');
handleBarcodeInput(localStorage.getItem('setting3') === 'true');
//hideUsers(localStorage.getItem('setting4') === 'true');

// Call the handleAutoPasswordSignIn function initially
//handleAutoPasswordSignIn(localStorage.getItem('autoPasswordSignIn') === 'true');
// Call the handleAutoPasswordSignIn function initially
const autoPasswordSignInEnabled = localStorage.getItem('autoPasswordSignIn') === 'true';
const autoSubmitEnabled = localStorage.getItem('autoSubmit') === 'true';
handleAutoPasswordSignIn(autoPasswordSignInEnabled, autoSubmitEnabled);

    // Create a floating button
    const floatingButton = document.createElement('button');
    floatingButton.classList.add('vd-dialog-close-button');
    floatingButton.type = 'button';
    floatingButton.id = 'toolbox-button'; // Assign a unique ID to the button
    floatingButton.innerHTML = '<i class="vd-i vd-i-times vd-icon vd-dialog-close-icon"></i><span id="toolbox-label" class="vd-dialog-close-label">PH Toolbox</span>';
    floatingButton.style.position = 'fixed';
    floatingButton.style.bottom = '20px';
    floatingButton.style.right = '20px';
    floatingButton.style.width = '50px';
    floatingButton.style.height = '50px';
    floatingButton.style.zIndex = '9999';

    // Create a container for the floating button
    const floatingButtonContainer = document.createElement('div');
    floatingButtonContainer.classList.add('vd-dialog-close');
    floatingButtonContainer.appendChild(floatingButton);
    document.body.appendChild(floatingButtonContainer);

    // Add styles to override the width and height for the specific button
    const styleElement = document.createElement('style');
    styleElement.textContent = `
    #toolbox-label{
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }
    #toolbox-button {
        width: auto;  // Override the width
        height: auto; // Override the height
        box-shadow: 0 0 5px 3px rgba(var(--vd-colour--supplementary-rgb), .1);
            border: 2px solid var(--vd-colour--framing);
    }
    #toolbox-button:hover {
        outline: none;
        box-shadow: 0 0 5px 3px rgba(var(--vd-colour--supplementary-rgb), .5);
        border-color: var(--vd-colour--keyline);
    }

    `;

    // Append the <style> element to the document's <head>
    document.head.appendChild(styleElement);

// Create a settings panel
const settingsPanel = document.createElement('div');
settingsPanel.classList.add('vd-popover', 'vd-popover-container', 'vd-popover--with-list');
settingsPanel.style.display = 'none';
settingsPanel.style.position = 'fixed';
settingsPanel.style.bottom = '60px';
settingsPanel.style.right = '20px';
settingsPanel.style.zIndex = '9999';
// settingsPanel.style.backgroundColor = 'white';
// settingsPanel.style.border = '1px solid black';
// settingsPanel.style.borderRadius = '5px';
// settingsPanel.style.padding = '10px';
// settingsPanel.style.boxShadow = '0 0 5px 3px rgba(0, 0, 0, 0.2)';
document.body.appendChild(settingsPanel);

    // Create a content container for the settings panel
    const settingsContent = document.createElement('div');
    settingsContent.classList.add('vd-popover-content');
    settingsPanel.appendChild(settingsContent);

    // Create a list container for the settings panel
    const settingsList = document.createElement('ul');
    settingsList.classList.add('vd-popover-list');
    settingsContent.appendChild(settingsList);

// Function to create a switch for a setting
// function createSettingSwitch(label, settingKey, onChange) {
//     const settingContainer = document.createElement('div');
//     const settingLabel = document.createElement('label');
//     const settingSwitch = document.createElement('input');
//     settingSwitch.type = 'checkbox';
//     settingSwitch.checked = localStorage.getItem(settingKey) === 'true';
//     settingLabel.textContent = label;
//     settingContainer.appendChild(settingLabel);
//     settingContainer.appendChild(settingSwitch);
//     settingsPanel.appendChild(settingContainer);

//     // Update the setting in local storage when the switch is toggled
//     settingSwitch.addEventListener('change', () => {
//         localStorage.setItem(settingKey, settingSwitch.checked);
//         onChange(settingSwitch.checked);
//     });
// }

// Function to create a switch for a setting
function createSettingSwitch(label, settingKey, onChange) {
    const settingContainer = document.createElement('li');
    const settingLink = document.createElement('a');
    settingLink.href = 'javascript:void(0)';
    settingLink.classList.add('vd-popover-list-item', 'setting-container'); // Add 'setting-container' class
    const settingLabel = document.createElement('label');
    settingLabel.className = 'setting-label'; // Add 'setting-label' class
    const settingSwitch = document.createElement('input');
    settingSwitch.type = 'checkbox';
    settingSwitch.checked = localStorage.getItem(settingKey) === 'true';
    settingSwitch.classList.add('custom-switch', 'setting-switch'); // Add 'setting-switch' class
    settingSwitch.id = settingKey; // Set the id attribute for the checkbox
    settingLabel.textContent = label;
    settingLabel.htmlFor = settingKey; // Set the htmlFor attribute for the label
    settingLink.appendChild(settingLabel);
    settingLink.appendChild(settingSwitch);
    settingContainer.appendChild(settingLink);
    settingsList.appendChild(settingContainer);

    // Update the setting in local storage when the switch is toggled
    settingSwitch.addEventListener('change', () => {
        localStorage.setItem(settingKey, settingSwitch.checked);
        onChange(settingSwitch.checked);
    });
}

// Add styles for the custom switch
const styleSwitch = document.createElement('style');
styleSwitch.textContent = `
.setting-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.setting-label {
    flex: 1;
    text-align: left;
}

.custom-switch {
    appearance: none;
    outline: none;
    width: 40px;
    height: 20px;
    background-color: #ccc;
    border-radius: 20px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.custom-switch:checked {
    background-color: #4CAF50;
}

.custom-switch::before {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: left 0.3s ease;
}

.custom-switch:checked::before {
    left: calc(100% - 18px);
}
`;
document.head.appendChild(styleSwitch);

// Define a function to handle auto-password sign-in and auto-submit
function handleAutoPasswordSignIn(enabled, autoSubmit) {
    // Define the password to be auto-filled
    const autoFillPassword = 'CNMedicine123#';

    // Create a MutationObserver to monitor changes to the DOM
    const observer = new MutationObserver((mutations) => {
        // Check if the auto-password sign-in feature is enabled
        if (enabled) {
            // Find the password input field
            const passwordInput = document.querySelector('input[type="password"][ng-model="$ctrl.password"]');
            if (passwordInput) {
                // Set the value of the password input field to the auto-fill password
                passwordInput.value = autoFillPassword;
                // Optionally, you can trigger an input event to notify AngularJS of the change
                const inputEvent = new Event('input', { bubbles: true });
                passwordInput.dispatchEvent(inputEvent);

                // Check if the auto-submit feature is enabled
                if (autoSubmit) {
                    // Find the form element
                    const formElement = document.querySelector('#userSwitchingForm');
                    if (formElement) {
                        // Submit the form
                        formElement.submit();
                    }
                }
            }
        }
    });

    // Start observing the entire document for changes
    observer.observe(document, { childList: true, subtree: true });
}

// Create a MutationObserver to monitor changes in the DOM for user filtering
const userObserver = new MutationObserver((mutations) => {
    filterUsers('.pro-available-user-list > li'); // Filter main list of users
    filterUsers('.pro-recent-user-list > li'); // Filter recent users
});

// Start observing the entire document for changes
userObserver.observe(document, { childList: true, subtree: true });

// Define the allowed usernames
const allowedUsernames = ['bernie', 'dale', 'erika', 'gita', 'kenna', 'lisa'];

// Define the disallowed usernames
const disallowedUsernames = ['daniel', 'craig', 'admin', 'ryan', 'tyler', 'zconnealy'];

// Function to filter users based on the criteria
function filterUsers(userListSelector) {
    // Check if the current page is the /webregister page
    if (window.location.pathname === '/webregister') {
        // Find the list of users
        const userListItems = document.querySelectorAll(userListSelector);
        if (userListItems) {
            // Iterate over each user in the list
            userListItems.forEach((userListItem) => {
                // Extract the username from the badge
                const username = userListItem.querySelector('.vd-id-badge__header-title').textContent.trim();

                // Check if the username starts with "0" or is in the allowed list
                const isAllowed = username.startsWith('0') || allowedUsernames.includes(username.toLowerCase());

                // Check if the username is in the disallowed list
                const isDisallowed = disallowedUsernames.includes(username.toLowerCase());

                // Show or hide the user based on the conditions
                if (isAllowed && !isDisallowed) {
                    userListItem.style.display = '';
                    console.log(`User found: ${username}`);
                } else {
                    userListItem.style.display = 'none';
                    console.log(`User not found: ${username}`);
                }
            });
        }
    }
}


// Create a button to run the user filtering code on-demand
const filterButton = document.createElement('button');
filterButton.textContent = 'Filter Users';
filterButton.style.position = 'fixed';
filterButton.style.bottom = '100px';
filterButton.style.right = '20px';
filterButton.style.zIndex = '9999';
document.body.appendChild(filterButton);

// Add a click event listener to the button
filterButton.addEventListener('click', () => {
    // Run the user filtering code when the button is clicked
    const mainListStatus = filterUsers('.pro-available-user-list > li'); // Filter main list of users
    const recentListStatus = filterUsers('.pro-recent-user-list > li'); // Filter recent users
    console.log(mainListStatus);
    console.log(recentListStatus);
});



// Function to create setting link
function createSettingLink(title, url) {
    const settingContainer = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = title;
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.classList.add('vd-popover-list-item');
    settingContainer.appendChild(link);
    settingsList.appendChild(settingContainer);
}

// Function to create a title for the settings panel
function createSettingsTitle(titleText) {
    const titleContainer = document.createElement('li');
    const title = document.createElement('div');
    title.textContent = titleText;
    title.classList.add('settings-title'); // Add 'settings-title' class
    titleContainer.appendChild(title);
    settingsList.appendChild(titleContainer);
}

// Create the title for the settings panel
createSettingsTitle('PerfectlyHealthy by Tyler');


// Create switches for various settings
createSettingSwitch('Whitelabel Logo', 'whitelabelLogo', (enabled) => {
    updateLogo();
    console.log('Logo Updated:', enabled);
});
createSettingSwitch('Export All Customers Button', 'setting2', (enabled) => {
    addExportAllCustomersButton(enabled);
    console.log('Export Updated:', enabled);
});
createSettingSwitch('Enable Barcode Correction', 'setting3', (enabled) => {
    handleBarcodeInput(enabled);
    console.log('Barcode Updated:', enabled);
});

// Create a switch for the auto-password sign-in feature
createSettingSwitch('Auto-Password Sign-In', 'autoPasswordSignIn', (enabled) => {
    const autoSubmitEnabled = localStorage.getItem('autoSubmit') === 'true';
    handleAutoPasswordSignIn(enabled, autoSubmitEnabled);
    console.log('Auto-Password Sign-In Updated:', enabled);
});

// Create a switch for the auto-submit feature
createSettingSwitch('Auto-Submit', 'autoSubmit', (enabled) => {
    const autoPasswordSignInEnabled = localStorage.getItem('autoPasswordSignIn') === 'true';
    handleAutoPasswordSignIn(autoPasswordSignInEnabled, enabled);
    console.log('Auto-Submit Updated:', enabled);
});
// Create switches for various settings
createSettingSwitch('Hide Users', 'hideusers', (enabled) => {
    hideUsers();
    console.log('Hide Users Updated:', enabled);
});

    // Create setting link
createSettingLink('Lightspeed eCom (E-Series)', 'https://my.business.shop/store/86581584');

// Add styles for the settings title
const styleTitle = document.createElement('style');
styleTitle.textContent = `
.settings-title {
    font-weight: bold;
    padding: 8px;
    text-align: center;
}
`;
document.head.appendChild(styleTitle);

// Function to create a footer for the settings panel
function createSettingsFooter(versionNumber, authorName) {
    const footerContainer = document.createElement('li');
    const footer = document.createElement('div');
    footer.textContent = `Version ${versionNumber} by ${authorName}`;
    footer.classList.add('settings-footer'); // Add 'settings-footer' class
    footerContainer.appendChild(footer);
    settingsList.appendChild(footerContainer);
}

// Create the footer for the settings panel
createSettingsFooter('2.0', 'Tyler Hall Tech');

// Add styles for the settings footer
const styleFooter = document.createElement('style');
styleFooter.textContent = `
.settings-footer {
    font-size: 12px;
    padding: 8px;
    text-align: center;
    color: #888;
}
`;
document.head.appendChild(styleFooter);

// Toggle the visibility of the settings panel when the floating button is clicked
floatingButton.addEventListener('click', () => {
    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
});
})();
