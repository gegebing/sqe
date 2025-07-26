/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */

/**
 * 语言转换
 * @param lan
 * @returns {string}
 */
export function languageConvert(lan) {
  if (lan == 'en') {
    return "English Language";
  }else if (lan == 'zh-CN') {
    return "简体中文";
  }else  if (lan == 'md') {
    return "ဗာရမီဘာသာစကား";
  }
}

/**
 * 操作用户
 * @param createUser
 * @param updateUser
 * @returns {*}
 */
export function parseOpUser(createUser, updateUser) {
  return updateUser? updateUser: createUser;
}
/**
 * 时间解析配置
 * @param createDate 创建时间
 * @param updateDate 更新时间
 * @returns {string}
 */
export function parsePageTimeEx(createDate, updateDate) {
  return parsePageTime(updateDate? updateDate: createDate);
}

/**
 * 全局列表时间格式
 * @param date
 * @returns {string}
 */
export function parsePageTime(data) {
    if (!data) {
      return "--";
    }
    var dt = new Date(data);
    let year = dt.getFullYear();
    let month = dt.getMonth() + 1;
    let date = dt.getDate();
    let hour = dt.getHours();
    let minute = dt.getMinutes();
    let second = dt.getSeconds();
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
}
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}
