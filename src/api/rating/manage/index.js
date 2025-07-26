import request from "@/utils/requestPackage";

//级别申请
export function applyLevel(query) {
  return request({
    url: '/api/1.0/rating/manage/rating/apply',
    method: 'get',
    params: query
  })
}

// 查询级别管理列表
export function listRating(query) {
  return request({
    url: '/api/1.0/rating/manage/rating/list',
    method: 'get',
    params: query
  })
}

// 查询当前用户等级
export function listRatingLevel(query) {
  return request({
    url: '/api/1.0/rating/manage/rating/level',
    method: 'get',
    params: query
  })
}
// 查询级别管理列表
export function listManage(query) {
  return request({
    url: '/api/1.0/rating/manage/list',
    method: 'get',
    params: query
  })
}

// 查询级别管理详细
export function getManage(id) {
  return request({
    url: '/api/1.0/rating/manage/' + id,
    method: 'get'
  })
}

// 新增级别管理
export function addManage(data) {
  return request({
    url: '/api/1.0/rating/manage',
    method: 'post',
    data: data
  })
}

// 修改级别管理
export function updateManage(data) {
  return request({
    url: '/api/1.0/rating/manage',
    method: 'put',
    data: data
  })
}

// 删除级别管理
export function delManage(id) {
  return request({
    url: '/manage/manage/' + id,
    method: 'delete'
  })
}
