const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Path to save the AppleScript output
const outputFilePath = path.join(__dirname, 'gpt_transcript.txt');

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for the root URL
app.get('/', (req, res) => {
    res.redirect('/popup'); // Redirect to the /popup route
});

// Function to process the AppleScript output
function processAppleScriptOutput(callback) {
    fs.readFile(outputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading output file: ${err}`);
            return callback(err, null);
        }

        const messages = data.split('[break_message_convo]')
            .map(message => message.trim())
            .filter(message => message.length > 0);

        const formattedMessages = messages.map(message => {
            if (message.startsWith('[user_1_message]')) {
                return `<div class="message user">${message.replace('[user_1_message]', '').trim()}</div>`;
            } else if (message.startsWith('[gpt_1_message]')) {
                return `<div class="message gpt">${message.replace('[gpt_1_message]', '').trim()}</div>`;
            }
            return ''; // In case of an unrecognized format
        }).join('');

        callback(null, formattedMessages); // Call the callback with formatted messages
    });
}

// Route to serve the popup HTML
app.get('/popup', (req, res) => {
    processAppleScriptOutput((err, formattedMessages) => {
        if (err) {
            return res.status(500).send('Error processing messages.');
        }

        fs.readFile(path.join(__dirname, 'popup.html'), 'utf8', (err, htmlTemplate) => {
            if (err) {
                console.error(`Error reading popup HTML: ${err}`);
                return res.status(500).send('Error loading popup.');
            }

            const populatedHTML = htmlTemplate.replace('<!-- Messages will be inserted here -->', formattedMessages);
            res.send(populatedHTML); // Send the populated HTML
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
