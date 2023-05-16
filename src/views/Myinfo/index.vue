<template>
    <div>
      <el-card style="margin: 80px;">
        <el-descriptions class="margin-top" title="简介" :column="2" border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-picture-outline">头像</i>
              
            </template>
            <img class="img" :src="'https://th.bing.com/th?id=OSK.a4a5d8bd13749187bb900b11abecfc5f&w=84&h=84&c=7&o=6&dpr=1.3&pid=SANGAM'" alt="" />
          </el-descriptions-item>
          
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-custom">用户名</i>
              
            </template>
            {{ userName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-odometer">真实姓名</i>
              
            </template>
            {{ realName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-male"></i>
              <i class="el-icon-female">性别</i>
              
            </template>
            {{ sex }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-message">邮箱</i>
              
            </template>
            {{ email }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone">手机号码</i>
              
            </template>
            {{ Phone }}
          </el-descriptions-item>
          
        </el-descriptions>
      </el-card>
    </div>
  </template>
  
  <script>
  import { getInfo } from "@/api/user";
  export default {
    name: "Info",
    data() {
      return {
        realName : '',
        email: '',
        Phone:'',
        userName: '',
        sex: '',
      };
    },
    mounted() {
      this.load();
    },
    methods: {
      load() {
        let login = localStorage.getItem('login');
    const id = JSON.parse(login).data.id;
    console.log({id});
        getInfo({id})
          .then((res) => {
            this.realName  = res.data.realName ;
            this.email = res.data.email;
            this.Phone = res.data.phone;
            this.userName = res.data.userName;
            this.sex = res.data.sex == 1 ? "男" : "女";
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
  };
  </script>
  
  <style scoped>
  .img {
    width: 80px;
    height: 80px;
  }
  </style>
  