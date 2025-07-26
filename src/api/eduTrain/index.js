import request from "@/utils/requestPackage";

//  分页查询
export function eduTrainPage(data) {
  return request({
    url: "/api/1.0/eduTrain/page",
    method: "post",
    data: data
  });
}


//  新增
export function eduTrainAdd(data) {
    return request({
      url: "/api/1.0/eduTrain/add",
      method: "post",
      data: data
    });
  }

  //  删除
export function eduTrainDelete(data) {
    return request({
      url: "/api/1.0/eduTrain/delete",
      method: "post",
      data: data
    });
  }

  //  更新
export function eduTrainUpdate(data) {
    return request({
      url: "/api/1.0/eduTrain/update",
      method: "post",
      data: data
    });
  }

  //  审核
  export function eduTrainAudit(data) {
    return request({
      url: "/api/1.0/eduTrain/audit",
      method: "post",
      data: data
    });
  }