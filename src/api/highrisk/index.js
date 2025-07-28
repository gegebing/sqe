import request from "@/utils/requestPackage";

// 提交高风险诊疗技术操作项目申请
export function submitApplication(data) {
  return request({
    url: "/api/1.0/highrisk/apply/submit",
    method: "post",
    data: data
  });
}

// 科室审批
export function departmentApprove(id, approve, approver) {
  return request({
    url: `/api/1.0/highrisk/apply/department-approve/${id}`,
    method: "put",
    params: { approve, approver }
  });
}

// 医务处审批
export function medicalOfficeApprove(id, approve, approver) {
  return request({
    url: `/api/1.0/highrisk/apply/medical-office-approve/${id}`,
    method: "put",
    params: { approve, approver }
  });
}

// 医疗技术管理委员会审批
export function committeeApprove(id, approve, approver) {
  return request({
    url: `/api/1.0/highrisk/apply/committee-approve/${id}`,
    method: "put",
    params: { approve, approver }
  });
}

// 取消申请
export function cancelApplication(id, cancelReason, cancelBy) {
  return request({
    url: `/api/1.0/highrisk/apply/cancel/${id}`,
    method: "put",
    params: { cancelReason, cancelBy }
  });
}

// 根据ID查询申请详情
export function getById(id) {
  return request({
    url: `/api/1.0/highrisk/apply/${id}`,
    method: "get"
  });
}
// 查询所有申请
export function highListNum(data) {
  return request({
    url: "/api/1.0/highrisk/apply/highListNum",
    method: "post",
    data: data
  });
}

// 查询所有申请
export function list(data) {
  return request({
    url: "/api/1.0/highrisk/apply/list",
    method: "post",
    data: data
  });
}

// 查询所有待审核申请
export function autolist(data) {
  return request({
    url: `/api/1.0/highrisk/apply/autolist`,
    method: "post",
    data: data
  });
}

// 根据状态查询申请
export function listByState(state) {
  return request({
    url: "/api/1.0/highrisk/apply/list-by-state",
    method: "get",
    params: { state }
  });
}

// 根据ID查询申请详情
export function auitList(id) {
  return request({
    url: `/api/1.0/highrisk/apply/auitList/${id}`,
    method: "get"
  });
}

// 高风险统计列表
export function getStatisticsList(data) {
  return request({
    url: "/api/1.0/highrisk/apply/list/total",
    method: "post",
    data: data
  });
}

// 高风险统计详情
export function getStatisticsDetail(id) {
  return request({
    url: "/api/1.0/highrisk/apply/list/totalDetail",
    method: "post",
    data: { id }
  });
}

// 导出高风险统计列表
export function exportStatisticsExcel(data) {
  return request({
    url: "/api/1.0/highrisk/apply/exportUserExcel",
    method: "get",
    params: data,
    responseType: "blob"
  });
}
