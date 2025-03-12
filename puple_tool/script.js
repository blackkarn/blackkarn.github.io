
document.querySelector('input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const inputText = document.querySelector('input').value;
        const separatedText = separateKorean(inputText);
        const sortedText = separatedText.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0));
        document.getElementById('answer').innerText = sortedText.join('');
    }
});

function separateKorean(text) {
    const initial = [0x3131, 0x3132, 0x3134, 0x3137, 0x3138, 0x3139, 0x3141, 0x3142, 0x3143, 0x3145, 0x3146, 0x3147, 0x3148, 0x3149, 0x314a, 0x314b, 0x314c, 0x314d, 0x314e];
    const medial = [0x314f, 0x3150, 0x3151, 0x3152, 0x3153, 0x3154, 0x3155, 0x3156, 0x3157, 0x3158, 0x3159, 0x315a, 0x315b, 0x315c, 0x315d, 0x315e, 0x315f, 0x3160, 0x3161, 0x3162, 0x3163];
    const final = [0x0000, 0x3131, 0x3132, 0x3133, 0x3134, 0x3135, 0x3136, 0x3137, 0x3139, 0x313a, 0x313b, 0x313c, 0x313d, 0x313e, 0x313f, 0x3140, 0x3141, 0x3142, 0x3144, 0x3145, 0x3146, 0x3147, 0x3148, 0x314a, 0x314b, 0x314c, 0x314d, 0x314e];

    const result = [];
    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        if (code >= 0xac00 && code <= 0xd7a3) {
            const base = code - 0xac00;
            const finalIndex = base % 28;
            const medialIndex = ((base - finalIndex) / 28) % 21;
            const initialIndex = (((base - finalIndex) / 28) - medialIndex) / 21;
            result.push(String.fromCharCode(initial[initialIndex]));
            result.push(String.fromCharCode(medial[medialIndex]));
            if (final[finalIndex] !== 0x0000) {
                result.push(String.fromCharCode(final[finalIndex]));
            }
        } else {
            result.push(text[i]);
        }
    }
    return result;
}