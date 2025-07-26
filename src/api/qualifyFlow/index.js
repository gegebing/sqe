import request from "@/utils/requestPackage";

// 医生临床权限列表
export function employeeQualify(data) {
  return request({
    url: "/api/1.0/qualifyFlow/employee/qualify",
    method: "post",
    data: data
  });
}




