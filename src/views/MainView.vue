<template>
  <el-container >
    <!--        顶部logo部分-->
    <el-header class="Header" style="padding-left: 0; padding-right: 0;border: 1px solid #eee;height: fit-content">
      <el-row style="height: 60px">
        <el-col :span="20" style="height: 60px">
          <!--一个-col的长度为24SPan-->
          <div class="projectLabelC">
              <el-avatar
                  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                  style="width: 45px; height: 45px; margin-top: -10px; margin-right: 10px;"
              />
              <label class="projectLabel">欢迎使用 个人助手</label>
          </div>
        </el-col>
        <el-col :span="4" style="height: 60px">
          <div class="userMessageContainer">
            <div class="usernameContainer">
              <label style="min-width: 57px; font-weight: normal"> USER </label>
              <div style="margin-left: 10px;margin-top: -9px">
                <el-dropdown >
                <span class="el-dropdown-link">
<!--                  <el-avatar v-bind:src="defaultUrl" shape="circle" -->
<!--                             style="height: 45px; width: 45px; margin-top: 0; ">-->
<!--                  </el-avatar>-->
                  <el-avatar :icon="UserFilled" style="height: 45px; width: 45px; " />
                </span>
                  <template #dropdown>

                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <!--    -->
    <el-main style=" display: flex;padding: 0;height: 840px">
      <el-container >
        <!--                侧边栏视图部分-->
        <el-aside style="width: 160px;height:100%">
          <div style="height: 100%">
            <el-row style="height: 100%">
              <el-menu class="el-menu-vertical-demo"
                       default-active="0"
                       style="height: 100%"
                       @select="handleSelect"
              >
                <el-menu-item index="0">
                  <template #title>
                    <el-icon>
                      <Grid/>
                    </el-icon>
                    <span>主页</span>
                  </template>
                </el-menu-item>
                <el-menu-item index="1">
                  <template #title>
                    <el-icon>
                      <DocumentChecked />
                    </el-icon>
                    <span>备忘录管理</span>
                  </template>
                </el-menu-item>
                <el-menu-item index="2">
                  <template #title>
                    <el-icon>
                      <House/>
                    </el-icon>
                    <span>健康管理</span>
                  </template>
                </el-menu-item>
                <el-menu-item index="3">
                  <el-icon>
                    <Connection/>
                  </el-icon>
                  <span>收支管理</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <el-icon>
                    <UserFilled />
                  </el-icon>
                  <span>联系人管理</span>
                </el-menu-item>

              </el-menu>
            </el-row>
          </div>
        </el-aside>
        <el-main style="padding-left: 0 ;padding-top: 0">
          <el-container>
            <el-header height="15px">

            </el-header>
            <el-main style="padding-top: 0;padding-left: 0">

              <router-view v-slot="{ Component }">
                <component :is="Component" :key="$route.path" />
              </router-view>

            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-main>
    <el-footer style="border-top: 1px solid #eee;height: 30px;background: black;background-image: none;">
      <div class="CopyrightContainer">
        <label>
          Copyright © 2024 个人助手 Inc. All rights reserved.
        </label>
      </div>
    </el-footer>
  </el-container>
</template>

<style scoped>

</style>
<script lang="ts">
import router from "@/router";
import {UserFilled} from "@element-plus/icons-vue";
import {computed, ref, watch} from "vue";
// import {loadingData, type USERDATA,PathNameTable} from "@/utilTs/util";
import Axios from "axios";
import {ElMessage} from "element-plus";
import axios from "axios";

axios.defaults.withCredentials =true;

export default {
  // 组合式API部分，存放非数据变量
  setup() {
    const nowIndex = ref("0")
    const pathList = ref([] as string[])
    return {
      UserFilled, nowIndex, pathList
    }
  },
  computed:{

  }
  ,
  // 选项式API部分，存放实体数据变量
  data() {
    return {
     defaultUrl: "",

    }
  },

  mounted() {

  },

  methods: {

    handleSelect(index: string) {
      this.nowIndex = index;
      if(index==='0'){
        router.push("/mainView")
        this.pathList.splice(0,this.pathList.length);
        this.pathList.push("/mainView")
      }
      else if (index === "1") {
        router.push("/mainView/dailyManagement")
        this.pathList.splice(0,this.pathList.length);
        this.pathList.push("/mainView")
        this.pathList.push("/mainView/dailyManagement")
      }
      else if (index === "2") {
        router.push("/mainView/healthManagement")
        this.pathList.splice(0,this.pathList.length);
        this.pathList.push("/mainView")
        this.pathList.push("/mainView/healthManagement")
      }
      else if (index === "3") {
        router.push("/mainView/financeManagement")
        this.pathList.splice(0,this.pathList.length);
        this.pathList.push("/mainView")
        this.pathList.push("/mainView/financeManagement")
      }
      else if (index === "4") {
        router.push("/mainView/ContactManagement")
      }

    },

  },

}
</script>