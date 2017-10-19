<template>
  <div id="tool-box">
    <span @click.stop.prevent="bolder"><i class="iconfont icon-jiacu"></i></span>
    <span @click.stop.prevent="italic"><i class="iconfont icon-qingxie"></i></span>
    <span @click.stop.prevent="underline"><i class="iconfont icon-xiahuaxian"></i></span>
    <span @click.stop.prevent="scaleAndScale"><i class="iconfont icon-weibiaoti--"></i></span>
    <span @click.stop.prevent="wrapTemplateA"><i class="iconfont icon-chaolianjie"></i></span>
    <span @click.stop.prevent="wrapTemplateSup"><i class="iconfont icon-shangbiao"></i></span>
    <span @click.stop.prevent="wrapTemplateUl"><i class="iconfont icon-liebiao1"></i></span>
    <span @click.stop.prevent="wrapTemplateOl"><i class="iconfont icon-youxuliebiao"></i></span>
  </div>
</template>
<script>

import attachEffect from '../js/node'
import { wrapInlineTemplate, wrapBlockTemplate } from '../js/template_wrapper'

require('../font/iconfont.css')

const EFFECT_BOLDER = 'editor-bolder'
const EFFECT_YELLOW = 'editor-yellow'
const EFFECT_ITALIC = 'editor-italic'
const EFFECT_UNDERLINE = 'editor-underline'
const EFFECT_ANI_SCALE = 'editor-ani-scale'

export default {
  name: 'tool-box',
  props: ['range'],
  data () {
    return {
    }
  },
  computed: {

  },
  methods: {
    bolder () {
      attachEffect(this.range, EFFECT_BOLDER)
    },
    yellow () {
      attachEffect(this.range, EFFECT_YELLOW)
    },
    italic () {
      attachEffect(this.range, EFFECT_ITALIC)
    },
    underline () {
      attachEffect(this.range, EFFECT_UNDERLINE)
    },
    scaleAndScale () {
      attachEffect(this.range, EFFECT_ANI_SCALE)
    },
    wrapTemplateA () {
      wrapInlineTemplate(this.range, 'TEMPLATE_A', {
        href: 'http://www.baidu.com',
        target: '_blank'
      })
    },
    wrapTemplateSup () {
      wrapInlineTemplate(this.range, 'TEMPLATE_SUP')
    },
    wrapTemplateUl () {
      wrapBlockTemplate(this.range, 'TEMPLATE_UL')
    },
    wrapTemplateOl () {
      wrapBlockTemplate(this.range, 'TEMPLATE_OL')
    }
  }
}
</script>
<style lang="less" scoped>
#tool-box {
  // position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: .3rem;
  // transform: translateY(-100%);
  padding: 4px 12px;
  border: 1px solid #666;
  color: #666;
  background-color: #efefef;
  & > span {
    vertical-align: middle;
    text-align: center;
    margin-right: .1rem;
    line-height: 21px;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
