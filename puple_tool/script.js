
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
document.getElementById('copy').addEventListener('click', () => {
    const answerText = document.getElementById('answer').innerText;
    navigator.clipboard.writeText(answerText).then(() => {
        console.log('Text copied to clipboard');
        showTooltip('Text copied!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});
function showTooltip(message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerText = message;
    document.body.appendChild(tooltip);

    const copyButton = document.getElementById('copy');
    const buttonRect = copyButton.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    tooltip.style.position = 'absolute';
    tooltip.style.left = `${buttonRect.left + (buttonRect.width / 2) - (tooltipRect.width / 2)}px`;
    tooltip.style.top = `${buttonRect.top - tooltipRect.height - 10}px`;
    tooltip.style.backgroundColor = 'gray';
    tooltip.style.color = 'white';
    tooltip.style.padding = '2px 2px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.boxShadow = '0 2px 5px rgba(57, 55, 55, 0.48)';
    tooltip.style.zIndex = '1000';

    setTimeout(() => {
        tooltip.remove();
    }, 1000);
}
