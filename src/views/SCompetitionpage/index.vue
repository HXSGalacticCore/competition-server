<template>
  <div>
    <el-input v-model="tablepage.name" placeholder="请输入比赛名称"
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
          <el-button @click="handleClick(scope.row)" type="text" size="middle">报名</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="width: 100%;display: flex;justify-content: center;">
      <el-pagination background layout="prev, pager, next" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="tablepage.pageNumber" :page-size="tablepage.pageSize"
        :page-sizes="[1, 2, 5, 10]">
      </el-pagination>
    </div>

  </div>
</template>
  
<script>
import { getcompetition } from "@/api/user";
import { apply } from "@/api/Suser";
export default {
  data() {
    return {
      tableData: [{
        id: '',
        name: '',
        beginTime: '',
        endTime: '',
        introduction: ''
      }],
      total: 0,
      tablepage: {

        // 当前页数
        pageNumber: 1,
        // 显示一页多少条数据
        pageSize: 10,
        name: '',
      },
      restaurants: [],
      userId: '',
      dialogVisible: false,
      timeout: null,
      competitionId: ''
    };
  },

  created() {
    this.getdata();
  },
  methods: {
    handleCurrentChange(currentPage) {

      this.tablepage.pageNumber = currentPage
      // 在此刷新数据
      this.getdata()
    },
    handleSizeChange(pageSize) {

      this.tablepage.pageSize = pageSize
      // 在此刷新数据
    },
    // 获取数据
    getdata() {
      getcompetition(this.tablepage).then((res) => {
        // 后台返回数据
        this.tableData = res.data.list
        this.total = res.data.total
      })
    },
    serch() {
      this.getdata();
    },
    handleClick(row) {

      this.$confirm('是否报名该比赛?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let login = localStorage.getItem('login');
        let parma = {
          competitionId: row.id,
          userId: JSON.parse(login).data.id,
        }
        apply(parma).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            });
          }
          else {
            this.$message({
              type: 'error',
              message: '您已申请或已加入该比赛'
            });
          }
        })


      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        });
      });
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
  },
  handleClose(done) {
    this.$confirm('确认关闭？')
      .then(_ => {
        done();
      })
      .catch(_ => { });
  }
};
</script>