<template>
  <div>
    <el-input v-model="tablepage.competitionId" placeholder="请输入比赛名称"
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

      <el-table-column prop="introduction" label="比赛简介" width="500px">
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="middle">评分</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="width: 100%;display: flex;justify-content: center;">
      <el-pagination background layout="prev, pager, next" :total="tablepage.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="tablepage.pageNumber" :page-size="tablepage.pageSize"
        :page-sizes="[1, 2, 5, 10]">
      </el-pagination>
    </div>

    <el-drawer title="评分" :visible.sync="drawer" :before-close="handleClose">
      <el-table :data="tableData1" style="width: 100%">
        <el-table-column prop="realName" label="选手编号" width="100px">
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="handleClick1(scope.row)" type="text" size="middle">查看作品</el-button>
            <el-button @click="scoring(scope.row)" type="text" size="middle">评分</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-divider></el-divider>

      <div style="width: 100%;display: flex;justify-content: center;">
        <el-pagination background layout="prev, pager, next" :total="tablepage1.total" @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1" :current-page="tablepage1.pageNumber" :page-size="tablepage1.pageSize"
          :page-sizes="[1, 2, 5, 10]">
        </el-pagination>
      </div>
    </el-drawer>
  </div>
</template>
  
<script>
import { getfile } from '@/api/user'
import { judgepage } from '@/api/user'
import { competitionlist } from '@/api/user'
import { grade } from '@/api/user'
import { competitioninfo } from '@/api/user'

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
      tableData1: [{
        competitionId: '',
        userId: '',
        realName: ''
      }],

      tablepage: {
        state: 1,
        competitionId: '',
        // 当前页数
        pageNumber: 1,
        // 显示一页多少条数据
        pageSize: 7,
        total: 0,
      },
      tablepage1: {
        // 当前页数
        pageNumber: 1,
        // 显示一页多少条数据
        pageSize: 7,
        total: 0
      },
      restaurants: [],
      timeout: null,
      drawer: false,
      innerDrawer: false,
      flag: false,
      fileName:''
    };
  },
  created() {
    this.getdata();
    this.getcomepetition();
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
    handleCurrentChange1(currentPage) {

      this.tablepage.pageNumber = currentPage
      // 在此刷新数据
      this.getcomepetition();
    },
    handleSizeChange1(pageSize) {

      this.tablepage.pageSize = pageSize
      // 在此刷新数据
    },
    getdata() {
      let login = localStorage.getItem('login');
      let parma = {
        state: this.tablepage.state,
        competitionId:this.tablepage.competitionId,
        userId: JSON.parse(login).data.id,
        pageNumber: this.tablepage.pageNumber,
        pageSize: this.tablepage.pageSize,

      }
      judgepage(parma).then((res) => {
        // 后台返回数据
        this.tableData = res.data.list
        this.total = res.data.total
      })
    },
    serch() {
      this.getdata();
    },

    getcomepetition() {
      let parma = {
        pageNumber: this.tablepage1.pageNumber,
        pageSize: this.tablepage1.pageSize,
        competitionId: this.tablepage.id
      }
      competitionlist(parma).then((res) => {
        // 后台返回数据
        this.tableData1 = res.data.list
        this.total1 = res.data.total
      })
    },

    handleClick(row) {

      this.flag = false
      this.drawer = true
    },
    handleClick1(row) {
      let parm={
        competitionId: row.competitionId,
        userId: row.userId,
      }
      competitioninfo(parm).then(res=>{
        this.fileName=res.data.filePath
        let parma={
        fileName:this.fileName
      }
        getfile(parma).then(res => {
        let blob = new Blob([res], {type: "application/pdf"});
        let url = window.URL.createObjectURL(blob);
        window.open(url);
      })
      })
     
     
    },

    scoring(row) {

      this.$prompt('请输入分数', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(?:0|[1-9][0-9]?|100)(\.[0-9]{0,2})?$/,
        inputErrorMessage: '分数格式不正确',
      }).then(({ value }) => {
        this.flag = true
        let login = localStorage.getItem('login');

        let parme = {
          competitionId: row.competitionId,
          userId: row.userId,
          score: value,
          judgeUserId: JSON.parse(login).data.id,
        }
        grade(parme).then((res) => {
          // 后台返回数据
          this.$message({
            type: 'success',
            message: '成功'
          });
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },

    handleClose(done) {
      this.getdata();
      if (this.flag == false) {
        this.$confirm('确认关闭并保存？')
          .then(_ => {
            done();
          })
          .catch(_ => { });
      }
      done();

    },

    loadAll() {
      return [
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