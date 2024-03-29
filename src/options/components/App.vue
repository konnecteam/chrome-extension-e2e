<template>
  <div class="options">
    <div class="container">
      <div class="header">
        Puppeteer Recorder Options
        <small class="saving-badge text-muted" v-show="saving">
          Saving...
        </small>
      </div>
      <div class="content" v-if="!loading">
        <div class="settings-block">
          <h4 class="settings-block-title">Code Recorder settings</h4>
          <div class="settings-block-main">
            <div class="settings-group">
              <label class="settings-label">custom attribute(s) (separate with spaces)</label>
              <input
                id="options-code-dataAttribute"
                type="text"
                v-model="options.dataAttribute"
                @keydown="debounceKeydown"
                placeholder="your custom data-* attribute"
              />
              <small
                >Define a <code>data-*</code> attribute(s) that we'll attempt to
                use when selecting the elements. This is handy when React or Vue
                based apps generate random class names.
              </small>
            </div>
            <div class="settings-group">
              <label>
                <input
                  id="options-code-useRegexForDataAttribute"
                  type="checkbox"
                  v-model="options.useRegexForDataAttribute"
                  @change="save"
                />
                Use regular expression <code>Regex</code> for each custom
                attribute. 
              </label><br />
              <small>Example : <code>^id$ ^[a-z]\.bind$</code></small>
            </div>
            <div class="settings-group">
              <label class="settings-label">HTTP request filter</label>
              <input
                id="options-code-regexhttpRequest"
                type="text"
                v-model="options.regexHTTPrequest"
                @keydown="debounceKeydown"
                placeholder="Exemple : /.*localhost.*token.*/gm"
              />
              <small
                >Use regex to filter http request that you wouldn't
                record
              </small>
            </div>
            <div class="settings-group">
              <label>
                <input
                  id="options-code-recordHTTPrequest"
                  type="checkbox"
                  v-model="options.recordHttpRequest"
                  @change="save"
                />
                use record HTTP request
              </label>
            </div>
            <div class="settings-group">
              <label>
                <input
                  id="options-code-deleteSiteData"
                  type="checkbox"
                  v-model="options.deleteSiteData"
                  @change="save"
                />
                delete site data
              </label>
            </div>
          </div>
        </div>
        <div class="settings-block">
          <h4 class="settings-block-title">Code Generator settings</h4>
          <div class="settings-block-main">
            <div class="settings-group">
              <label>
                <input
                  id="options-code-wrapAsync"
                  type="checkbox"
                  v-model="options.wrapAsync"
                  @change="save"
                />
                wrap code in async function
              </label>
            </div>
            <div class="settings-group">
              <label>
                <input
                  id="options-code-headless"
                  type="checkbox"
                  v-model="options.headless"
                  @change="save"
                />
                set <code>headless</code> in puppeteer launch options
              </label>
            </div>
            <div class="settings-group">
              <label>
                <input
                  id="options-code-waitForNavigation"
                  type="checkbox"
                  v-model="options.waitForNavigation"
                  @change="save"
                />
                add <code>waitForNavigation</code> lines on navigation
              </label>
            </div>
            <div class="settings-group">
              <label>
                <input
                  id="options-code-blankLinesBetweenBlocks"
                  type="checkbox"
                  v-model="options.blankLinesBetweenBlocks"
                  @change="save"
                />
                add blank lines between code blocks
              </label>
            </div>
            <div class="settings-group">
              <label>
                <input
                  id="options-code-waitForSelectorOnClick"
                  type="checkbox"
                  v-model="options.waitForSelectorOnClick"
                  @change="save"
                />
                add <code>waitForSelector</code> lines before every
                <code>page.click()</code>
              </label>
            </div>
            <div class="settings-group">
              <label class="settings-label">add custom lines after every <code>page.click()</code></label>
              <input
                id="options-code-customLineAfterClick"
                type="text"
                v-model="options.customLineAfterClick"
                @keydown="debounceKeydown"
              />
            </div>
            <div class="settings-group">
              <label class="settings-label">add custom lines before every <code>Event</code></label>
              <textarea
                id="options-code-customLineAfterClick"
                rows="7"
                cols="70"
                v-model="options.customLinesBeforeEvent"
                @keydown="debounceKeydown"
              />
            </div>
          </div>
        </div>
        <div class="settings-block">
          <h4 class="settings-block-title">Import and export settings</h4>
          <div class="settings-group">
            <label class="settings-label"> export settings</label>
            <button @click="exportSettings">export settings</button>
          </div>
          <br />
          <div class="settings-group">
            <label class="settings-label"> import settings</label>
            <input id="options-export" type="file" @change="importSettings" />
          </div>
        </div>
      </div>

      <div class="footer">
        sponsored by
        <a href="https://checklyhq.com" target="_blank">
          <img src="/assets/images/text_racoon_logo.svg" alt="" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "App",
  data() {
    return {
      loading: true,
      saving: false,
      options: {}
    };
  },
  mounted() {
    this.$chrome.storage.local.get('options', data => {
      this.options = data;
      this.load();
    });
  },
  methods: {
    debounceKeydown() {

      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId);
      }

      this.timeoutId = setTimeout(() => {
        this.save();
      }, 500);
    },

    exportSettings() {
      // Transforme le json en blob
      let blob = new Blob([JSON.stringify(this.options, null, 2)], {
        type: "application/json",
      });
      let urlDDL = URL.createObjectURL(blob);
      // On télécharge le json
      this.$chrome.downloads.download({
        url: urlDDL,
        filename: "e2e_recorder_options.json",
      });
    },

    importSettings() {
      let file = document.getElementById('options-export').files[0];
      var reader = new FileReader();

      // Si le fichier ne contient pas json ce n'est pas un fichier de type json
      if (!file.type.includes("json")) {
        alert("ce n'est pas un fichier JSON");
        return;
      }

      // options que l'on veut mettre à jour
      let op = this.options;

      // Fonction qui sauvegarde les nouvelles options
      let saveFun = this.save;

      reader.onload = function (e, options = op, save = saveFun) {
        let text = reader.result;
        // On parse le json
        let jsonfile = JSON.parse(text);
        // On parcourt les attribues du json
        Object.keys(jsonfile).forEach((attribute) => {
          // Si on a le même attribut alors on le met à jour
          if (options[attribute] !== null && options[attribute] !== undefined) {
            options[attribute] = jsonfile[attribute];
          }
        });
        // On sauvegarde
        save();
      };

      reader.readAsText(file, "UTF-8");
    },
    save() {
      this.saving = true;
      this.$chrome.storage.local.set(
        {
          options: this.options,
        },
        () => {
          setTimeout(() => {
            this.saving = false;
          }, 500);
        }
      );
    },
    load() {
      this.$chrome.storage.local.get("options", ({ options }) => {
        if (options) {
          this.options = options;
        }
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/_variables.scss";
@import "../../../assets/styles/_mixins.scss";

.options {
  height: 100%;
  min-height: 580px;
  background: $gray-lighter;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  position: fixed;
  left: 0;
  top: 0;

  .container {
    padding: 0 2 * $spacer;
    width: 640px;
    margin: 0 auto;

    .content {
      background: white;
      padding: 2 * $spacer;
      border-radius: 4px;
      min-height: 500px;
    }

    .footer {
      @include footer();
      background: $gray-lighter;
      font-weight: normal;
      justify-content: center;
      img {
        margin-left: 8px;
        width: 80px;
        vertical-align: middle;
      }
    }

    .header {
      @include header();
      background: $gray-lighter;
      justify-content: space-between;
    }

    .settings-block {
      .settings-label {
        display: block;
        text-transform: uppercase;
        font-size: 0.75rem;
        font-weight: 500;
        margin-bottom: $spacer;
      }

      .settings-block-title {
        margin: 0;
        padding-bottom: $spacer;
        border-bottom: 1px solid $gray-light;
      }
      .settings-block-main {
        padding: $spacer 0;
        margin-bottom: $spacer;

        .settings-group {
          margin-bottom: $spacer;
          display: block;
        }
      }
      input[type="text"] {
        margin-bottom: 10px;
        width: 100%;
        border: 1px solid $gray-light;
        padding-left: 15px;
        height: 38px;
        font-size: 14px;
        border-radius: 10px;
        -webkit-box-sizing: border-box;
      }
    }
  }
}
</style>