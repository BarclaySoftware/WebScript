require.config({ paths: { 'vs': 'monaco-editor/min/vs' } });

require(['vs/editor/editor.main'], function () {
    const editor = monaco.editor.create(document.getElementById('editor'), {
        value: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello, Monaco Editor!</h1>\n</body>\n</html>',
        language: 'html',
        theme: 'vs-dark',
        automaticLayout: true,
        fontFamily: 'CustomFont'
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
