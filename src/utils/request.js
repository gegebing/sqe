import axios from 'axios'
import apis from '../api/api'

import {
  getToken,removeToken
} from '@/utils/persistence'

import {  Notification, Loading } from 'element-ui'

!(function (win, doc) {
  //系统http请求实例封装
  function Request() {
    this.systype = "web"
    this.version = "1.0.4"
  }
  Request.prototype.http = function (cfg) {
    let _self = this
    return new Promise(function (resolve, reject) {
      let headers = {
        systype: _self.systype,
        version: _self.version,
      }
      // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
      if (getToken()) {
        headers['token'] = getToken()
      }
      var lang = localStorage.getItem("lang") || 'md';
      headers["language"] = lang;
      //自传header
      if (cfg.header)
        headers = Object.assign(headers, cfg.header)
      //参数拼接在url后面
      let url = '';
      if (cfg.isurlparam) {
        url = apis[cfg.url] + '/' + cfg.params;
        cfg.params = {}
      } else {
        url = apis[cfg.url]
      }
      let load = null;
        if (cfg.hasLoad) {
          load = Loading.service({});
        }
      // 创建自定义axios实例
      let service = axios.create({
        timeout: 30000, // 请求超时时间
        headers: headers
      });
      let hconfig = {
        url: url,
        method: cfg.type
      }
      if (cfg.responseType)
        hconfig.responseType = cfg.responseType || {}
      if (cfg.params)
        hconfig.params = cfg.params || {}
      if (cfg.data) {
        hconfig.data = cfg.data || {}
        hconfig.data.pubHeader={};
      }
      service(hconfig).then(response => {
        const res = response.data;
          if (res.code && res.code != '200') {
             if (res.code == '402') {
                // this.$router.push({ path: "/login" });
               removeToken();
               location.href = '/'
            } else {
               Notification.error({
                 message: res.msg,
                 showClose: true,
                 duration: 5000
               })
               reject(res)
             }
          }
          resolve(res)
        },
        error => {
          const res = error.response
          if (res.status === 478 || res.status === 403) {
            Message.error({
              message: res.data.msg,
              showClose: true,
              duration: 5000
            })
          } else if (res.status === 400) {
            Message.error({
              message: res.data.error_description,
              showClose: true,
              duration: 5000
            })
          }  else if (res.status === 401) {
            Message.error({
              message: res.data.message.split(": ")[1],
              showClose: true,
              duration: 5000
            })
          } else {
            Message.error({
              message: '后台异常！',
              showClose: true,
              duration: 5000
            })
          }
          reject(error)
        }
      ).catch((err) => {
        reject(err)
      }).finally(()=>{
          if (cfg.hasLoad && load) {
            load.close();
          }
        })
    })
  }
  window.$http = new Request();
})(window, document)
