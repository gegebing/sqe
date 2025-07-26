import request from "@/utils/requestPackage";

// 查询审核列表
export function listReview(query) {
  return request({
    url: '/api/1.0/rating/review/list',
    method: 'get',
    params: query
  })
}

// 查询审核详细
export function getReview(id) {
  return request({
    url: '/api/1.0/rating/review/' + id,
    method: 'get'
  })
}
export function getReviewByApplyId(id) {
  return request({
    url: '/api/1.0/rating/review/apply/' + id,
    method: 'get'
  })
}

// 新增审核
export function addReview(data) {
  return request({
    url: '/api/1.0/rating/review',
    method: 'post',
    data: data
  })
}

// 修改审核
export function updateReview(data) {
  return request({
    url: '/api/1.0/rating/review',
    method: 'put',
    data: data
  })
}

// 修改审核
export function updateAndReview(data) {
  return request({
    url: '/api/1.0/rating/review/submit',
    method: 'put',
    data: data
  })
}

// 删除审核
export function delReview(id) {
  return request({
    url: '/api/1.0/rating/review/' + id,
    method: 'delete'
  })
}

