import request from "@/utils/requestPackage";

// 查询资质申请单信息列表
export function listApply(query) {
  return request({
    url: '/api/1.0/rating/apply/list',
    method: 'get',
    params: query
  })
}
export function listAuthApply(query) {
  return request({
    url: '/api/1.0/rating/apply/auth/list',
    method: 'get',
    params: query
  })
}

// 查询资质申请单信息详细
export function getApply(id) {
  return request({
    url: '/api/1.0/rating/apply/' + id,
    method: 'get'
  })
}

// 新增资质申请单信息
export function addApply(data) {
  return request({
    url: '/api/1.0/rating/apply',
    method: 'post',
    data: data
  })
}

export function reapply(data) {
  return request({
    url: '/api/1.0/rating/auth/reapply',
    method: 'post',
    data: data
  })
}
export function apply(data) {
  return request({
    url: '/api/1.0/rating/auth/apply',
    method: 'post',
    data: data
  })
}
export function approve(data) {
  return request({
    url: '/api/1.0/rating/auth/approve',
    method: 'post',
    data: data
  })
}
export function getApplyStateNum(query) {
  return request({
    url: '/api/1.0/rating/apply/get/state',
    method: 'get',
    params: query
  })
}

export function getApplyAuthStateNum(query) {
  return request({
    url: '/api/1.0/rating/apply/auth/get/state',
    method: 'get',
    params: query
  })
}

// 修改资质申请单信息
export function updateApply(data) {
  return request({
    url: '/api/1.0/rating/apply',
    method: 'put',
    data: data
  })
}

// 删除资质申请单信息
export function delApply(id) {
  return request({
    url: '/api/1.0/rating/apply/' + id,
    method: 'delete'
  })
}

//   根据员工id查询员工详情
export function ratingAuthEmployee(data) {
  return request({
    url: "/api/1.0/rating/auth/reviewer/list?applyId="+data,
    method: "get"
  });
}

export function authApplyCheck(data) {
  return request({
    url: "/api/1.0/rating/auth/applyCheck",
    method: "post",
    data: data
  });
}
