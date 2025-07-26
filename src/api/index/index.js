import request from "@/utils/requestPackage";

export function statistics(data) {
    return request({
      url: "/api/1.0/home/statistics",
      method: "post",
      data: data
    });
  }