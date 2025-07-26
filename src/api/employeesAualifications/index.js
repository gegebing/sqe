import request from "@/utils/requestPackage";

//  分页查询员工详情列表
export function employeePage(data) {
  return request({
    url: "/api/1.0/employee/detail/page",
    method: "post",
    data: data
  });
}

// 批量设置员工资质
export function batchQualify(data) {
    return request({
      url: "/api/1.0/qualifyFlow/employee/batchQualify",
      method: "post",
      data: data
    });
  }

