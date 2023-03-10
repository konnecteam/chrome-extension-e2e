import Vue from 'vue'
import VueHighlightJS from 'vue-highlightjs'
import VueClipboard from 'vue-clipboard2'
import App from './components/App.vue'
import '../../assets/styles/style.scss'

Vue.config.productionTip = false
Vue.use(VueHighlightJS)
Vue.use(VueClipboard)

Vue.prototype.$chrome = chrome

/* eslint-disable no-new */
new Vue({
  el: '#root',
  render: h => h(App)
})

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