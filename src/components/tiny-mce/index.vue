<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
    </div>
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const resourceCdn1 = 'https://cdn.staticfile.org/tinymce/4.9.3/tinymce.min.js'
const resourceCdn2 = 'https://unpkg.com/tinymce@4.9.3/tinymce.min.js'
const resourceCdn3 = 'https://unpkg.com/tinymce@4.9.3/tinymce.min.js'

export default {
  name: 'Tinymce',
  props: {
    id: {
      type: String,
      default: function () {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default () {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    fileType: {
      type: [Number, String],
      required: false,
      default: 100001
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data () {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  computed: {
    language () {
      return "zh_CN" || 'zh_CN'
    },
    containerWidth () {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value (val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val))
      }
    },
    language () {
      this.destroyTinymce()
      this.$nextTick(() => this.initTinymce())
    }
  },
  mounted () {
    this.init()
  },
  activated () {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated () {
    this.destroyTinymce()
  },
  destroyed () {
    this.destroyTinymce()
  },
  methods: {
    init () {
      // dynamic load tinymce from cdn
      load(resourceCdn1, (err) => {
        if (!err) {
          this.initTinymce()
          return
        }
        load(resourceCdn2, (err2) => {
          if (!err2) {
            this.initTinymce()
            return
          }
          load(resourceCdn3, (err3) => {
            if (!err3) {
              this.initTinymce()
              return
            }
            this.$message.error(err.message)
          })
        })
      })
    },
    initTinymce () {
      const _this = this
      window.tinymce.init({
        language: this.language,
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        images_upload_handler:function (blobInfo, success, failure) {
          $http.http({
            type: "post",
            url: "fileUpload",
            data: {fileType: "100001", fileContent: blobInfo.base64(), fileName: blobInfo.filename() }
          }).then((data) => {
            if (data.code == 200) {
              success(data.body.location);
            } else {
              this.$message.error(data.msg);
            }
          }).catch(() => {});

        },
        plugins: plugins,
        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.yqkj.com'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup (editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        },
        // it will try to keep these URLs intact
        // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
        // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
        convert_urls: false
      })
    },
    destroyTinymce () {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent (value) {
      if (window.tinymce) {
        this.value = value;
        window.tinymce.get(this.tinymceId).setContent(value)
      }
    },
    getContent () {
      window.tinymce.get(this.tinymceId).getContent()
    },
    // 限制图片上传大小
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg'
      if (!isJPG) {
        this.$message.error('上传图片只能是jpeg/jpg/png/gif 格式!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M && isJPG
    },
    imageSuccessCBK (response, file, fileList) {
      const _this = this
      fileList.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${this.resourcesUrl + v.response}" >`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
