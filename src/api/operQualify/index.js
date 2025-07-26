import request from "@/utils/requestPackage";

// 新增
export function operQualifyAdd(data) {
  return request({
    url: "/api/1.0/operQualify/add",
    method: "post",
    data: data
  });
}

// 删除
export function operQualifyDelete(data) {
  return request({
    url: "/api/1.0/operQualify/delete",
    method: "post",
    data: data
  });
}

// 分页查询
export function operQualifyPage(data) {
  return request({
    url: "/api/1.0/operQualify/page",
    method: "post",
    data: data
  });
}

// 更新
export function operQualifyUpdate(data) {
  return request({
    url: "/api/1.0/operQualify/update",
    method: "post",
    data: data
  });
}

// 查询部门列表
export function deptList(data) {
    return request({
      url: "/api/1.0/dept/list",
      method: "post",
      data: data
    });
  }

//   查询手术列表
export function operBaseList(data) {
    return request({
      url: "/api/1.0/operBase/list",
      method: "post",
      data: data
    });
  }


//   分页查询手术列表
  export function operBasePage(data) {
    return request({
      url: "/api/1.0/operBase/page",
      method: "post",
      data: data
    });
  }
  

// 下载手术申请要求模板
export function upTemplateDownload() {
  return request({
    url: "/api/1.0/operQualify/upTemplate/download",
    method: "get",
    responseType: 'arraybuffer'
  });
}

// 导出手术申请要求数据
export function operQualifyExport(query) {
    return request({
      url: "/api/1.0/operQualify/export",
      method: "get",
      responseType: 'arraybuffer',
      params: query
    });
  }

  // 导入手术申请要求数据
export function operQualifyImport(data) {
    return request({
      url: "/api/1.0/operQualify/import",
      method: "post",
      data: data
    });
  }
