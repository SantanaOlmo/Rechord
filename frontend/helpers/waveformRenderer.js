export function drawWaveform(canvas, audioBuffer, zoomLevel) {
    if (!canvas || !audioBuffer) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const duration = audioBuffer.duration;
    const fullWidth = duration * zoomLevel;

    canvas.width = fullWidth * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${fullWidth}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, fullWidth, rect.height);
    ctx.fillStyle = '#4ade80';

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / fullWidth);
    const amp = rect.height / 2;

    for (let i = 0; i < fullWidth; i += 2) {
        let min = 1.0;
        let max = -1.0;
        for (let j = 0; j < step; j++) {
            const datum = data[(i * step) + j];
            if (datum < min) min = datum;
            if (datum > max) max = datum;
        }
        ctx.fillRect(i, (1 + min) * amp, 2, Math.max(1, (max - min) * amp));
    }
}
