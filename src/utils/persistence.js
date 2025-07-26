const TokenKey = 'yqkj_zysoft_token'
const UserInfo = "yqkj_zysoft_user_info"

export  function getUserInfo() {
  return JSON.parse(localStorage.getItem(UserInfo));

}
export function setUserInfo(userInfo) {
  return localStorage.setItem(UserInfo, JSON.stringify(userInfo));
}
export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  localStorage.removeItem(UserInfo);
  return localStorage.removeItem(TokenKey)
}
