<template>
  <div>
    <el-input v-model="tablepage.name" placeholder="请输入比赛编号"
      style="margin-left: 10px; margin-top: 30px; width: 300px;"></el-input>
    <el-button icon="el-icon-search" circle style="margin-left: 5px;" @click="serch"></el-button>
    <el-divider></el-divider>

    <el-table :data="tableData" border style="width: 100%;height: 525px;">
      <el-table-column prop="id" label="比赛编号" width="100px">
      </el-table-column>

      <el-table-column prop="name" label="比赛名称" width="200px">
      </el-table-column>

      <el-table-column prop="beginTime" label="开始时间" width="200px">
      </el-table-column>

      <el-table-column prop="endTime" label="结束时间" width="200px">
      </el-table-column>

      <el-table-column prop="introduction" label="比赛简介" width="450px">
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleClick1(scope.row)" type="text" size="middle">上传作品</el-button>
          <el-button @click="handleClick2(scope.row)" type="text" size="middle">查看结果</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="提示" :visible.sync="dialogVisible1" width="30%">
      <div style="width: 100%;display: flex;justify-content: center;">
        <el-upload class="upload-demo" action="/api/file/upload" drag multiple :on-success="handlesuccess"
          :before-upload="beforeUpload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传pdf和jpg文件，且不超过500kb</div>
        </el-upload>
      </div>
    </el-dialog>

    <el-dialog title="您的分数" :visible.sync="dialogVisible2" width="30%">
      <div style="width: 100%;display: flex;justify-content: center; font-size: 100px;color: red; font-style: oblique;">
        {{ score }}
      </div>
      <p style="font-style: italic; text-align: center; font-weight:bold; font-size: medium;">恭喜你！荣获{{ award }}</p>
    </el-dialog>

    
    <div style="width: 100%;display: flex;justify-content: center;">
      <el-pagination background layout="prev, pager, next" :total="tablepage.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="tablepage.pageNumber" :page-size="tablepage.pageSize"
        :page-sizes="[1, 2, 5, 10]">
      </el-pagination>
    </div>
  </div>
</template>
    
<script>
import { stucompetition } from '@/api/Suser'
import { uploadProject } from '@/api/Suser'
import { checkScore } from '@/api/Suser'

export default {
  data() {
    return {
      tableData: [{
        id: '',
        name: '',
        beginTime: '',
        endTime: '',
        introduction: '',
      }],
      tablepage: {
        state: 1,
        name: '',
        // 当前页数
        pageNumber: 1,
        // 显示一页多少条数据
        pageSize: 7,
        total: 0,
      },
      dialogOfUpload: false,
      fileList: [],
      competitionId:'',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      score: '',
      restaurants: [],
      state: '',
      timeout: null,
      dialogVisible1: false,
      dialogVisible2: false,
      award: '',
      flag: false
    };
  },

  created() {
    this.getdata();

  },
  methods: {

    handleCurrentChange(currentPage) {

this.tablepage.pageNumber = currentPage
// 在此刷新数据
this.getdata();
},
handleSizeChange(pageSize) {

this.tablepage.pageSize = pageSize
// 在此刷新数据
},

getdata() {
      let login = localStorage.getItem('login');
      let parma = {
        state: this.tablepage.state,
        userId: JSON.parse(login).data.id,
        pageNumber: this.tablepage.pageNumber,
        pageSize: this.tablepage.pageSize,

      }
      stucompetition(parma).then((res) => {
        // 后台返回数据
        this.tableData = res.data.list
        this.total = res.data.total
      })
    },
    serch() {
      this.getdata();
    },
    submit() {
      this.flag = true
    },

    handleClick(row) {
      this.flag = false
      this.drawer = true
    },
    handleClick1(row) {
      this.dialogVisible1 = true;
      this.competitionId=row.id
    },
    handleClick2(row) {
      this.dialogVisible2 = true;
      let login = localStorage.getItem('login');
      let parm={
        competitionId:row.id,
        userId: JSON.parse(login).data.id,
      }
      checkScore(parm).then((res)=>{
        this.score=res.data
      })
    },

    beforeUpload(file,type) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
      const whiteList = ['pdf','jpg']
       if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message({
          message: '上传文件只能是 pdf或jpg',
          type: 'warning'
        })
        return false
       }
    },

    handlesuccess(res,file)
    {
      console.log(file.name)
      console.log(this.competitionId)
      let login = localStorage.getItem('login');
      let parm={
        filePath:file.name,
        competitionId:this.competitionId,
        userId: JSON.parse(login).data.id,
        // competitionId:this.tablepage.name
      }
      uploadProject(parm).then((res) => {
        // 后台返回数据
        
      })
    },


    loadAll() {
      return [
        { },

      ];
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    }
  },
  mounted() {
    this.restaurants = this.loadAll();
  }
};
</script>
  