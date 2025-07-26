import request from "@/utils/requestPackage";

// 下载手术更替模板
export function upTemplateDownload() {
    return request({
      url: "/api/1.0/operBase/upTemplate/download",
      method: "get",
      responseType: 'arraybuffer'
    });
  }

// 手术更替信息导入
export function operBaseUpload(data) {
    return request({
      url: "/api/1.0/operBase/upload",
      method: "post",
      data: data
    });
  }