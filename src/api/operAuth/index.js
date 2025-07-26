import request from "@/utils/requestPackage";

//  分页查询
export function operAuthPage(data) {
  return request({
    url: "/api/1.0/operAuth/page",
    method: "post",
    data: data
  });
}

// 导出
export function operAuthDownload(data) {
    return request({
      url: "/api/1.0/operAuth/download",
      method: "get",
      responseType: 'arraybuffer',
      data: data
    });
  }

//  取消权限
export function operAuthCancel(data) {
    return request({
      url: "/api/1.0/operAuth/cancel",
      method: "post",
      data: data
    });
  }


  //  申请权限校验
export function operAuthApplyCheck(data) {
    return request({
      url: "/api/1.0/operAuth/applyCheck",
      method: "post",
      data: data
    });
  }

// 审核权限
export function operAuthAudit(data) {
    return request({
      url: "/api/1.0/operAuth/audit",
      method: "post",
      data: data
    });
  }

//   查询各个状态下的申请单数量
export function operAuthStatus(data) {
    return request({
      url: "/api/1.0/operAuth/status/list",
      method: "post",
      data: data
    });
  }



// 申请权限
export function operAuthApply(data) {
    return request({
      url: "/api/1.0/operAuth/apply",
      method: "post",
      data: data
    });
  }



// 查询手术级别类别
export function operBaseLevelEnum(data) {
    return request({
      url: "/api/1.0/operBase/levelEnum",
      method: "post",
      data: data
    });
  }

  // 获取手术权限申请详情
export function operationApplyDetail(operId) {
  return request({
    url: "/api/1.0/operAuth/operationApplyDetail/" + operId,
    method: "post"
  });
}
