require.config({ paths: { 'vs': 'monaco-editor/min/vs' } });

require(['vs/editor/editor.main'], function () {
    monaco.editor.defineTheme('WebScript', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'identifier', foreground: '9cdcfe'},
            { token: 'operators', foreground: '000000' },
            { token: 'keyword', foreground: '569dda' },

            { token: 'string', foreground: 'd69d85' },
            { token: 'string.escape', foreground: 'd69d85' },

            { token: 'comment', foreground: '58a74a' },
            { token: 'comment.doc', foreground: '58a74a' },

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
            { token: 'tag', foreground: '579dd7' },

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
    var editor = monaco.editor.create(document.getElementById('editor'), {
        value: `<!--This is where your HTML, JavaScript, and CSS code goes.-->`,
        language: 'html',
        theme: 'WebScript',
        automaticLayout: true,
        fontSize: 16,
        fontFamily: 'CustomFont, TwemojiRubisco, Arial, Helvetica, sans-serif',
        scrollBeyondLastLine: true,
        minimap: { enabled: true },
        lineNumbers: "on",
        wordWrap: "off"
    });
    

    const preview = document.getElementById('preview');

    editor.onDidChangeModelContent(() => {
        const html = editor.getValue();
        preview.srcdoc = html;
    });

    // Load the custom font and remeasure fonts once it's loaded
    const font = new FontFace('CustomFont', 'url(https://andorraeditor.pages.dev/LaurentiaCode-Regular.ttf)');

    font.load().then(() => {
        document.fonts.add(font);
        monaco.editor.remeasureFonts();
    }).catch((error) => {
        console.error('Error loading custom font:', error);
    });
});
