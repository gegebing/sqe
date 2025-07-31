import request from "@/utils/requestPackage";

//  分页查询
export function operPkgPage(data) {
  return request({
    url: "/api/1.0/operPkg/page",
    method: "post",
    data: data
  });
}

// 下载模板
export function upTemplateDownload() {
  return request({
    url: "/api/1.0/operPkg/template/download",
    method: "get",
    responseType: 'arraybuffer'
  });
}

// 新增
export function operPkgAdd(data) {
  return request({
    url: "/api/1.0/operPkg/add",
    method: "post",
    data: data
  });
}

// 删除
export function operPkgDelete(data) {
  return request({
    url: "/api/1.0/operPkg/delete",
    method: "post",
    data: data
  });
}

// 详情
export function operPkgDetail(data) {
  return request({
    url: "/api/1.0/operPkg/detail",
    method: "post",
    data: data
  });
}

// 导出
export function upTemplateImport(query) {
  return request({
    url: "/api/1.0/operPkg/import",
    method: "get",
    responseType: 'arraybuffer',
    params: query
  });
}

// 修改
export function operPkgUpdate(data) {
  return request({
    url: "/api/1.0/operPkg/update",
    method: "post",
    data: data
  });
}

// 批量导入
export function operPkgBatchUpload(data) {
  return request({
    url: "/api/1.0/operPkg/upload",
    method: "post",
    data: data
  });
}

// 分页查询申请列表
export function operPkgPageApply(data) {
  return request({
    url: "/api/1.0/operPkg/pageApply",
    method: "post",
    data: data
  });
}

// 申请手术基础包授权
export function operPkgApply(data) {
  return request({
    url: "/api/1.0/operPkg/apply",
    method: "post",
    data: data
  });
}

// 获取手术基础包申请详情
export function getOperPkgApplyDetail(id) {
  return request({
    url: "/api/1.0/operPkg/applyDetail",
    method: "post",
    data: { id }
  });
}

// 审批手术基础包申请
export function operPkgApprove(data) {
  return request({
    url: "/api/1.0/operPkg/approve",
    method: "post",
    data: data
  });
}

// 获取手术基础包申请状态统计
export function getOperPkgApplyStateNum(data) {
  return request({
    url: "/api/1.0/operPkg/applyStateNum",
    method: "post",
    data: data
  });
}

// 获取手术基础包审批人员列表
export function operPkgAuthEmployee(applyId) {
  return request({
    url: "/api/1.0/operPkg/authEmployee",
    method: "post",
    data: { applyId }
  });
}

// 分页查询手术基础包审核列表
export function operPkgPageAudit(data) {
  return request({
    url: "/api/1.0/operPkg/pageAudit",
    method: "post",
    data: data
  });
}
