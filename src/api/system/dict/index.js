import request from '@/utils/requestPackage'

export function listType(data) {
    return request({
      url: '/api/1.0/dict/page',
      method: 'post',
      data: data
    })
  }

  export function addType(data) {
    return request({
      url: '/api/1.0/dict/add',
      method: 'post',
      data: data
    })
  }

  export function updateType(data) {
    return request({
      url: '/api/1.0/dict/update',
      method: 'post',
      data: data
    })
  }

  export function deleteType(data) {
    return request({
      url: '/api/1.0/dict/id/delete',
      method: 'post',
      data: data
    })
  }

  
// 查询字典的字典子项 
export function childListType(data) {
    return request({
      url: '/api/1.0/dict/child/list',
      method: 'post',
      data: data
    })
  }

  
// 新增字典子项
  export function childAddType(data) {
    return request({
      url: '/api/1.0/dict/child/add',
      method: 'post',
      data: data
    })
  }

  // 删除字典子项
  export function childDeleteType(data) {
    return request({
      url: '/api/1.0/dict/child/delete',
      method: 'post',
      data: data
    })
  }

// 更新字典子项
export function childUpdateType(data) {
    return request({
      url: '/api/1.0/dict/child/update',
      method: 'post',
      data: data
    })
  }