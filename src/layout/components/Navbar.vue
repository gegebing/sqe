<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <span style="float: left;font-size: 18px;line-height: 50px;color: #01448d;margin-right: 10px;font-weight: bold;">人员资格资质与授权管理</span>
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <div class="right-menu" style="top:-15px">
        <img src="@/assets/user/user.png" class="user-avatar">
        <div style="font-size: 14px;margin: 0 8px;">{{userName}}</div>
        <div style="display:block; cursor: pointer;margin: 0 8px;font-size: 14px;" @click="logout">{{$t('common.site.loginOut')}}</div>

      <!-- <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{$t('common.site.home')}}
            </el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>
              {{$t('common.site.personalCenter')}}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{$t('common.site.loginOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import { getToken, setToken, removeToken } from "@/utils/persistence";
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getUserInfo } from "@/utils/persistence";
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ]),
    userName: function() {
      return getUserInfo().userName;
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      let paras = {
        accesstoken: this.token
      };

      $http.http({
          type: "post",
          url: "loginOut",
          data: paras
        })
        .then(() => {
          removeToken();
          this.$router.replace("/login");
        })
        .catch(() => {});
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 45px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 10px;
        margin-right: 30px;
        position: relative;



        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 12px;
        }
      }
    }
  }
  .user-avatar {
          cursor: pointer;
          width: 35px;
          height: 35px;
          border-radius: 5px;
        }
}
</style>
