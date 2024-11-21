// overlayの準備
const overlay = document.createElement('div');
overlay.id = 'overlay';
overlay.style.position = 'absolute';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100vw';
overlay.style.height = '100vh';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
overlay.style.zIndex = '1000';
overlay.style.display = 'none';
document.body.appendChild(overlay);

let startX, startY, endX, endY, selection;

// 領域選択のマウスイベント
document.addEventListener('mousedown', (e) => {
  overlay.style.display = 'block';
  startX = e.clientX;
  startY = e.clientY;

  selection = document.createElement('div');
  selection.style.position = 'absolute';
  selection.style.border = '2px dashed red';
  selection.style.background = 'rgba(255, 0, 0, 0.2)';
  selection.style.left = `${startX}px`;
  selection.style.top = `${startY}px`;
  selection.style.zIndex = '1001';
  overlay.appendChild(selection);
});

document.addEventListener('mousemove', (e) => {
  if (!selection) return;

  endX = e.clientX;
  endY = e.clientY;

  selection.style.width = `${Math.abs(endX - startX)}px`;
  selection.style.height = `${Math.abs(endY - startY)}px`;

  if (endX < startX) {
    selection.style.left = `${endX}px`;
  }
  if (endY < startY) {
    selection.style.top = `${endY}px`;
  }
});

document.addEventListener('mouseup', () => {
  if (!selection) return;

  const x = parseInt(selection.style.left, 10);
  const y = parseInt(selection.style.top, 10);
  const width = parseInt(selection.style.width, 10);
  const height = parseInt(selection.style.height, 10);

  overlay.style.display = 'none';
  html2canvas(document.body, { x, y, width, height }).then((canvas) => {
    const imageData = canvas.toDataURL();

    // OCR実行
    Tesseract.recognize(imageData, 'eng').then(({ data: { text } }) => {
      console.log('OCR結果:', text);
      alert(`OCR結果: ${text}`);
    });
  });

  // 選択領域の削除
  overlay.removeChild(selection);
  selection = null;
});
