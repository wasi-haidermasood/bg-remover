const fileInput = document.getElementById('file');
const browseBtn = document.getElementById('browse');
const dropZone = document.getElementById('drop');
const origImg = document.getElementById('orig');
const resultImg = document.getElementById('result');
const removeBtn = document.getElementById('remove');
const downloadLink = document.getElementById('download');
const msg = document.getElementById('msg');

function setMessage(text) {
  msg.textContent = text || '';
}

browseBtn.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag'));
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag');
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    fileInput.files = e.dataTransfer.files;
    onFileChange();
  }
});

fileInput.addEventListener('change', onFileChange);

function onFileChange() {
  const file = fileInput.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  origImg.src = url;
  resultImg.src = '';
  downloadLink.classList.add('hidden');
  removeBtn.disabled = false;
  setMessage('Ready to remove background.');
}

removeBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) return alert('Please choose an image first.');

  removeBtn.disabled = true;
  setMessage('Processing… This may take a few seconds.');

  const form = new FormData();
  form.append('image_file', file);

  try {
    const res = await fetch('/api/removebg', { method: 'POST', body: form });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || 'API error');
    }
    const blob = await res.blob();
    const outUrl = URL.createObjectURL(blob);
    resultImg.src = outUrl;
    downloadLink.href = outUrl;
    downloadLink.classList.remove('hidden');
    setMessage('Done! Click Download to save the PNG.');
  } catch (err) {
    console.error(err);
    setMessage('Error: ' + err.message);
    alert('Error: ' + err.message);
  } finally {
    removeBtn.disabled = false;
  }
});
