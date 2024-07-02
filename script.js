var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/html");
editor.setOptions({
    fontSize: "16px",
    fontFamily: 'Courier Now AT',
    wrap: false,
    showPrintMargin: false,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true
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
            document.title = file.name + " - WebScript";
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

document.getElementById('openButton').addEventListener('click', openFile);
document.getElementById('saveButton').addEventListener('click', saveFile);

var isModified = false;

editor.session.on('change', function() {
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
    var value = this.value === 'on';
    editor.setOption('wrap', value);
});

window.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveFile();
    } else if (event.ctrlKey && event.key === 'o') {
        event.preventDefault();
        openFile();
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
        editor.resize();
    }
});

document.addEventListener('mouseup', function() {
    if (isResizing) {
        isResizing = false;
        document.body.style.cursor = 'default';
    }
});

updatePreview();