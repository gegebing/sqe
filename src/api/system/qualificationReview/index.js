import request from "@/utils/requestPackage";

//   查询申请单的审核记录列表
export function auditLogList(data) {
  return request({
    url: "/api/1.0/auditLog/list",
    method: "post",
    data: data
  });
}

//   资质申请单列表
export function applyList(data) {
  return request({
    url: "/api/1.0/qualifyFlow/apply/list",
    method: "post",
    data: data
  });
}

//   资质审核结果查询
export function applyResult(data) {
  return request({
    url: "/api/1.0/qualifyFlow/apply/result",
    method: "post",
    data: data
  });
}

//   根据员工id查询员工详情
export function employeeDetail(data) {
  return request({
    url: "/api/1.0/employee/detail",
    method: "post",
    data: data
  });
}

//   根据员工id查询员工详情
export function ratingEmployee(data) {
  return request({
    url: "/api/1.0/rating/apply/reviewer/list?code=" + data,
    method: "get"
  });
}


//   资质申请单详情

export function applyDetail(data) {
  return request({
    url: "/api/1.0/qualifyFlow/apply/detail",
    method: "post",
    data: data
  });
}

// 资质审核授权
export function applyAuth(data) {
  return request({
    url: "/api/1.0/qualifyFlow/apply/auth",
    method: "post",
    data: data
  });
}

//   资质申请

export function apply(data) {
  return request({
    url: " /api/1.0/qualifyFlow/apply",
    method: "post",
    data: data
  });
}

