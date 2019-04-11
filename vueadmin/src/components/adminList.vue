<template>
  <div class="adminList main">
    <div class="input_box">
      <input v-model="Admin.username" class="myinput" type="text" placeholder="用户名">
      <input v-model="Admin.phone" class="myinput" type="text" placeholder="手机号">

      <button v-if="!editAdminObj" class="btn" @click="searchUser()" >
        <i class="fa fa-search" aria-hidden="true"></i>查询
      </button>
      <button v-if="!editAdminObj" class="btn" @click="dialogFormVisible = true">
        <i class="fa fa-plus" aria-hidden="true"></i>添加
      </button>
      
      <el-dialog title="新增用户" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false,emptyForm()">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false,addAdmin()">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改用户" :visible.sync="dialogUpdFormVisible">
        <el-form :model="updform">
          <el-form-item label="Id" :label-width="formLabelWidth">
            <el-input v-model="updform.id" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="updform.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth">
            <el-input v-model="updform.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="updform.password" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogUpdFormVisible = false,saveEditAdmin()">确 定</el-button>
        </div>
      </el-dialog>

    </div>
    <grid :listData="listData" :theadData="theadData" :ifEdit="true" :ifDelete="true" :ifpage="true" :pageInfo="pageInfo" @on-delete="deleteAdmin" @on-edit="editAdmin" @on-gopage="gopage"></grid>
  </div>
</template>

<script>
var theadData = [
  {
    title: "Id",
    keyname: "id"
  },
  {
    title: "用户名",
    keyname: "username"
  },
  {
    title: "手机号",
    keyname: "phone"
  }
];
import grid from "./grid.vue";
export default {
  name: "adminList",
  data() {
    return {
      listData: [],
      theadData: theadData,
      dialogFormVisible: false,
      dialogUpdFormVisible:false,
      Admin: {
        //用户信息
        username: "",
        phone: ""
      },
      form: {
        username: '',
        phone: '',
        password: '',        
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      updform: {      
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '110px',
      editAdminObj: null, //用于存放正在编辑的用户
      pageInfo: {}
    };
  },
  mounted: function() {
    this.getAdminList(1);
  },
  methods: {
    //显示全部
    getAdminList(page) {
      var _this = this;
      console.log("page======================"+page)
      this.$reqs
        .post("/users/selectAll", {
          page: page
        })
        .then(function(result) {
          //成功
          _this.listData = result.data.data;
          _this.pageInfo.allpage = Math.ceil(result.data.allCount / 5);
        })
        .catch(function(error) {
          //失败
          console.log(error);
        });
    },
    //查询方法
    searchUser(page) {
      //search
      var _this = this;
      console.log("page======================"+page)
      if (!this.Admin.username && !this.Admin.phone) {
        this.$notify({
          title: '警告',
          message: '暂未实现搜索功能',//'最少根据一项查找(*^_^*)',
          type: 'warning'
        });
        return false;
      }
      this.$notify({
        title: '警告',
        message: '暂未实现搜索功能',
        type: 'warning'
      });
      // this.$reqs
      //   .post("/users/search", {
      //     page: page,
      //     data: this.Admin
      //   })
      //   .then(function(result) {
      //     //成功
      //     _this.listData = result.data.data;
      //     _this.pageInfo.allpage = Math.ceil(result.data.allCount / 5);
      //   })
      //   .catch(function(error) {
      //     //失败
      //     console.log(error);
      //   });
    },
    //新增方法
    addAdmin() {
      //添加用户
      if (!this.form.username || !this.form.phone || !this.form.password) {
        this.$notify({
          title: '警告',
          message: '新增失败---信息不能为空',
          type: 'warning'
        });
        return false;
      }
      this.$reqs
        .post("/users/insert", this.form)
        .then(result => {
          //成功
          this.getAdminList(1);
          this.emptyForm(form);
          this.$notify({
            title: '成功',
            message: '新增成功',
            type: 'success'
          });
        })
        .catch(function(error) {
          //失败
          console.log(error);
        });
    },
    //修改前--编辑
    editAdmin(item) {
      this.editAdminObj = item;
      this.dialogUpdFormVisible = true;
      this.updform = JSON.parse(JSON.stringify(item));
    },
    //修改方法
    saveEditAdmin() {
      if (!this.updform.username || !this.updform.phone || !this.updform.password) {
        alert("不能为空");
        return false;
      }
      this.$reqs
        .post("/users/update", this.updform)
        .then(result => {
          console.log("======================"+this.updform)
          //成功
          this.getAdminList(1);
          this.editAdminObj = null;
          this.emptyForm(updform);
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          });
        })
        .catch(function(error) {
          //失败
          console.log(error);
        });
    },
    deleteAdmin(item) {
      this.$reqs
        .post("/users/delete", item)
        .then(result => {
          //成功
          this.gopage(this.pageInfo.current);
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
        })
        .catch(function(error) {
          //失败
          console.log(error);
        });
    },
    //清空表单输入框（多次使用，所以封装到这里）
    emptyForm(tbName) {   
      this.tbName.username = "";
      this.tbName.phone = "";
      this.tbName.password = "";
    },
    //分配页码
    gopage(index) {
      this.pageInfo.current = index;
      //查询数据
      this.getAdminList(index);
    }
  },
  components: { grid }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  border-radius: 4px;
  background: #fff;
  margin-top: 10px;
}

.input_box {
  padding: 0 10px;
}
.input_box .myinput {
  width: 25%;
}
</style>