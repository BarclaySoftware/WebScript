require.config({ paths: { 'vs': 'https://cdn360.pages.dev/library/andorra/min/vs' } });
require(['vs/editor/editor.main'], function () {
    andorra.editor.defineTheme('WebScript', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'identifier', foreground: '9cdcfe' },
            { token: 'operators', foreground: '000000' },
            { token: 'keyword', foreground: '569dda' },
            { token: 'string', foreground: 'd69d85' },
            { token: 'string.escape', foreground: 'd69d85' },
            { token: 'comment', foreground: '58a74a', fontStyle: 'italic' },
            { token: 'comment.doc', foreground: '58a74a', fontStyle: 'italic' },
            { token: 'constant', foreground: '000000' },
            { token: 'delimiter.curly', foreground: 'd8a0e1' },
            { token: 'delimiter.square', foreground: 'd8a0e1' },
            { token: 'delimiter.parenthesis', foreground: 'd8a0e1' },
            { token: 'delimiter.angle', foreground: 'd8a0e1' },
            { token: 'delimiter.array', foreground: 'd8a0e1' },
            { token: 'delimiter.bracket', foreground: 'd8a0e1' },
            { token: 'number.hex', foreground: 'dfddaa' },
            { token: 'number.octal', foreground: 'dfddaa' },
            { token: 'number.binary', foreground: 'dfddaa' },
            { token: 'number.float', foreground: 'dfddaa' },
            { token: 'variable.name', foreground: '4ecab0' },
            { token: 'variable.value', foreground: '9cdcfe' },
            { token: 'entity', foreground: '000000' },
            { token: 'tag', foreground: '579dd7', fontStyle: 'bold' },
            { token: 'info-token', foreground: '9ce582' },
            { token: 'warn-token', foreground: 'fff2aa' },
            { token: 'error-token', foreground: 'ff3f37' },
            { token: 'debug-token', foreground: '000000' },
            { token: 'regexp', foreground: 'dfddaa' },
            { token: 'attribute', foreground: '000000' },
            { token: 'constructor', foreground: '000000' },
            { token: 'namespace', foreground: '000000' },
            { token: 'type', foreground: '4ecab0' },
            { token: 'predefined', foreground: '000000' },
            { token: 'invalid', foreground: '000000' },
        ],
        colors: {
            'editor.foreground': '#dcdcdc',
            'editor.background': '#1e1e1e',
            'editorCursor.foreground': '#e7e7e7',
            'editor.lineHighlightBackground': '#2e2e2e',
            'editorLineNumber.foreground': '#8a8a8a',
            'editor.selectionBackground': '#264f78',
            'minimap.background': '#1e1e1e',
            'minimap.foreground': '#121212'
        }
    });
    
    var editor = andorra.editor.create(document.getElementById('editor'), {
        value: `<!--This is where your HTML, JavaScript, and CSS code goes.-->`,
        language: 'html',
        theme: 'WebScript',
        automaticLayout: true,
        fontSize: 16,
        fontFamily: `'Laurentia Code', 'RubiscoEmojiColor', monospace`,
        scrollBeyondLastLine: true,
        minimap: { enabled: true },
        lineNumbers: 'on',
        wordWrap: 'off',
        suggestOnTriggerCharacters: true,
        quickSuggestions: { other: true, comments: true, strings: true },
        parameterHints: { enabled: true },
        acceptSuggestionOnEnter: 'on',
        tabCompletion: 'on',
        cursorSmoothCaretAnimation: 'on',
        snippetSuggestions: 'bottom',
        autoClosingComments: 'always',
        matchBrackets: 'always',
        multiCursorModifier: 'alt',
        multiCursorPaste: 'full',
        showFoldingControls: 'mouseover',
        suggestSelection: 'first',
        unusualLineTerminators: 'prompt',
        cursorStyle: 'line',
        autoSurround: 'brackets',
        colorDecoratorActivatedOn: 'clickAndHover',
        cursorSurroundingLinesStyle: 'default',
        experimentalWhitespaceRendering: 'font',
        foldingStrategy: 'indentation',
        // mouseStyle: 'copy',
        multiCursorLimit: 1000,
        occurrencesHighlight: 'singleFile',
        peekWidgetDefaultFocus: 'editor',
        // renderFinalNewline: 'dimmed',
        renderLineHighlight: 'gutter',
        renderWhitespace: 'selection',
        wordBreak: 'normal',
        wrappingStrategy: 'advanced',

        
    });

    editor.onDidChangeModelContent(() => {
        const html = editor.getValue();
        preview.srcdoc = html;
    });

    const font = new FontFace('andorraMono', 'url(https://webscript.pages.dev/LaurentiaCode-VF.ttf)');

    font.load().then(() => {
        // document.fonts.add(font);
        andorra.editor.remeasureFonts();
    }).catch((error) => {
        console.error('Error loading custom font:', error);
    });

    function openFile() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'text/html';
        input.onchange = function(event) {
            var file = event.target.files[0];
            var reader = new FileReader();
            reader.onload = function() {
                editor.setValue(reader.result);
                document.title = file.name;
                updatePreview();
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function saveFile() {
        var content = editor.getValue();
        var blob = new Blob([content], { type: 'text/html' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        var currentDate = new Date().toISOString().slice(0, 19).replace(/[-T:/]/g, '');
        var fileName = 'html_' + currentDate + '.html';
        a.download = fileName;
        document.title = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        isModified = false;
    }

    function saveDump() {
        var content = editor.getValue();
        var blob = new Blob([content], { type: 'text/' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        var currentDate = new Date().toISOString().slice(0, 19).replace(/[-T:/]/g, '');
        var fileName = 'savedump_' + currentDate + '.dt';
        a.download = fileName;
        document.title = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        isModified = false;
    }

    document.getElementById('openButton').addEventListener('click', openFile);
    document.getElementById('saveButton').addEventListener('click', saveFile);
    document.getElementById('saveDump').addEventListener('click', saveDump);

    var isModified = false;

    editor.onDidChangeModelContent(function() {
        isModified = true;
        var fileName = document.title;
        if (!fileName.endsWith('*')) {
            fileName += "*";
        }
        document.title = fileName;
        updatePreview();
    });

    function updatePreview() {
        var preview = document.getElementById('preview');
        preview.srcdoc = editor.getValue();
    }

    window.addEventListener('beforeunload', function(e) {
        if (isModified) {
            var confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
            e.returnValue = confirmationMessage;
            return confirmationMessage;
        }
    });

    document.getElementById('lineWrapSelect').addEventListener('change', function() {
        var value = this.value;
        editor.updateOptions({ wordWrap: value });
    });

    document.getElementById('minimapSelect').addEventListener('change', function() {
        var value = this.value;
        editor.updateOptions({ minimap: { enabled: value === 'on' } });
    });

    window.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            saveFile();
        } else if (event.ctrlKey && event.key === 'o') {
            event.preventDefault();
            openFile();
        } else if (event.altKey && event.key === 'm') {
            event.preventDefault();
            var minimapEnabled = editor.getOption(andorra.editor.EditorOption.minimap).enabled;
            editor.updateOptions({ minimap: { enabled: !minimapEnabled } });
            document.getElementById('minimapSelect').value = minimapEnabled ? 'off' : 'on';
        } else if (event.altKey && event.key === 'z') {
            event.preventDefault();
            var wordWrapEnabled = editor.getOption(andorra.editor.EditorOption.wordWrap) === 'on';
            editor.updateOptions({ wordWrap: wordWrapEnabled ? 'off' : 'on' });
            document.getElementById('lineWrapSelect').value = wordWrapEnabled ? 'off' : 'on';
        }
    });

    var divider = document.getElementById('divider');
    var editorContainer = document.getElementById('editor-container');
    var editorElement = document.getElementById('editor');
    var isResizing = false;

    divider.addEventListener('mousedown', function(e) {
        isResizing = true;
        document.body.style.cursor = 'ew-resize';
    });

    document.addEventListener('mousemove', function(e) {
        if (isResizing) {
            var offsetRight = editorContainer.clientWidth - (e.clientX - editorContainer.offsetLeft);
            var editorWidth = editorContainer.clientWidth - offsetRight;
            editorWidth = Math.max(editorWidth, 100);
            editorElement.style.width = editorWidth + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = 'default';
        }
    });
});
updatePreview();