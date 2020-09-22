let container = document.querySelector('.container');



var font = null;
var root = document.documentElement;
var size = 100;

document.getElementById('file').addEventListener('change', (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        try {
            font = opentype.parse(e.target.result);
            renderFont(font);
            readAsBase64(file, font);
            console.log(font);
        } catch (err) {
            showErrorMessage(err.toString());
        }
    };
    reader.onerror = function (err) {
        showErrorMessage(err.toString());
    };
    reader.readAsArrayBuffer(file);
}, false);

function readAsBase64 (file, font) {
    let base64reader = new FileReader();
    base64reader.onload = function (e) {
        generateFontFace(file, font, base64reader.result)
    };
    base64reader.onerror = function (err) {
        showErrorMessage(err.toString());
    };
    base64reader.readAsDataURL(file);
}

function generateFontFace(file, font, base64String) {
    base64String = base64String.split('base64,')[1];
    let ext = file.name.split('.').pop();
    let mimeTypes = {
        ttf: 'font/ttf',
        otf: 'font/otf',
        woff: 'font/woff',
        woff2: 'font/woff2',
        eot: 'application/vnd.ms-fontobject',
        svg: 'image/svg+xml'
    }
    
    let fontFace = `@font-face {
        font-family: '${font.names.fontFamily.en}';
        src: url(data:${mimeTypes[ext]};charset=utf-8;base64,${base64String}) format('truetype');
    }`;

    document.querySelector('#fontstyle').innerHTML = fontFace;
}

function showErrorMessage(message) {
    var el = document.getElementById('message');
    if (!message || message.trim().length === 0) {
        el.style.display = 'none';
    } else {
        el.style.display = 'block';
    }
    el.innerHTML = message;
}

function renderFont(font) {

    root.style.setProperty('--font-name', `"${font.names.fontFamily.en}`);

    for (let i = 0; i < font.glyphNames.names.length; i++) {
        if (font.glyphs.glyphs[i].unicode != undefined) {
            let div = document.createElement('div');
            div.classList.add('glyph-item');

            let glyph = document.createElement('span');
            glyph.classList.add('glyph');
            glyph.setAttribute('data-glyph-unicode', font.glyphs.glyphs[i].unicode);
            glyph.innerHTML = `&#${font.glyphs.glyphs[i].unicode};`
            div.appendChild(glyph);

            let name = document.createElement('span');
            name.classList.add('name');
            name.innerHTML = font.glyphNames.names[i];
            div.appendChild(name);

            container.appendChild(div);
        }
    }
}

document.getElementById('size').addEventListener('change', (e) => {
    root.style.setProperty('--icon-sz', `${e.target.value}px`);
}, false);

document.addEventListener('keyup', (e) => {
    if(e.which == 219) {
        size = size - 4;
        root.style.setProperty('--icon-sz', `${size}px`);
    }

    if(e.which == 221) {
        size = size + 4;
        root.style.setProperty('--icon-sz', `${size}px`);
    }
})