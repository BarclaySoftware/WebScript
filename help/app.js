require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});

require(['vs/editor/editor.main'], function () {
    const editor = monaco.editor.create(document.getElementById('editor'), {
        value: [
            'console.log("Hello, World!");',
            '// Write your JavaScript code here and click "Run Code" to execute it.'
        ].join('\n'),
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true
    });

    // Initialize the jQuery Terminal
    const terminal = $('#terminal').terminal(function (command) {
        // if (command.trim() === 'help') {
        //     this.echo('Available commands: help, examples');
        // } else if (command.trim() === 'examples') {
        //     this.echo('Examples:\n' +
        //         '1. 2 + 2\n' +
        //         '2. true == false\n' +
        //         '3. var x = 5; x');
        // } else if (command.trim() === 'sigma') {
        //     // Handle empty command (Enter key press without command)
        //     this.echo('');
        // } else {
        //     // Execute command as JavaScript code
        //     try {
        //         const result = eval(command);
        //         this.echo(result);
        //     } catch (e) {
        //         this.error('Error: ' + e.message);
        //     }
        // }
    }, {
        greetings: 'JavaScript Playground Terminal',
        name: 'js_playground',
        prompt: '>',
        height: '100%',
        width: '100%',
        outputLimit: 5000,
        // onBlur: function () {
        //     this.focus(); // Keep focus on terminal
        // }
    });

    // Track all setTimeout and setInterval IDs
    let intervalIds = [];
    let timeoutIds = [];

    // Override setInterval and setTimeout to track IDs
    const originalSetInterval = window.setInterval;
    const originalSetTimeout = window.setTimeout;

    window.setInterval = function (callback, delay, ...args) {
        const id = originalSetInterval(callback, delay, ...args);
        intervalIds.push(id);
        return id;
    };

    window.setTimeout = function (callback, delay, ...args) {
        const id = originalSetTimeout(callback, delay, ...args);
        timeoutIds.push(id);
        return id;
    };

    // Function to clear all tracked intervals and timeouts
    function clearAllIntervalsAndTimeouts() {
        intervalIds.forEach(clearInterval);
        timeoutIds.forEach(clearTimeout);
        intervalIds = [];
        timeoutIds = [];
    }

    // Stop ongoing processes without clearing the terminal
    function stopProcesses() {
        clearAllIntervalsAndTimeouts();
    }

    // Redirect console methods to the terminal
    (function() {
        const originalLog = console.log;
        const originalInfo = console.info;
        const originalWarn = console.warn;
        const originalError = console.error;
        const originalAssert = console.assert;

        console.log = function(...args) {
            terminal.echo(args.join(' '));
            originalLog.apply(console, args);
        };

        console.info = function(...args) {
            terminal.echo(args.join(' '));
            originalInfo.apply(console, args);
        };

        console.warn = function(...args) {
            terminal.echo(`[[;orange;]${args.join(' ')}]`);
            originalWarn.apply(console, args);
        };

        console.error = function(...args) {
            terminal.error(args.join(' '));
            originalError.apply(console, args);
        };

        console.assert = function(assertion, ...args) {
            if (!assertion) {
                terminal.error(args.join(' '));
            }
            originalAssert.apply(console, [assertion, ...args]);
        };
    })();

    // Run code without clearing the terminal
    $('#run-button').click(function () {
        const code = editor.getValue();

        // Stop all ongoing processes before running new code
        clearAllIntervalsAndTimeouts();

        try {
            eval(code);
        } catch (e) {
            terminal.error(String(e));
        }
    });

    // Clear terminal
    $('#clear-button').click(function () {
        terminal.clear();
        // Stop all ongoing processes when clearing the terminal
        clearAllIntervalsAndTimeouts();
    });

    // Clear terminal and run code
    $('#clear-run-button').click(function () {
        terminal.clear();
        const code = editor.getValue();

        // Stop all ongoing processes before running new code
        clearAllIntervalsAndTimeouts();

        try {
            eval(code);
        } catch (e) {
            terminal.error(String(e));
        }
    });

    // Stop button to halt ongoing processes
    $('#stop-button').click(function () {
        stopProcesses();
    });
});
