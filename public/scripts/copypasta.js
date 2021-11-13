document.addEventListener('copy', function(e) {
    let text_only = document.getSelection().toString();
    let clipdata = e.clipboardData || window.clipboardData;  
    clipdata.setData('text/plain', text_only);
    clipdata.setData('text/html', text_only);
    e.preventDefault();
});