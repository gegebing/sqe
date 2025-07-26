import { getToken, setToken, removeToken } from '@/utils/persistence'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  menu:JSON.parse(window.localStorage.getItem("menu"))
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MENU:(state ,menu) =>{
    state.menu=menu
  }
}
const actions = {
  loadMenu({ commit }) {
    return new Promise((resolve, reject) => {
      commit("SET_MENU",[]) ;
      $http.http({
        type: "post",
        url: "menu_tree",
        data: {}
      })
        .then((data) => {
          commit("SET_MENU",data.body) ;
          window.localStorage.setItem("menu" ,JSON.stringify(data.body));
        })
        .catch(() => {});

    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

