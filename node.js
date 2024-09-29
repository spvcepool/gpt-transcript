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

        // Process the AppleScript output (e.g., display it or use it in a web app)
        console.log('AppleScript Output:', data);

        // Split the data by the '[break_message_convo]' tag
        const messages = data.split('[break_message_convo]').map(message => message.trim()).filter(message => message.length > 0);

        // Log the split messages
        console.log('Split Messages:', messages);

        // Here, you could add your HTML/CSS/JavaScript logic to display the output.
        // Example: You could pass the output to a front-end web page or create a simple pop-up.
        // You can write the logic here to create your popup or UI as needed.

        // Example of handling the output in Node.js, or you could pass it to a web app
        // You can also use something like Electron.js to create a pop-up for better UI control
    });
}