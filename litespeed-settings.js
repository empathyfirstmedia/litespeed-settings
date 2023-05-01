// ==UserScript==
// @name LightSpeed / VendHQ Toolbox 2023
// @version 1.1
// @description Modifies the Lightspeed POS
// @encoding utf-8
// @author Tyler Hall Tech <tyler@tylerhalltech.com>
// @updateURL https://raw.githubusercontent.com/tyhallcsu/litespeed-settings/main/litespeed-settings.js
// @downloadURL https://raw.githubusercontent.com/tyhallcsu/litespeed-settings/main/litespeed-settings.js
// @namespace https://raw.githubusercontent.com/tyhallcsu/litespeed-settings/main/litespeed-settings.js
// @homepageURL https://tylerhalltech.com
// @match https://*.vendhq.com/*
// @match https://*.vendhq.com/register.php*
// @match https://*.merchantos.com/register.php*
// @match https://*.lightspeedapp.com/*
// @match https://*.lightspeedpos.com/*
// @match https://*.merchantos.com/*
// @match https://*.vendhq.com/*
// @grant unsafeWindow
// @grant GM_xmlhttpRequest
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   opera
// @compatible   safari
// @run-at       document-idle
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

// Define a variable for the maximum delay between characters (in milliseconds).
const maxCharacterDelay = 30;

// Define a variable to store the timer.
let timer = null;

// Define a variable to store the timestamp of the last keydown event.
let lastKeydownTimestamp = null;

// Define a function to handle keydown events.
const handleKeydown = (event) => {
    // Get the current timestamp.
    const currentTimestamp = Date.now();

    // If the last keydown event occurred within the maximum character delay, treat it as a barcode input.
    if (lastKeydownTimestamp && currentTimestamp - lastKeydownTimestamp <= maxCharacterDelay) {
        // Append the key pressed to the barcode input.
        barcodeInput += event.key;

        // Clear the previous timer if it exists.
        if (timer) {
            clearTimeout(timer);
        }

        // Set a new timer to process the barcode input after a short delay.
        timer = setTimeout(() => {
            // If the barcode input is not empty, process the barcode input.
            if (barcodeInput.length > 0) {
                // Find the search field on the webpage.
                const searchField = document.querySelector('input.vd-autocomplete-input');

                // If the search field is found, set its value to the barcode input.
                if (searchField) {
                    searchField.value = barcodeInput;

                    // Trigger an 'input' event on the search field to notify React.
                    const inputEvent = new Event('input', { bubbles: true });
                    searchField.dispatchEvent(inputEvent);

                    // Trigger a 'change' event on the search field to update the search results.
                    const changeEvent = new Event('change', { bubbles: true });
                    searchField.dispatchEvent(changeEvent);
                }
            }

            // Reset the barcode input and timer.
            barcodeInput = '';
            timer = null;
        }, maxCharacterDelay);
    }

    // Update the timestamp of the last keydown event.
    lastKeydownTimestamp = currentTimestamp;
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
    floatingButtonContainer.id = 'toolbox-container'; // Assign a unique ID to the container
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

  /* Media query for print media */
  @media print {
    /* Hide the toolbox when printing */
    #toolbox-container {
      display: none;
    #toolbox-label{
    display: none;
    }
    }
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
createSettingsFooter('1.1', 'Tyler Hall Tech');

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
