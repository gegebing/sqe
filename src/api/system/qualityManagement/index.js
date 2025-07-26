import request from "@/utils/requestPackage";

// 新增
export function qualifyManageAdd(data) {
  return request({
    url: "/api/1.0/qualifyManage/add",
    method: "post",
    data: data
  });
}

// 查询资质层级
export function qualifyManageLevels(query) {
  return request({
    url: "/api/1.0/qualifyManage/levels",
    method: "get",
    params: query
  });
}

// 查询所有资质
export function qualifyManageList(query) {
  return request({
    url: "/api/1.0/qualifyManage/list",
    method: "get",
    params: query
  });
}

// 分页查询
export function qualifyManagePage(data) {
  return request({
    url: "/api/1.0/qualifyManage/page",
    method: "post",
    data: data
  });
}

// 更新
export function qualifyManageUpdate(data) {
  return request({
    url: "/api/1.0/qualifyManage/update",
    method: "post",
    data: data
  });
}

//删除
export function qualifyManageDelete(data) {
  return request({
    url: "/api/1.0/qualifyManage/delete",
    method: "post",
    data: data
  });
}

// 根据员工id查询员工资质详情
export function qualifyManageEmployeeDetail(data) {
    return request({
      url: "/api/1.0/qualifyManage/employee/detail",
      method: "post",
      data: data
    });
  }
