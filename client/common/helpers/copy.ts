export const copy = (content: string) => {
    const copyDiv = document.createElement('input');
    copyDiv.value = content;
    copyDiv.style.position = 'fixed';
    copyDiv.style.pointerEvents = 'none';
    copyDiv.style.opacity = '0';
    document.body.appendChild(copyDiv);
    copyDiv.select();
    copyDiv.setSelectionRange(0, 999999);
    document.execCommand('copy');
    document.body.removeChild(copyDiv);
};
