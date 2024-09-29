const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to save the AppleScript output
const outputFilePath = path.join(__dirname, 'gpt_transcript.txt');

// Step 1: Run AppleScript and save the output to a file
exec('osascript /path/to/your/gpt_script.applescript', (error, stdout, stderr) => {
    if (error) {
        console.error(`AppleScript execution error: ${error}`);
        return;
    }

    // Save the AppleScript output to a text file
    fs.writeFile(outputFilePath, stdout, (err) => {
        if (err) {
            console.error(`Error writing output file: ${err}`);
            return;
        }
        console.log('AppleScript output saved to gpt_transcript.txt');

        // Step 2: After saving, read and process the output with JavaScript
        processAppleScriptOutput();
    });
});

// Step 2: Function to process the AppleScript output
function processAppleScriptOutput() {
    fs.readFile(outputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading output file: ${err}`);
            return;
        }

        // Split the data by the '[break_message_convo]' tag
        const messages = data.split('[break_message_convo]')
            .map(message => message.trim())
            .filter(message => message.length > 0);

        // Format messages for display
        const formattedMessages = messages.map(message => {
            if (message.startsWith('[user_1_message]')) {
                return `<div class="message user">${message.replace('[user_1_message]', '').trim()}</div>`;
            } else if (message.startsWith('[gpt_1_message]')) {
                return `<div class="message gpt">${message.replace('[gpt_1_message]', '').trim()}</div>`;
            }
            return ''; // In case of an unrecognized format
        }).join('');

        // Load the HTML template
        displayPopup(formattedMessages);
    });
}

// Function to display the pop-up
function displayPopup(formattedMessages) {
    fs.readFile(path.join(__dirname, 'popup.html'), 'utf8', (err, htmlTemplate) => {
        if (err) {
            console.error(`Error reading popup HTML: ${err}`);
            return;
        }

        // Insert formatted messages into the HTML
        const populatedHTML = htmlTemplate.replace('<!-- Messages will be inserted here -->', formattedMessages);

        // Open the populated HTML in a new window/tab
        const popupWindow = window.open('', '_blank');
        popupWindow.document.write(populatedHTML);
        popupWindow.document.close(); // Necessary to finish writing the document
    });
}

// Call the processing function
processAppleScriptOutput();