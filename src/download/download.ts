/**
 * https://stackoverflow.com/questions/73348151/downloading-a-large-blob-to-local-file-in-manifestv3-service-worker
 * Workaround qui permet de télécharger un fichier dans une extension manifest V3 (Il y aura potentiellement des solutions plus simples dans un futur proche)
 */
navigator.serviceWorker.ready.then(swr => swr.active.postMessage('sendBlob'));
navigator.serviceWorker.onmessage = async e => {
  if (e.data.blob) {
    await chrome.downloads.download({
      url: URL.createObjectURL(e.data.blob),
      filename: e.data.name,
    });
  }
  if (e.data.close) {
    window.close();
  }
};