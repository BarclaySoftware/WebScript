document.getElementById('generateButton').addEventListener('click', function() {
    const codeInput = document.getElementById('codeInput').value;

    // Encode the code to be URL-safe
    const encodedCode = encodeURIComponent(codeInput);

    // Generate the full URL with the encoded code
    const baseUrl = window.location.href.split('?')[0]; // Get the base URL
    const fullUrl = `https://andorraeditor.pages.dev/examples?code=${encodedCode}`;

    // Display the generated URL
    document.getElementById('outputUrl').value = fullUrl;
});

document.getElementById('copyButton').addEventListener('click', function() {
    const outputUrl = document.getElementById('outputUrl');
    outputUrl.select();
    document.execCommand('copy');
    alert('URL copied to clipboard!');
});
