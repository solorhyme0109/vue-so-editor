<template>
  <div id="so-editor">
    <tool :range="range"></tool>
    <div id="so-editor-content" :contenteditable="contenteditable" @mouseup="handleSelection" data-so-editor-identity="so-editor-identity">
      <div contenteditable="inherit" style="display:none"></div>
    </div>
  </div>
</template>
<script>
import tool from './tool_bar.vue'

export default {
  name: 'so-editor',
  props: {
    contenteditable: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data () {
    return {
      range: null
    }
  },
  methods: {
    handleSelection () {
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      if (!range.startContainer || !range.endContainer) return
      if (range.collapsed) return
      this.range = range
    }
  },
  components: {
    tool
  },
  created () {
    // do something after creating vue instance

  }
}
</script>

<style scoped>
#so-editor{
  width: 100%;
  height: 300px;
}
#so-editor-content {
  outline: none;
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 1px 1px #dfdfdf;
}
</style>

<style src="./index.css">

</style>
