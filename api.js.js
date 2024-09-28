require.config({ paths: { 'vs': 'andorra/min/vs' } });
        require(['vs/editor/editor.main'], function () {
            const editor = monaco.editor.create(document.getElementById('editor'), {
                language: 'javascript',
                value: `console.log('Hello, World!');`,
                theme: 'hc-black',
                fontSize: 16,
                fontFamily: 'andorraMono, Gloobmoji, SeavoltUIEmoji, monospace',
                cursorStyle: 'block-outline',
                minimap: { enabled: true },
                lineNumbers: "on",
                wordWrap: "off",
                scrollBeyondLastLine: true,
                cursorSmoothCaretAnimation: 'on',
                automaticLayout: true,
                autoClosingComments: 'always',
                quickSuggestions: { other: true, comments: true, strings: true },
                parameterHints: { enabled: true },
                acceptSuggestionOnEnter: "on",
                tabCompletion: "on",
                autoSurround: 'brackets',
                colorDecoratorActivatedOn: 'clickAndHover',
                cursorSurroundingLinesStyle: 'default',
                experimentalWhitespaceRendering: 'font',
                foldingStrategy: 'indentation',
                matchBrackets: 'always',
                mouseStyle: 'copy',
                multiCursorModifier: 'alt',
                multiCursorPaste: 'spread',
                multiCursorLimit: 1000,
                occurrencesHighlight: 'singleFile',
                peekWidgetDefaultFocus: 'editor',
                renderFinalNewline: 'dimmed',
                renderLineHighlight: 'gutter',
                renderWhitespace: 'all',
                showFoldingControls: 'always',
                snippetSuggestions: 'bottom',
                suggestSelection: 'first',
                unusualLineTerminators: 'auto',
                wordBreak: 'normal',
                wrappingStrategy: 'advanced',
            });

            const font = new FontFace('andorraMono', 'url(https://andorraeditor.pages.dev/assets/fonts/SuttonMono.ttf)');

            font.load().then(() => {
                document.fonts.add(font);
                monaco.editor.remeasureFonts();
            }).catch((error) => {
                console.error('Error loading custom font:', error);
            });

            const runButton = $('#run-btn');
            const clearButton = $('#clear-btn');
            const clearRunButton = $('#clear-run-btn');
            const saveButton = $('#save-btn');
            const openFileButton = $('#open-file-btn');
            const fileInput = $('#file-input');
            const consoleOutput = $('#console');

            let isDirty = false; // Tracks if the editor content has changed

            const originalConsoleLog = console.log;
            console.log = function(...args) {
                args.forEach(arg => {
                    consoleOutput.append(`<div>> ${styleOutput(arg)}</div>`);
                });
            };

            console.error = function(...args) {
                args.forEach(arg => {
                    consoleOutput.append(`<div class="console-error">> ${styleOutput(arg)}</div>`);
                });
            };

            console.warn = function(...args) {
                args.forEach(arg => {
                    consoleOutput.append(`<div class="console-warn">> ${styleOutput(arg)}</div>`);
                });
            };

            function styleOutput(output) {
                if (typeof output === 'string') {
                    return `<span class="console-string">"${output}"</span>`;
                } else if (typeof output === 'number') {
                    return `<span class="console-number">${output}</span>`;
                } else if (typeof output === 'boolean') {
                    return `<span class="console-boolean">${output}</span>`;
                } else if (Array.isArray(output)) {
                    return `<span class="console-array">[${output.join(', ')}]</span>`;
                } else if (typeof output === 'object') {
                    return `<span class="console-object">${JSON.stringify(output, null, 2)}</span>`;
                } else if (output === undefined) {
                    return `<span class="console-undefined">undefined</span>`;
                } else if (output === null) {
                    return `<span class="console-null">null</span>`;
                }
                return output;
            }

            function runCode() {
                const userCode = editor.getValue();
                try {
                    // Execute code in a sandboxed environment
                    new Function(userCode)();
                } catch (error) {
                    console.error(`Error: ${error.message}`);
                }
            }

            runButton.on('click', function () {
                runCode();
            });

            clearButton.on('click', function () {
                consoleOutput.empty(); // Clear the console
            });

            clearRunButton.on('click', function () {
                consoleOutput.empty(); // Clear the console
                runCode();
            });

            saveButton.on('click', function () {
                const blob = new Blob([editor.getValue()], { type: 'text/javascript' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'script.js';
                a.click();
                URL.revokeObjectURL(url);
                isDirty = false; // Reset the dirty flag after saving
            });

            openFileButton.on('click', function () {
                fileInput.click();
            });

            fileInput.on('change', function (event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        editor.setValue(e.target.result);
                        isDirty = false; // Reset the dirty flag when a new file is loaded
                    };
                    reader.readAsText(file);
                }
            });

            editor.onDidChangeModelContent(() => {
                isDirty = true; // Mark as dirty if the content changes
            });

            window.addEventListener('beforeunload', function (event) {
                if (isDirty) {
                    const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave without saving?';
                    event.returnValue = confirmationMessage; // Gecko + WebKit, Safari, Chrome etc.
                    return confirmationMessage; // Gecko + WebKit, Safari, Chrome etc.
                }
            });
        });