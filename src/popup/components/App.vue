<template>
  <div id="puppeteer-recorder" class="recorder">
    <div class="header">
      <a href="#" @click="goHome">
       Extension Chrome e2e  <span class="text-muted"><small>{{version}}</small></span>
      </a>
      <div class="left">
        <div class="recording-badge" v-show="isRecording">
          <span class="red-dot"></span>
          {{recordingBadgeText}}
        </div>
         <div class="recording-badge" v-show="!isRecording && !isResult && showResultsTab">
          <span class="red-dot"></span>
          {{messageToWait}}
        </div>
        <div class="recording-badge" v-show="errorMessage">
          <span class="red-dot"></span>
          {{errorMessage}}
        </div>
        <a href="#" @click="toggleShowHelp" class="header-button">
          <img src="/assets/images/help.svg" alt="help" width="18px">
        </a>
        <a href="#" @click="openOptions" class="header-button">
          <img src="/assets/images/settings.svg" alt="settings" width="18px">
        </a>
      </div>
    </div>
    <div class="main">
      <div class="tabs" v-show="!showHelp">
        <RecordingTab :code="code" :is-recording="isRecording" :live-events="liveEvents" v-show="!showResultsTab"/>
        <div class="recording-footer" v-show="!showResultsTab">
          <button class="btn btn-sm" @click="toggleRecord" :class="isRecording ? 'btn-danger' : 'btn-primary'">
            {{recordButtonText}}
          </button>
          <button class="btn btn-sm btn-primary btn-outline-primary" @click="togglePause" v-show="isRecording">
            {{pauseButtonText}}
          </button>
          <a href="#" @click="showResultsTab = true" v-show="code">view code</a>
        </div>
        <ResultsTab :code="code" :copy-link-text="copyLinkText" :restart="restart" :set-copying="setCopying" v-show="showResultsTab"/>
        <div class="results-footer" v-show="showResultsTab">
          <button class="btn btn-sm" :class="[isRemovedListener || loadingPage ? 'btn-primary' : 'btn-disabled']" :disabled="!(isRemovedListener || loadingPage)" @click="restart" v-show="code">Restart</button>
          <button class="btn btn-sm" :class="[isResult ? 'btn-primary' : 'btn-disabled']" :disabled="!isResult" @click="exportScript" v-show="!isExport" type="button">Export script</button>
          <progress max="100" :value="loaderValue" v-show="isExport">{{this.loaderValue}}% </progress>
          <a href="#" v-clipboard:copy='code' @click="setCopying" v-show="code">{{copyLinkText}}</a>
        </div>
      </div>
      <HelpTab v-show="showHelp"></HelpTab>
    </div>
  </div>
</template>

<script>
  import { version } from '../../../package.json'
  import CodeGenerator from '../../code-generator/code-generator'
  import RecordingTab from "./RecordingTab.vue"
  import ResultsTab from "./ResultsTab.vue";
  import HelpTab from "./HelpTab.vue";
  import { EControlAction } from '../../enum/action/control-actions'
  
  export default {
    name: 'App',
    components: { ResultsTab, RecordingTab, HelpTab },
    data () {
      return {
        code: '',
        loaderValue: 0,
        showResultsTab: false,
        showHelp: false,
        isExport:false,
        liveEvents: [],
        recording: [],
        isRecording: false,
        isPaused: false,
        isCopying: false,
        isResult : false,
        isRemovedListener: false,
        loadingPage: false,
        errorMessage : '',
        bus: null,
        version
      }
    },
    mounted () {
      this.loadState(() => {
        if (this.isRecording) {
          this.$chrome.storage.local.get(['recording', 'code'], ({ recording }) => {
            this.liveEvents = recording;
          })
        }

        if (!this.isRecording && this.code) {
          this.showResultsTab = true;
        }
      })

      this.bus = this.$chrome.extension.connect({ name: 'recordControls' });

      // On écoute les message pour savoir si le scénario a été exporté
      chrome.runtime.onMessage.addListener(this.handleMessage);

      // On écoute le changement de certaine variable pour mettre à jour l'interface
      this.$chrome.storage.onChanged.addListener((changes, namespace) => {

        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {

          switch (key) {
            case 'isResult' :
              this.isResult = newValue;
              break;
            case 'loadingPage' :
              this.loadingPage = newValue;
              break;
            case 'isRemovedListener' :
              this.isRemovedListener = newValue;
              break
            case 'errorMessage' :
              this.errorMessage = newValue;
            default:
              break;
          }
        }
      });
    },
    methods: {
      //handleMessage permet d'écouter les messages et savoir si le scénario a été exporté
       handleMessage(request, sender, sendResponse) {

        if (request.valueLoad){
          this.loaderValue = request.valueLoad;
          
          if (this.loaderValue === 100){
            this.isExport = false;
          }
        }
      },
      toggleRecord () {
        
        if (this.isRecording) {
          this.stop();
        } else {
          this.start();
        }
        this.isRecording = !this.isRecording;
        this.storeState();
      },
      togglePause () {

        if (this.isPaused) {
          this.bus.postMessage({ action: EControlAction.UNPAUSE });
          this.isPaused = false;
        } else {
          this.bus.postMessage({ action: EControlAction.PAUSE });
          this.isPaused = true;
        }
        this.storeState();
      },
      start () {
        this.cleanUp()
        // On récupère la date au moment de commencer le record
        this.$chrome.storage.local.set({ dateTimeStart : new Date().getTime() });
        this.bus.postMessage({ action: EControlAction.START });
      },
      stop () {
        this.bus.postMessage({ action: EControlAction.STOP });
        this.$chrome.storage.local.get(['recording', 'options'], ({ recording, options }) => {

          this.recording = recording;
          const codeOptions = options ? options : {};

          const codeGen = new CodeGenerator(codeOptions);
          this.code = codeGen.generate(this.recording);
          this.showResultsTab = true;
          this.storeState();
        })
      },
      restart () {
        // si on a remove ou si on reload la page alors on peut restart le programme
        if (this.isRemovedListener || this.loadingPage) {
            this.cleanUp();
            this.bus.postMessage({ action: EControlAction.CLEANUP });
        } else {
            alert('We must waiting for recording to be stopped before restart process');
        }
    
      },
      cleanUp () {
        this.recording = this.liveEvents = [];
        this.code = '';
        this.showResultsTab = this.isRecording = this.isPaused = this.isResult = false;
        this.storeState();
      },
      openOptions () {
        if (this.$chrome.runtime.openOptionsPage) {
          this.$chrome.runtime.openOptionsPage();
        }
      },
      loadState (cb) {
        this.$chrome.storage.local.get(['controls', 'code', 'isResult', 'isRemovedListener', 'loadingPage', 'errorMessage'],
         ({ controls, code, isResult, isRemovedListener, loadingPage, errorMessage }) => {
        
          // On récupère les informations lié à l'enregistrement

          if (controls) {
            this.isRecording = controls.isRecording;
            this.isPaused = controls.isPaused;
          }

          if (code) {
            this.code = code;
          }

          if (isResult) {
            this.isResult = isResult;
          }

          if(isRemovedListener) {
            this.isRemovedListener = isRemovedListener;
          }

          if(loadingPage) {
            this.loadingPage = loadingPage;
          }
          
          if(errorMessage) {
            this.errorMessage = errorMessage;
          }

          cb();
        })
      },
      storeState () {
        this.$chrome.storage.local.set({
          code: this.code,
          controls: {
            isRecording: this.isRecording,
            isPaused: this.isPaused
          }
        })
      },
      setCopying () {
        this.isCopying = true;
        setTimeout(() => { this.isCopying = false }, 1500);
      },
      goHome () {
        this.showResultsTab = false;
        this.showHelp = false;
      },
      toggleShowHelp () {
        this.showHelp = !this.showHelp;
      },
      exportScript () {
        this.bus.postMessage({ action: EControlAction.EXPORT_SCRIPT });
        //Scénario exporté
        this.isExport=true;
      }
    }, 
    computed: {
      recordingBadgeText () {
        return this.isPaused ? 'paused' : 'recording';
      },
      recordButtonText () {
        return this.isRecording ? 'Stop' : 'Record';
      },
      pauseButtonText () {
        return this.isPaused ? 'Resume' : 'Pause';
      },
      copyLinkText () {
        return this.isCopying ? 'copied!' : 'copy to clipboard';
      },
      messageToWait () {
        return this.isResult ? '' : 'please wait the scenario is under construction...';
      }
    }
}

</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/_animations.scss";
  @import "../../../assets/styles/_variables.scss";
  @import "../../../assets/styles/_mixins.scss";

  .recorder {
    font-size: 14px;

    .header {
      @include header();

      a {
        color: $gray-dark;
      }

      .left {
        margin-left: auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .recording-badge {
          color: $brand-danger;
          .red-dot {
            height: 9px;
            width: 9px;
            background-color: $brand-danger;
            border-radius: 50%;
            display: inline-block;
            margin-right: .4rem;
            vertical-align: middle;
            position: relative;
          }
        }

        .header-button {
          margin-left: $spacer;
          img {
            vertical-align: middle;
          }
        }
      }
    }

    .recording-footer {
      @include footer()
    }
    .results-footer {
      @include footer()
    }
  }
</style>