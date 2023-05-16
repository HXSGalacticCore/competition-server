<template>
  <div>
    <h1 style="margin-left: 20px;">欢迎！{{ name }}评委</h1>
    <el-divider></el-divider>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="通知" width="1200px">
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <!-- <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
      </template> -->
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
export default {


  data() {
    return {
      name: '',
      tableData: [{
        date: '2016-05-03',
      }]
    }

  },
  //显示xx
  mounted() {
    let login = localStorage.getItem('login');
    this.name = JSON.parse(login).data.realName;
    console.log(login)
  },
  methods: {
    handleClick(row) {
      this.$alert(row, {
        confirmButtonText: '确定',
        // callback: action => {
        //   // this.$message({
        //   //   type: 'info',
        //   //   message: `action: ${ action }`
        //   // });
        // }
      });
    }
  },
}
</script>
