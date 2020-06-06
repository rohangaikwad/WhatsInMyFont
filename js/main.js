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


function renderFont(font) {

    root.style.setProperty('--font-name', `"${font.names.wwsFamily.en}`);

    for (let i = 0; i < font.glyphNames.names.length; i++) {
        if (font.glyphs.glyphs[i].unicode != undefined) {
            let div = document.createElement('div');
            div.classList.add('glyph-item');

            let glyph = document.createElement('span');
            glyph.classList.add('glyph');
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