import request from "@/utils/requestPackage";

//   部门员工列表
export function deptGroup(data) {
  return request({
    url: "/api/1.0/dept/group",
    method: "post",
    data: data
  });
}

// 批量设置员工资质
export function qualifyBatchEmployee(data) {
    return request({
      url: "/api/1.0/qualifyFlow/qualify/batchEmployee",
      method: "post",
      data: data
    });
  }
