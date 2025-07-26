import request from "@/utils/requestPackage";

//   资质审核日志列表
export function qualifyFlowPage(data) {
    return request({
      url: "/api/1.0/auditLog/page",
      method: "post",
      data: data
    });
  }

// 查询申请单的审核记录列表
  export function qualifyFlowList(data) {
    return request({
      url: "/api/1.0/auditLog/list",
      method: "post",
      data: data
    });
  }