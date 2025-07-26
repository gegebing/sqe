import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocal from  './langs/en';
import zhLocal from  './langs/zh-CN';
import mdLocal from  './langs/md';
import mdElLocal from  './langs/md-el';

import  elEn from  'element-ui/lib/locale/lang/en';
import  elZh from  'element-ui/lib/locale/lang/zh-CN';



Vue.use(VueI18n)
//从localStorage获取语言选择。
const  messages =  {
  en:{
    ...elEn,
    ...enLocal,
  },
  zh: {
    ...elZh,
    ...zhLocal
  },
  md: {
    ...mdElLocal,
    ...mdLocal
  }
};
const i18n = new VueI18n({
  locale:  localStorage.getItem("lang") || 'zh', //初始未选择默认 zhCN 中文
  silentTranslationWarn: true,
  messages
})
export  default  i18n;
