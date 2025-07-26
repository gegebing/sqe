import request from "@/utils/requestPackage";

// 新增
export function catalogAdd(data) {
  return request({
    url: "/api/1.0/catalog/add",
    method: "post",
    data: data
  });
}

// 删除
export function catalogDelete(data) {
  return request({
    url: "/api/1.0/catalog/delete",
    method: "post",
    data: data
  });
}

// 查询所有资质
export function catalogList(data) {
  return request({
    url: "/api/1.0/catalog/list",
    method: "post",
    data: data
  });
}

// 分页查询
export function catalogPage(data) {
  return request({
    url: "/api/1.0/catalog/page",
    method: "post",
    data: data
  });
}

// 更新
export function catalogUpdate(data) {
  return request({
    url: "/api/1.0/catalog/update",
    method: "post",
    data: data
  });
}
