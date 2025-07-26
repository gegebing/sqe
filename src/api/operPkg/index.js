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
