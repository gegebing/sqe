import { getUserInfo } from "@/utils/persistence";
import Cookies from 'js-cookie'
/**
 * 判断用户是否拥有操作权限
 * 根据传入的权限标识，查看是否存在用户权限标识集合
 * @param perms
 */
export function hasPermission(perms) {
  let hasPermission = 0
  let permissions = getUserInfo().auth;
  if (!perms) {
    return hasPermission;
  }

  var permsArray = perms.split(",");
  for(let i=0, len=permissions.length; i<len; i++) {
    if (hasPermission) {
      break;
    }
    for (let j = 0 , jlen = permsArray.length; j < jlen; j ++ ) {
      if(permissions[i].authCode === permsArray[j]) {

        hasPermission = 1;
        break
      }
    }
  }
  return hasPermission
}
export function getAuthName(perms) {
  let hasPermission = 0
  let permissions = getUserInfo().auth;
  if (!perms) {
    return hasPermission;
  }

  var permsArray = perms.split(",");
  for(let i=0, len=permissions.length; i<len; i++) {
    if (hasPermission) {
      break;
    }
    for (let j = 0 , jlen = permsArray.length; j < jlen; j ++ ) {
      if(permissions[i].authCode === permsArray[j]) {

        hasPermission = 1;
        return permissions[i].authName;
      }
    }
  }
  return "";
}

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
