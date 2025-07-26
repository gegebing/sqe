import request from "@/utils/requestPackage";

// 查询资质层级
export function qualifyManageLevels(query) {
    return request({
      url: "/api/1.0/qualifyManage/levels",
      method: "get",
      params: query
    });
  }

//   新增审核信息
export function qualifyConfigAdd(data) {
    return request({
      url: "/api/1.0/qualifyConfig/audit/add",
      method: "post",
      data: data
    });
  }


  //   删除审核信息
export function qualifyConfigDelete(data) {
    return request({
      url: "/api/1.0/qualifyConfig/audit/delete",
      method: "post",
      data: data
    });
  }

//   查询资质审核配置
export function qualifyConfigDetail(data) {
    return request({
      url: "/api/1.0/qualifyConfig/audit/detail",
      method: "post",
      data: data
    });
  }

// 修改审核信息
export function qualifyConfigEdit(data) {
    return request({
      url: "/api/1.0/qualifyConfig/audit/edit",
      method: "post",
      data: data
    });
  }

// 新增资质基础配置
export function qualifyConfigBaseAdd(data) {
    return request({
        url: "/api/1.0/qualifyConfig/base/add",
        method: "post",
        data: data
      });
}

// 查询资质配置详情
export function qualifyConfigBaseDetail(data) {
    return request({
        url: "/api/1.0/qualifyConfig/base/detail",
        method: "post",
        data: data
      });
}

// 更新资质基础配置
export function qualifyConfigBaseUpdate(data) {
    return request({
        url: "/api/1.0/qualifyConfig/base/update",
        method: "post",
        data: data
      });
}

// 查询部门列表
export function deptList() {
    return request({
        url: "/api/1.0/dept/list",
        method: "post",
      });
}

// 查询员工列表列表
export function employeeList(data) {
    return request({
        url: "/api/1.0/employee/list",
        method: "post",
        data: data
      });
}

// 查询字典列表
export function sysDictList(data) {
    return request({
        url: "/api/1.0/sysDict/list",
        method: "post",
        data: data
      });
}

export function employeeSave(data) {
  return request({
    url: "/api/1.0/employee/save",
    method: "post",
    data: data
  });
}
