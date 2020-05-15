<template>
  <div>
    <el-row type="flex" justify="space-between" class="wrap-head">
      <el-button
        type="danger"
        class="first-btn normal_red_btn"
        v-if="checkHasBtnPermission(`${currentEntry}_customer_addCustomer`) && currentEntry === 'shop'"
        @click="addNewCustomer"
      >新增客户</el-button>
      <div v-else></div>
      <input-search
        :placeholder="'请输入客户姓名/手机号~'"
        width="auto"
        v-model="keyword"
        @search="searchData"
      />
    </el-row>
    <div id="gm_customer_list" class="margin_main">
      <!-- 筛选条件 -->
      <div class="customer_list_condition">
        <div class="tag_list">
          <div class="radio_group scrollbar">
            <div class="radio_group_common">
              <el-radio-group
                v-model="form.tag"
                @change="getTagCustomer()"
                class="radio_group_common_list"
              >
                <el-radio-button
                  v-show="customerTags.length>0"
                  v-for="(item) in customerTags"
                  :key="item.id"
                  :label="item.id"
                  style="margin-left:20px;"
                >{{item.name}}（{{item.customerCount}}）</el-radio-button>
                <el-radio-button v-show="customerTags.length===0" style="margin-left:20px;">全部</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <!-- 展示筛选详情 -->
          <div class="condition_show" @click="showTaglist">
            详细筛选
            <i :class="{'el-icon-arrow-down':!showTag,'el-icon-arrow-up':showTag}"></i>
          </div>
        </div>
        <!-- 详细筛选条件 -->
        <el-collapse-transition>
          <div class="query-parameter" v-if="showTag" style="margin-left:10px;">
            <div class="left">
              <el-form ref="form" class="query-form" :model="form" label-width="88px">
                <!-- 品牌端显示 字段待改 -->
                <!-- <el-form-item label="归属门店：" prop="belongStoreId">
                  <el-select v-model="form.belongStoreId">
                    <el-option :label="item.name" :value="item.id" v-for="item in memberLevelList"
                    :key="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>-->
                <el-form-item label="客户来源：" prop="source">
                  <el-select v-model="form.source">
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="item in sourceList"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="服务者：" prop="server">
                  <el-select v-model="form.server">
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="item in serverlist"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <!-- <el-form-item label="上次消费：" prop="lastServiceInTime">
                  <el-select v-model="form.lastServiceInTime">
                    <el-option label="全部" :value="null">
                    </el-option>
                    <el-option label="1月内" :value="1">
                    </el-option>
                    <el-option label="2月内" :value="2">
                    </el-option>
                  </el-select>
                </el-form-item>-->
                <!-- <el-form-item label="消费周期：" prop="serviceCycle">
                  <el-select v-model="form.serviceCycle">
                    <el-option label="全部" :value="null">
                    </el-option>
                    <el-option label="1月内" :value="1">
                    </el-option>
                    <el-option label="2月内" :value="2">
                    </el-option>
                  </el-select>
                </el-form-item>-->
                <!-- <el-form-item label="消费次数：" prop="serviceTimesCount">
                  <el-select v-model="form.serviceTimesCount">
                    <el-option label="全部" :value="null">
                    </el-option>
                    <el-option label="3次内" :value="3">
                    </el-option>
                    <el-option label="5次内" :value="5">
                    </el-option>
                  </el-select>
                </el-form-item>-->
                <!-- <el-form-item label="累计金额：" prop="totalCount">
                  <el-select v-model="form.totalCount">
                    <el-option label="全部" :value="null"></el-option>
                    <el-option label="1000以内" :value="1000"></el-option>
                    <el-option label="2000以内" :value="2000"></el-option>
                  </el-select>
                </el-form-item>-->
                <!-- <el-form-item label="客单价：" prop="averagePrice">
                  <el-select v-model="form.averagePrice">
                    <el-option label="全部" :value="null"></el-option>
                    <el-option label="1000以内" :value="1000"></el-option>
                    <el-option label="2000以内" :value="2000"></el-option>
                  </el-select>
                </el-form-item>-->
                <!-- <el-form-item label="积分：" prop="integral">
                  <el-select v-model="form.integral">
                    <el-option label="全部" :value="null"></el-option>
                    <el-option label="500" :value="500"></el-option>
                    <el-option label="1000" :value="1000"></el-option>
                    <el-option label="2000" :value="2000"></el-option>
                    <el-option label="3000" :value="3000"></el-option>
                  </el-select>
                </el-form-item>-->
                <!-- <el-form-item label="成长值：" prop="growthScore">
                  <el-select v-model="form.growthScore">
                    <el-option label="全部" :value="null"></el-option>
                    <el-option label="1000以内" :value="1000"></el-option>
                    <el-option label="2000以内" :value="2000"></el-option>
                  </el-select>
                </el-form-item>-->
                <!-- <el-form-item label="会员卡余额：" prop="cardRest">
                  <el-select v-model="form.cardRest">
                    <el-option label="全部" :value="null"></el-option>
                    <el-option label="1000以内" :value="1000"></el-option>
                    <el-option label="2000以内" :value="2000"></el-option>
                  </el-select>
                </el-form-item>-->
              </el-form>
            </div>
            <el-row class="label_area_single right">
              <section>
                <g-button
                  class="button"
                  :name="'查询'"
                  :padding="'5px 15px'"
                  :type="'recommend'"
                  :icon="''"
                  @click="searchTableData"
                ></g-button>
                <span class="span" @click="wulitucao">清空条件</span>
              </section>
            </el-row>
          </div>
        </el-collapse-transition>
      </div>
      <!-- 客户列表 -->
      <div class="customer_container container_normal" style="border-radius:8px;overflow:hidden">
        <div class="user-defined-tab">
          <el-tabs @tab-click="tabGetCustomer" v-model="tabCondition" type="card">
            <el-tab-pane
              v-for="(item, index) in selectStatus"
              :key="index"
              :label="item.value"
              :name="item.code"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <el-row
          type="flex"
          justify="center"
          align="middle"
          class="table-con default"
          v-if="noData&&tableData.length===0"
        >
          <search-default style="margin:10% 0" @clear-back="clearBack"></search-default>
        </el-row>
        <!-- table list -->
        <el-checkbox-group v-else v-model="checkArr" @change="handleChecked" class="list-box_table">
          <el-table :data="tableData" v-loading="tableLoading" height="calc(100vh - 405px)" stripe>
            <el-table-column show-overflow-tooltip min-width="120" align="left" label="客户信息">
              <template slot-scope="scope">
                <div class="client_area">
                  <el-checkbox
                    v-if="currentEntry === 'shop' && checkHasBtnPermission('shop_customer_mark')"
                    :key="scope.row.customerId"
                    :label="scope.row"
                    class="check_single"
                  ></el-checkbox>
                  <div class="client_msg">
                    <div class="client_img">
                      <img
                        :src="formatPicImage(scope.row.headPortrait, 'style', 40, 'someone', scope.row.sex)"
                      />
                      <img
                        class="sex_icon"
                        v-if="scope.row.sex == '女'"
                        src="@/assets/img/female_tip.png"
                      />
                      <img
                        class="sex_icon"
                        v-else-if="scope.row.sex == '男'"
                        src="@/assets/img/male_tip.png"
                      />
                    </div>
                    <div class="client_info">
                      <p>{{scope.row.customerName}}</p>
                      <!-- 标签需求变更为单独设置一列 -->
                      <!-- <span v-if='scope.row.tags.length>1' class="text-overflow">{{scope.row.tags|tagsFilter}}</span><span v-if='scope.row.tags.length>1'>...</span> -->

                      <span>
                        <span class="send-type-tags">{{scope.row.levelName}}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="telephone" align="left" label="手机号"></el-table-column>
            <el-table-column prop="birthDay" align="left" label="生日"></el-table-column>
            <el-table-column prop="createDate" show-overflow-tooltip align="left" label="录入时间"></el-table-column>
            <!-- <el-table-column prop="customerType" align="left" label="客户身份">
            </el-table-column>-->
            <el-table-column prop="resource" align="left" width="120" label="客户来源"></el-table-column>
            <el-table-column prop="firstSpendDate" align="left" width="120" label="首次消费时间"></el-table-column>
            <!-- <el-table-column align="left" label="累计消费">
              <template slot-scope="scope">
                {{ scope.row.totalCostTimes || 0 }} 次/ {{ scope.row.totalCostAmount ||
                0 }} 元
              </template>
            </el-table-column>-->
            <!-- <el-table-column align="left" label="本年消费">
              <template slot-scope="scope">
                {{scope.row.thisYearCostTimes || 0}}次/{{scope.row.thisYearCostAmount ||
                0}}元
              </template>
            </el-table-column>
            <el-table-column align="left" width="70" label="客单价">
              <template slot-scope="scope">
                {{scope.row.price || 0}}元
              </template>
            </el-table-column>
            <el-table-column align="left" label="会员卡余额">
              <template slot-scope="scope">
                {{scope.row.memberCardRest || 0}}元
              </template>
            </el-table-column>
            <el-table-column align="left" label="积分">
              <template slot-scope="scope">
                {{scope.row.integral || 0}}
              </template>
            </el-table-column>-->
            <el-table-column align="left" prop="belongStoreName" label="归属门店"></el-table-column>
            <el-table-column align="left" width="80" prop="serverName" label="服务者"></el-table-column>
            <el-table-column align="left" label="消费周期">
              <template slot-scope="scope">{{scope.row.consumptionCycle || 0}}天</template>
            </el-table-column>
            <!-- 门店客户标签 -->
            <el-table-column label="标签">
              <template slot-scope="scope">
                <div class="customer-tag-container">
                  <span
                    class="customer-tag"
                    v-for="item in scope.row.tags"
                    :key="item.id"
                  >{{item.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left" prop="lastServiceTime" label="上次服务时间"></el-table-column>

            <!-- 备注 门店端才有 -->
            <el-table-column align="left" v-if="currentEntry==='shop'" label="备注" width="120" class>
              <template slot-scope="scope">
                <span
                  :title="scope.row.remark"
                  v-if="scope.row.remark.length<=6"
                >{{scope.row.remark}}</span>
                <el-popover v-else placement="bottom-start" width="200" trigger="hover">
                  <p class="pop-p">{{scope.row.remark}}</p>
                  <span class="one-line" slot="reference">{{cutStr(scope.row.remark)}}</span>
                </el-popover>
                <i
                  class="icon iconfont icon-icon_operate_edit edit-icon"
                  v-if="checkHasBtnPermission('shop_customer_mark')"
                  @click="updateRemark(scope.row)"
                ></i>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              label="操作"
              width="180px"
              v-if="checkHasBtnPermission(`/${currentEntry}-inner/customerRecord`,'path')"
            >
              <template slot-scope="scope">
                <g-button
                  :name="'档案'"
                  title="美丽档案"
                  :type="'green'"
                  :icon="'icon_operate_file'"
                  @click="lookRecord(scope.row.customerId)"
                ></g-button>
                <!-- <g-button
                  :name="''"
                  title="发短信"
                  type="detail"
                  :icon="'icon_operate_msg'"
                  @click="sendMessage(scope.row.remark)"
                ></g-button>-->
                <g-button
                  :name="'开单'"
                  :title="'开单'"
                  type="open-bill"
                  :icon="'icon_operate_bill'"
                  @click="openBill(scope.row)"
                  v-if="checkHasBtnPermission(`${currentEntry}_customer_addBill`) && currentEntry === 'shop'"
                ></g-button>
              </template>
            </el-table-column>
          </el-table>
        </el-checkbox-group>
        <div class="bottom-btns">
          <!-- 按钮以及全选 -->
          <div class="oper_btns" v-if="currentEntry === 'shop'">
            <el-checkbox
              v-if="checkHasBtnPermission(`${currentEntry}_customer_mark`)"
              class="all_check"
              v-model="checkAllFlag"
              @change="checkAll"
            >全选</el-checkbox>
            <add-tags-pop
              ref="addTag"
              :addNewTagPopVisible="addNewTagPopVisible"
              :availableTags="availableTags"
              @close="addNewTagPopVisible=false"
              @delTags="delTags"
              @addNewTagFn="addNewTagFn"
              @confirmAddTagToService="confirmAddTagToService"
              @makeTag="makeTag"
              v-show="checkHasBtnPermission(`${currentEntry}_customer_mark`)"
            ></add-tags-pop>
            <!-- <g-button
              :name="'发短信'"
              :type="'detail'"
              :icon="'icon_operate_msg'"
              @click="sendMessage"
              class="send_SMS_btn"
            ></g-button>-->

            <!-- 更改服务者 暂时不支持批量操作 -->
            <!-- <el-popover placement="top" trigger="manual" v-model="dialogVisibleUpdateServicer">
              <div class="change-body">
                <h3>更改服务者</h3>
                <el-form ref="updateServicerForm">
                  <el-form-item label="服务者:" :label-width="formLabelWidth">
                    <el-select v-model="updateServicerForm.servicer">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="item in serverlist"
                        :key="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <el-row type="flex" justify="end">
                  <el-button @click="dialogVisibleUpdateServicer = false" size="mini">取 消</el-button>
                  <el-button type="primary" @click="changeSever" size="mini">确 定</el-button>
                </el-row>
              </div>
              <g-button
                slot="reference"
                :name="'更改服务者'"
                :type="'lgreyFill'"
                :icon="'icon_operate_edit'"
                @click="updateServicer"
                class="change-s_btn"
                v-show="checkHasBtnPermission(`${currentEntry}_customer_changeServer`)"
              ></g-button>
            </el-popover>-->

            <!-- <el-button class="oper_btn" @click="sendMessage">发短信</el-button>
            <el-button class="oper_btn" @click="updateServicer">更改服务者</el-button>-->
          </div>
          <!-- 布局用的 -->
          <div class="flex-empty-box" v-else></div>
          <!-- 分页 -->
          <el-pagination
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pages.currentPage"
            :page-size="pages.pageSize"
            :pager-count="5"
            layout="total, prev, pager, next, jumper"
            :total="pages.totalCount"
          ></el-pagination>
        </div>
      </div>
      <!-- 修改备注 弹框 -->
      <el-dialog
        title="修改备注"
        center
        :closeOnClickModal="false"
        :visible.sync="dialogVisibleUpdateRemark"
        width="30%"
      >
        <el-input type="textarea" v-model="commont" maxlength="150" :rows="4"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleUpdateRemark = false">取 消</el-button>
          <el-button type="primary" @click="changeRemark">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 更改服务者 弹框 -->
      <!-- 发送短信 弹框 -->
      <el-dialog
        title="发送短信"
        center
        :closeOnClickModal="false"
        :visible.sync="dialogVisibleSendMessage"
      >
        <el-form :model="sendMessageForm" ref="sendMessageForm">
          <el-form-item label="选择模版:" placeholder="“请选择短信模版”" :label-width="formLabelWidth">
            <el-select v-model="sendMessageForm.module">
              <el-option label="模版一" value="1"></el-option>
              <el-option label="模版二" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="自定义:" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              v-model="sendMessageForm.self"
              placeholder="自定义"
              maxlength="150"
              :rows="4"
            ></el-input>
            <p>说明：自定义内容需要审核通过才能发送，需1-3个工作日。</p>
          </el-form-item>
          <el-form-item label="发送时间:" :label-width="formLabelWidth">
            <el-radio-group v-model="sendMessageForm.time">
              <el-radio :label="1">立即发送</el-radio>
              <el-radio :label="2">
                指定时间：
                <el-date-picker
                  v-model="sendMessageForm.timeValue"
                  type="datetime"
                  placeholder="选择日期时间"
                ></el-date-picker>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleSendMessage = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisibleSendMessage = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 新增客户 弹框 -->
      <el-dialog
        :closeOnClickModal="false"
        :before-close="dialogFormVisibleMethod"
        title="新增客户"
        :visible.sync="dialogFormVisible"
        class="add_dialog"
        width="800px"
      >
        <div class="add_area">
          <el-form
            :model="addForm"
            class="add_customer_form"
            :rules="rules"
            ref="addCustomerForm"
            v-loading="dialogLoading"
          >
            <el-form-item label="手机号:" :label-width="formLabelWidth" prop="phone">
              <!-- <el-input
                placeholder="请输入客户手机号"
                maxlength="11"
                autocomplete="off"
                :disabled="formDisabled"
                v-model="addForm.phone"
                @change="checkoutIsExist"
              ></el-input>-->
              <div class="el-input customer-add-input-box">
                <input
                  type="text"
                  placeholder="请输入客户手机号"
                  v-model.number="addForm.phone"
                  @keyup="checkoutIsExist"
                  maxlength="11"
                />
              </div>
            </el-form-item>
            <el-form-item label="备注昵称:" :label-width="formLabelWidth" prop="nickname">
              <el-input
                v-model="addForm.nickname"
                autocomplete="off"
                placeholder="请输入客户备注昵称"
                maxlength="16"
                :disabled="formDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="客户姓名:" :label-width="formLabelWidth" prop="name">
              <el-input
                :disabled="formDisabled"
                v-model="addForm.name"
                autocomplete="off"
                placeholder="请输入客户姓名"
                maxlength="16"
              ></el-input>
            </el-form-item>
            <el-form-item label="微信号:" :label-width="formLabelWidth" prop="weixin">
              <el-input
                :disabled="formDisabled"
                v-model="addForm.weixin"
                autocomplete="off"
                :maxlength="20"
                :minlength="6"
                placeholder="请输入客户微信号"
              ></el-input>
            </el-form-item>
            <el-form-item label="性别:" :label-width="formLabelWidth" prop="sex">
              <el-select :disabled="formDisabled" v-model="addForm.sex" placeholder="请选择性别">
                <el-option label="女" value="女"></el-option>
                <el-option label="男" value="男"></el-option>
                <el-option label="保密" value="保密"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生日:" :label-width="formLabelWidth">
              <el-date-picker
                :disabled="formDisabled"
                v-model="addForm.birth"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="请选择日期"
                :picker-options="pickerOptions"
                :clearable="false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="归属门店:" :label-width="formLabelWidth">
              <el-input :value="addForm.shop?addForm.shop:currentInfo.shopName" disabled></el-input>
            </el-form-item>
            <el-form-item label="服务者:" :label-width="formLabelWidth">
              <el-select v-if="!formDisabled" v-model="addForm.servicer" placeholder="请选择服务者">
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="item in staffList"
                  :key="item.id"
                ></el-option>
              </el-select>
              <el-input v-else v-model="addForm.technicianName" disabled></el-input>
            </el-form-item>
            <el-form-item label="客户来源" :label-width="formLabelWidth">
              <el-select v-model="addForm.source">
                <el-option
                  v-for="item in sourceList.slice(1)"
                  :label="item.name"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消费周期:" :label-width="formLabelWidth" prop="cycle">
              <!--              <el-input-->
              <!--                :disabled="formDisabled"-->
              <!--                v-model="addForm.weixin"-->
              <!--                autocomplete="off"-->
              <!--                :maxlength="20"-->
              <!--                :minlength="6"-->
              <!--                placeholder="请输入客户消费周期"-->
              <!--                class="el-input&#45;&#45;cycle"-->
              <!--              ></el-input>-->
              <div class="el-input customer-add-input-box">
                <span class="cycle-span">天</span>
                <input type="text" placeholder="请输入客户消费周期" v-model.number="addForm.cycle" />
              </div>
            </el-form-item>
            <el-form-item
              label="备注:"
              :label-width="formLabelWidth"
              class="desc_item"
              style="width:450px"
            >
              <input-with-count
                v-model="addForm.desc"
                :length="150"
                placeholder="请输入备注内容"
                :autosize="{ minRows: 5, maxRows: 100}"
              ></input-with-count>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button plain class="plain_gray_btn" @click="dialogRest">重置</el-button>
          <el-button plain class="plain_gray_btn" @click="dialogFormVisibleMethod">取消</el-button>
          <el-button
            class="normal_blue_btn"
            @click="submitForm('addCustomerForm')"
            :loading="btnLoad"
          >保存</el-button>
        </div>
      </el-dialog>
      <v-choose-order
        v-if="showChooseDialog"
        @close="showChooseDialog=false"
        @reBilling="reBilling"
        :unServicedOrderLists="unServicedOrderLists"
        origin="customerList"
      ></v-choose-order>
      <g-del-model
        :delTagDialogVisible="delTagDialogVisible"
        @close="delTagDialogVisible=false"
        @confirm="confirmDelTag"
        :title="'确定要删除吗？'"
        :content="'删除后，所有使用该标签的客户都不再显示该标签，不可恢复。'"
        :icon="'icon_popup_question'"
        :iconColor="'#FF6D61'"
      ></g-del-model>
      <!-- 不能更改服务者模态框 -->
      <g-del-model
        :delTagDialogVisible="upServiceBox"
        @close="upServiceBox=false"
        @confirm="upServiceBox=false"
        :title="'不可更改！'"
        :content="'当前门店不是该客户的录入门店，没有更改服务者权限。'"
        :icon="'icon_popup_question'"
        :iconColor="'#FF6D61'"
      ></g-del-model>
    </div>
  </div>
</template>

<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import util from "@/util/base.js";
import * as datas from "@/assets/js/datas";
import SubHeader from "@/components/common/SubHeader";
import { reg, checkReg } from "@/assets/js/RegExp";
import "@/assets/css/tab.scss";
import { mapActions, mapState } from "vuex";
import ChooseOrder from "@/pages/appointment/ChooseOrder";
import addTagsPop from "@/components/common/addTagsPop";
import { parse } from "querystring";
import { setTimeout } from "timers";
export default {
  name: "GmCustomerList",
  components: {
    "v-choose-order": ChooseOrder,
    "add-tags-pop": addTagsPop,
    "sub-header": SubHeader
  },
  data() {
    let validateWeixin = (rule, value, callback) => {
      if (value.length > 0) {
        if (checkReg(reg["weixin"], value)) {
          callback();
        } else {
          callback(new Error("请输入正确的微信号!"));
        }
      } else {
        callback();
      }
    };
    let phoneValidator = (rule, value, callback) => {
      if (`${value}`.length !== 11 || !checkReg(reg["phone"], value)) {
        callback(new Error("请输入正确格式的手机号码"));
        return;
      }
      callback();
    };
    let phoneValidatorChange = (rule, value, callback) => {
      if (`${value}`.length === 11) {
        if (!checkReg(reg["phone"], value)) {
          callback(new Error("请输入正确格式的手机号码"));
        } else {
          callback();
        }
        return;
      }
      callback();
    };
    return {
      addForm: {
        source: 1, // 客户来源
        phone: "", // 手机号
        name: "", // 客户姓名
        nickname: "", // 备注名
        weixin: "", // 微信号
        sex: "", // 性别
        birth: "", // 生日
        shop: "", // 归属门店
        servicer: "", // 服务者
        desc: "", // 备注
        cycle: ""
      },
      shopList: [], // 我的店铺列表
      staffList: [], // 获取门店员工列表，服务者
      formLabelWidth: "120px",
      rules: {
        phone: [
          {
            required: true,
            validator: phoneValidatorChange,
            trigger: "change"
          },
          { required: true, validator: phoneValidator, trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入客户姓名", trigger: "blur" },
          { required: true, message: "请输入客户姓名", trigger: "change" }
        ],
        nickname: [
          { required: true, message: "请输入客户备注昵称", trigger: "blur" },
          { required: true, message: "请输入客户备注昵称", trigger: "change" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        weixin: [
          {
            required: false,
            message: "请输入正确的微信号！",
            validator: validateWeixin,
            trigger: "blur"
          },
          {
            required: false,
            message: "请输入正确的微信号！",
            validator: validateWeixin,
            trigger: "change"
          }
        ]
      },
      formDisabled: false,
      dialogFormVisible: false,
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      //修改备注
      dialogVisibleUpdateRemark: false,
      commont: "",
      currentId: null,
      // 更改服务者
      dialogVisibleUpdateServicer: false,
      addNewTagPopVisible: false,
      availableTags: {
        platformServiceTagInfos: [],
        storeServiceTagInfos: []
      },
      updateServicerForm: {
        servicer: null
      },
      // 发短信
      dialogVisibleSendMessage: false,
      sendMessageForm: {
        module: "",
        self: "",
        time: "",
        timeValue: ""
      },
      // 打标签
      checkedTags: [],
      newTag: "",
      checkAllFlag: false,
      checkArr: [],
      isCheckedAll: false,
      CheckedAllArr: [],
      tag: "a",
      showTag: true,
      form: {
        server: null,
        source: null,
        lastServiceInTime: null,
        serviceTimesCount: null,
        totalCount: null,
        averagePrice: null,
        integral: null,
        growthScore: null,
        cardRest: null,
        serviceCycle: null,
        tag: null,
        memberLevel: "全部"
      },
      tabCondition: "ALL",
      selectStatus: [
        { code: "ALL", value: "全部" },
        // { code: "TOP_100", value: "TOP100" },
        // { code: "INACTION", value: "静止客" },
        { code: "HAD_CARD", value: "持卡会员" },
        { code: "NO_CARD", value: "普通会员" },
        { code: "NOT_CONSUMED", value: "未消费者" },
        { code: "FEMALE", value: "女性顾客" }
        // { code: "HIGH_AVERAGE_PRICE", value: "高客单价" }
      ],
      pages: {
        // 页面默认数据初始化
        currentPage: 1, // 当前页面
        totalCount: 0, // 总页面
        pageSize: 20, // 每页的条数
        pageNum: 5 // 默认显示页面的下标数量
      },
      tableData: [],
      showChooseDialog: false, //选择订单页面是否显示
      unServicedOrderLists: [], //未服务订单
      delTagDialogVisible: false,
      tagToDelId: null,
      customerTags: [],
      serverlist: [],
      sourceList: [], // 客户来源
      memberLevelList: [],
      keyword: "",
      noData: false,
      upServiceBox: false,
      tableLoading: false,
      dialogLoading: false, // 新增客户的
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      btnLoad: false
    };
  },
  computed: {
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry
    }),
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    operate() {
      return this.$store.state.manage.operate;
    },
    iDdata() {
      let arr = [];
      if (this.checkArr) {
        this.checkArr.forEach(item => {
          arr.push(item.customerId);
        });
      }
      return arr;
    }
  },
  created() {
    // 一次性的快速创建客户-from 操作台
    if (this.currentInfo.newCustomer) {
      this.saveCurrentInfo({ newCustomer: false });
      this.dialogFormVisible = true;
    }
  },
  mounted() {
    this.init();
    this.$root.$on("needRefreshPage", data => {
      this.getCustomer();
    });
  },
  methods: {
    ...mapActions([
      "saveCustomerInfo",
      "setBillOrigin",
      "beautyRecordId",
      "saveCurrentInfo",
      "setIsCount",
      "clearBillInfo"
    ]),
    // 新增客户表单提交
    submitForm(formName) {
      let form = this.addForm;
      let params = {
        customerName: form.name,
        nickName: form.nickname,
        telephone: form.phone,
        weChat: form.weixin,
        sex: form.sex,
        birthDay: form.birth,
        technician: form.servicer,
        remark: form.desc,
        source: form.source,
        consumptionCycle: form.cycle,
        shopId: this.currentInfo.shopId
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoad = true;
          axios
            .post(`/addCustomer`, params)
            .then(res => {
              this.btnLoad = false;
              this.addCustomerRes(res);
            })
            .catch(err => {
              this.btnLoad = false;
            });
          this.tableLoading = true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetFields() {
      this.$refs.addCustomerForm.resetFields();
      this.formDisabled = false;
      this.addForm = {
        source: 1,
        phone: "", // 手机号
        name: "", // 客户姓名
        nickname: "", // 备注名
        weixin: "", // 微信号
        sex: "", // 性别
        birth: "", // 生日
        shop: this.currentInfo.shopName, // 归属门店
        servicer: "", // 服务者
        desc: "" // 备注
      };
    },
    addCustomerRes(data) {
      this.resetFields();
      this.dialogFormVisible = false;
      setTimeout(() => {
        this.pages.currentPage = 1;
        this.getCustomer();
      }, 200);
      // 提示
      utils.showTip(this, {
        msg: data.message,
        type: data.success ? "success" : "error"
      });
    },
    addNewCustomer() {
      this.dialogFormVisible = true;
    },
    // search: util.debounce(function(text) {
    //   // this.tabCondition = "ALL";
    //   // this.clearForm();
    //   this.keyword = text[0];
    //   this.noData = true;
    //   this.getCustomer();
    // }),
    searchData(data) {
      // this.clearForm();
      // this.tabCondition = "ALL";
      this.keyword = data;
      this.noData = true;
      this.pages.currentPage = 1;
      this.getCustomer();
    },
    /**
     * 新增客户取消操作
     */
    dialogFormVisibleMethod() {
      this.dialogFormVisible = false;
      this.resetFields();
    },
    dialogRest() {
      this.resetFields();
    },
    // 初始化数据
    init() {
      this.getCustomerFilter();
      this.pages.currentPage = 1;
      this.getCustomer();
      this.getHeadTagInfoAndCount();
    },
    /**
     * 获取下拉服务者列表, 客户来源
     */
    getCustomerFilter() {
      axios
        .get(`/getSimpleStaffListByShopId/${this.currentInfo.shopId}`)
        .then(res => {
          this.staffList = res.staffList;
        });
      axios
        .get(`/getStoreCustomerListFilter/${this.currentInfo.shopId}`)
        .then(res => {
          res.servers.forEach(item => {
            this.serverlist.push(item);
          });
          res.memberLevels.forEach(item => {
            this.memberLevelList.push(item);
          });
          res.sources.forEach(item => {
            this.sourceList.push(item);
          });
        });
    },
    getHeadTagInfoAndCount() {
      axios
        .post(`/getHeadTagInfoAndCount`, { storeId: this.currentInfo.shopId })
        .then(res => {
          this.customerTags = res.customerTagInfos;
          // console.log(this.customerTags)
        });
    },
    // 获取客户列表信息
    getCustomer() {
      this.tableLoading = true;
      let send = this.form;
      let averagePrice = !send.averagePrice
        ? send.averagePrice
        : {
            from: send.averagePrice,
            to: 0
          };
      let cardRest = !send.cardRest
        ? send.cardRest
        : {
            from: send.cardRest,
            to: 0
          };
      let growthScore = !send.growthScore
        ? send.growthScore
        : {
            from: send.growthScore,
            to: 0
          };
      let integral = !send.integral
        ? send.integral
        : {
            from: send.integral,
            to: 0
          };
      let lastServiceInTime = !send.lastServiceInTime
        ? send.lastServiceInTime
        : {
            from: send.lastServiceInTime,
            to: 0
          };
      let serviceCycle = !send.serviceCycle
        ? send.serviceCycle
        : {
            from: send.serviceCycle,
            to: 0
          };
      let serviceTimesCount = !send.serviceTimesCount
        ? send.serviceTimesCount
        : {
            from: send.serviceTimesCount,
            to: 0
          };
      let totalCount = !send.totalCount
        ? send.totalCount
        : {
            from: send.totalCount,
            to: 0
          };
      let params = {
        averagePrice: averagePrice,
        cardRest: cardRest,
        currentPage: this.pages.currentPage - 1,
        growthScore: growthScore,
        integral: integral,
        keyword: this.keyword,
        lastServiceInTime: lastServiceInTime,
        memberLevel: send.memberLevel,
        pageSize: this.pages.pageSize,
        server: send.server,
        serviceCycle: serviceCycle,
        serviceTimesCount: serviceTimesCount,
        source: send.source,
        storeId: this.currentInfo.shopId,
        tabCondition: this.tabCondition,
        tag: send.tag,
        totalCount: totalCount
      };
      // console.log(params, '积分')
      // 获取客户总列表
      this.tableData = [];
      axios
        .post(`/getCustomerList`, params)
        .then(res => {
          this.getCustomerListRes(res);
        })
        .catch(error => {
          this.tableLoading = false;
        });
    },
    // 处理客户总列表
    getCustomerListRes(res) {
      // 赋值
      this.tableData = res.customers;
      let path = {
        loading: "tableLoading", //loading名字
        time: 200 //时间
      };
      this.deplay(path);
      // 总页数
      this.pages.totalCount = res.total;
      // 全选设置
      this.setCheckedAllArr();
    },
    // 获取客户标签下的客户
    getTagCustomer() {
      // this.tabCondition = "ALL";
      // this.clearForm();
      this.pages.currentPage = 1;
      this.getCustomer();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // 赋值
      this.pages.currentPage = val;
      // 判断是否可调接口
      if (val > this.pages.totalCount || val <= 0) return;
      this.getCustomer();
    },
    // 全选/复选
    handleChecked() {
      // console.log(this.iDdata.length,this.tableData.length+':长度')
      this.isCheckedAll = this.checkArr.length == this.tableData.length;
      this.checkAllFlag = this.checkArr.length == this.tableData.length;
    },
    checkAll(event) {
      this.checkArr = this.checkAllFlag ? this.CheckedAllArr : [];
      // console.log(this.checkArr, 'ASDSD')
    },
    setCheckedAllArr() {
      this.checkAllFlag = false; // 清理全选标记
      this.CheckedAllArr = []; // 清理备选数组
      this.checkArr = []; // 清理选中的项目
      let arr = [];
      this.tableData.forEach((item, index) => {
        this.CheckedAllArr.push(item);
      });
    },
    // 修改备注
    updateRemark(data) {
      this.commont = data.remark;
      this.currentId = data.customerId;
      this.dialogVisibleUpdateRemark = true;
    },
    // 修改服务者
    updateServicer() {
      if (this.checkArr.length === 0) {
        utils.showTip(this, { msg: "请选择一个客户", type: "warning" });
      } else {
        if (this.checkArr.length > 1) {
          utils.showTip(this, { msg: "最多只能选择一个客户", type: "warning" });
        } else {
          this.updateServicerForm.servicer = this.checkArr[0].servicerId;
          this.currentInfo.shopId === this.checkArr[0].belongStoreId
            ? this.upService()
            : (this.upServiceBox = true);
        }
      }
    },
    upService() {
      this.dialogVisibleUpdateServicer = true;
    },
    /**确认修改服务者 */
    changeSever() {
      if (!this.updateServicerForm.servicer) {
        utils.showTip(this, { msg: "请选择服务者", type: "error" });
      } else {
        this.dialogVisibleUpdateServicer = false;
        axios
          .put(`/changeCutomerBelongServer`, {
            customerId: this.checkArr[0].customerId,
            staffId: this.updateServicerForm.servicer
          })
          .then(res => {
            if (res.success) {
              this.getCustomer();
              utils.showTip(this, { msg: res.message, type: "success" });
            }
          });
      }
    },
    // 发送短信
    sendMessage() {
      this.dialogVisibleSendMessage = true;
    },
    // 确认修改备注
    changeRemark() {
      axios
        .post(`/updateCustomerRemark`, {
          id: this.currentId,
          remark: this.commont
        })
        .then(res => {
          this.updateCustomerRemarkRes(res);
        });
    },
    // 处理修改备注
    updateCustomerRemarkRes(res) {
      if (res.success) {
        // 赋值
        this.tableData.forEach((item, index) => {
          if (item.customerId === this.currentId) {
            this.tableData[index].remark = this.commont;
          }
        });
        // 提示
        utils.showTip(this, { msg: res.message, type: "success" });
      } else {
        utils.showTip(this, { msg: res.message, type: "success" });
      }
      this.dialogVisibleUpdateRemark = false;
    },
    lookRecord(id) {
      // this.beautyRecordId(id);
      // this.$router.push(`/${this.currentEntry}-inner/customerRecord`);

      // 新标签页打开
      this.toPagesInNewTags(`/shop-inner/customerRecord/${id}`);
    },
    openBill(data) {
      this.clearBillInfo();
      this.saveCurrentInfo({ cpLevelId: null });
      this.setIsCount(true); // - 设置计客数
      this.setBillOrigin("customerList"); /* 2.保存开单来源 */
      this.saveCustomerInfo({
        headPortrait: data.headPortrait,
        name: data.customerName,
        sex: data.sex,
        mobile: data.telephone,
        memberLevel: "",
        id: data.customerId
      });
      var params = {
        customerId: data.customerId,
        staffId: null,
        storeId: this.currentInfo.shopId,
        serviceOrderId: null
      };
      axios.post(`/getUnservicedOrderList`, params).then(res => {
        this.getUnservicedOrderListRes(res);
      });
    },
    getUnservicedOrderListRes(res) {
      if (res.orderList.length === 0) {
        this.$router.push("/shop-inner/choose-person");
      } else {
        this.unServicedOrderLists = res.orderList;
        this.showChooseDialog = true;
      }
    },
    reBilling() {
      this.showModifyDialog = false;
      this.showChooseDialog = false;
    },
    getStoreServiceTags() {
      this.getCustomerTagsByIdsAndStoreId();
    },
    getCustomerTagsByIdsAndStoreId() {
      axios
        .post(`/getCustomerTagsByIdsAndStoreId`, {
          idList: this.iDdata,
          storeId: this.currentInfo.shopId
        })
        .then(res => {
          this.getCustomerTagsByIdsAndStoreIdRes(res);
        });
    },
    getCustomerTagsByIdsAndStoreIdRes(res) {
      var platformCustomerTagInfos = [];
      var storeCustomerTagInfos = [];
      /* 此处为了数据统一，便于处理，名义不太符合语义 */
      res.customerTagInfos.forEach(item => {
        if (item.storeId) {
          storeCustomerTagInfos.push(item);
        } else {
          platformCustomerTagInfos.push(item);
        }
      });
      this.availableTags = {
        platformServiceTagInfos: platformCustomerTagInfos,
        storeServiceTagInfos: storeCustomerTagInfos
      };
      this.addNewTagPopVisible = true;
      // 处理二维数组 -begin
      let twoD = [];
      this.checkArr.map(i => {
        let arr = [];
        i.tags.map(t => arr.push(t.id));
        twoD.push(arr);
      });
      let publicTagIds = utils.publicIdsIn2dArray(twoD);
      // 处理二维数组 end
      setTimeout(() => {
        this.$refs.addTag.statisticsSelectedTagIds(publicTagIds);
      }, 10);
    },
    makeTag() {
      if (this.checkArr.length > 0) {
        this.getStoreServiceTags();
      } else {
        this.$message({
          type: "warning",
          message: "请先选择客户"
        });
      }
    },
    delTags(id) {
      this.tagToDelId = id;
      this.delTagDialogVisible = true;
      this.getHeadTagInfoAndCount();
    },
    addNewTagFn(addNewTag) {
      axios
        .post(`/addNewCustomerTag`, {
          name: addNewTag,
          storeId: this.currentInfo.shopId
        })
        .then(res => {
          this.addServiceTagRes(res);
        });
    },
    addServiceTagRes(res) {
      this.getCustomerTagsByIdsAndStoreId();
      this.getHeadTagInfoAndCount();
      this.addNewTag = "";
    },
    confirmAddTagToService(selectedAvailableTags, previousTagIds) {
      let params = this.checkArr.map(i => {
        let personTags = new Set((i.tags || []).map(t => t.id)); // 当前用户的所有标签
        previousTagIds.map(id => {
          personTags.delete(id); // 当前用户先去掉原始公共标签
        });
        let allTags = [
          ...new Set(selectedAvailableTags.concat([...personTags]))
        ];
        return {
          id: i.customerId,
          tagIds: allTags
        };
      });
      axios.post(`/batchSetCustomerTag`, { tagBeans: params }).then(res => {
        this.confirmAddTagToServiceRes(res);
      });
    },
    confirmAddTagToServiceRes(res) {
      if (res.success) {
        this.getHeadTagInfoAndCount();
        this.$message({ type: "success", message: "添加标签成功" });
        this.addNewTagPopVisible = false;
        this.checkArr = [];
        this.selectedAvailableTags = [];
        this.checkAllFlag = false;
        setTimeout(() => {
          this.tableLoading = true;
          this.getCustomer(); // es同步问题  不能马上请求数据
        }, 200);
      } else {
        this.$message({
          type: "error",
          message: res.message
        });
      }
    },
    confirmDelTag() {
      axios
        .del(`/deleteCustomerTag`, { data: { tagId: this.tagToDelId } })
        .then(res => {
          this.getHeadTagInfoAndCount();
          this.deleteCustomerTagRes(res);
        });
    },
    deleteCustomerTagRes(res) {
      this.delTagDialogVisible = false;
      this.addNewTagPopVisible = false;
      if (!res.success) {
        this.$message({ type: "warning", message: res.message });
      }
      // 删除标签成功需要重新拉取列表数据，清空筛选条件
      // this.getCustomerTagsByIdsAndStoreId();
      this.wulitucao();
    },
    cutStr(str) {
      return str.length <= 6 ? str : str.slice(0, 6) + "...";
    },
    /**清空条件 */
    clearForm() {
      this.$refs.form && this.$refs.form.resetFields();
    },
    tabGetCustomer() {
      // this.keyword = "";
      // this.form.tag = null;
      // if (this.showTag) {
      //   this.clearForm();
      // }
      this.pages.currentPage = 1;
      this.getCustomer();
    },
    showTaglist() {
      if (this.showTag) {
        this.$refs.form.resetFields();
      }
      this.showTag = !this.showTag;
    },
    clearBack() {
      this.noData = false;
      this.keyword = "";
      this.clearForm();
      this.pages.currentPage = 1;
      this.getCustomer();
    },
    searchTableData() {
      this.noData = true;
      this.pages.currentPage = 1;
      this.getCustomer();
    },
    wulitucao() {
      this.tabCondition = "ALL";
      this.form.tag = null;
      this.keyword = "";
      this.clearForm();
      this.pages.currentPage = 1;
      this.getCustomer();
    },
    checkoutIsExist: utils.debounce(function() {
      if (this.addForm.phone.toString().length === 11) {
        this.dialogLoading = true;
        let params = {
          brandId: this.currentInfo.brandId,
          mobile: this.addForm.phone,
          storeId: this.currentInfo.shopId
        };
        axios.post("/getCustomerInfoByMobile", params).then(res => {
          if (res.hit) {
            this.addForm = {
              phone: this.addForm.phone,
              name: res.customerName, // 客户姓名
              nickname: res.nickName, // 备注名
              weixin: res.weChat, // 微信号
              sex: res.sex, // 性别
              birth: res.birthDay, // 生日
              shop: res.belongStore, // 归属门店
              servicer: res.technician, // 服务者
              technicianName: res.technicianName, // 服务者
              desc: "" // 备注
            };
          } else {
            // 手机号得保留
            this.addForm.name = "";
            this.addForm.nickname = "";
            this.addForm.weixin = "";
            this.addForm.sex = "";
            this.addForm.birth = "";
            this.addForm.shop = "";
            this.addForm.servicer = "";
            this.addForm.technicianName = "";
          }
          this.formDisabled = res.hit;
          this.dialogLoading = false;
        });
      }
    }, 200)
  },
  filters: {
    tagsFilter(arr) {
      let info = arr.length ? arr[0].name : "暂无标签";
      return info;
    }
  },
  beforeDestroy() {
    this.$root.$off("needRefreshPage");
  }
};
</script>

<style lang="scss">
#gm_customer_list {
  .checkbox_area {
    .el-checkbox {
      width: 100px;
      margin-left: 20px;
      margin-bottom: 15px;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
#gm_customer_list .client_area {
  /deep/ .el-checkbox__label {
    display: none;
  }
}

.edit-icon {
  color: #58c9f3;
}
.list-box_table {
  min-height: calc(60vh - 60px);
}
.change-s_btn {
  &:hover {
    background-color: #edf0f5;
  }
  &:active {
    background-color: #e4e8ef;
  }
}
.send_SMS_btn {
  &:hover {
    background: #53bee6;
  }
  &:active {
    background-color: #54b1d3;
  }
}
.first-btn {
  padding: 9px 17px;
  &:hover {
    background-color: #e02047;
  }
  &:active {
    background-color: #d11d42;
  }
}
.wrap-head {
  margin: 20px;
}
.change-body {
  padding: 20px;
  h3 {
    padding-bottom: 20px;
  }
}
.query-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    width: 240px;
    margin-bottom: 10px;
  }
}
.color_blue {
  color: #409eff;
}
.color_green {
  color: #67c23a;
}
.cursor {
  cursor: pointer;
}
#gm_customer_list {
  .label_area_single label {
    width: 100px !important;
    text-align: right;
    display: inline-block;
  }
  .customer_list_condition {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  }
  .tag_list {
    min-height: 74px;
    display: flex;
    align-items: center;
    .radio_group {
      flex: 1;
      height: 50px;
      position: relative;
      .radio_group_common {
        height: 50px;
        overflow: hidden;
        &:hover {
          height: auto;
          overflow: auto;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 100;
          background: #fff;
          border-radius: 6px;
        }
      }
      .radio_group_common_list {
        box-sizing: border-box;
        height: 100%;
        padding-top: 10px;
        .el-radio-button {
          margin-bottom: 10px;
        }
      }
    }
    .condition_show {
      font-size: 14px;
      margin: 0 20px;
      margin-left: 116px;
      cursor: pointer;
      i {
        font-size: 14px;
        margin-left: 10px;
      }
    }
  }
  .bottom-btns {
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
    .oper_btns {
      display: flex;
      margin-bottom: 20px;
      .all_check {
        margin: 5px 20px 0 25px;
        font-size: 14px;
      }
    }
    .pagination {
      margin-bottom: 20px;
    }
    .pagination {
      margin-right: 15px;
    }
  }

  .client_area {
    display: flex;
    .check_single {
      margin: 0 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }
    .client_msg {
      display: flex;
      align-items: center;
      width: 80%;
      .client_img {
        margin-left: 5px;
        margin-right: 15px;
        position: relative;
      }
      .client_info {
        width: 95%;
        p {
          text-align: left;
          width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        vertical-align: middle;
      }
      .sex_icon {
        position: absolute;
        width: 14px;
        height: 14px;
        left: 22px;
        top: 0;
      }
    }
  }
  .checkbox_area {
    margin: 20px;
  }
}
.customerLabel {
  position: relative;
  .labelContainer {
    position: absolute;
  }
}
.query-parameter {
  display: flex;
  .left {
    flex: auto;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    .label_area_single {
      display: flex;
      align-items: center;
      width: 350px;
    }
  }
  .right {
    flex: 0 0 220px;
    border-left: 1px solid #f0f1f4;
    flex-flow: column nowrap;
    section {
      position: absolute;
      bottom: 0;
      left: 20px;
      cursor: pointer;
      span {
        color: #999999;
        font-size: 14px;
        margin-left: 10px;
      }
    }
  }
}
.one-line {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.pop-p {
  box-sizing: border-box;
  padding: 10px;
  word-break: break-all;
}
.table-con {
  margin-top: 20px;
  width: 100%;
  height: calc(100vh - 346px);
}
.text-overflow {
  border-radius: 17px;
  border: 1px solid rgba(206, 212, 218, 1);
  padding: 0 7px;
  font-size: 12px;
  margin-top: 2px;
}

.add_customer_form {
  .cycle-span {
    float: right;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #f5f7fa;
    border-left: 1px solid #dcdfe6;
  }
  /deep/ .el-input.el-input--cycle {
    display: block;
    width: auto;
    margin-right: 40px;
  }
}

.customer-add-input-box {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  input {
    display: block;
    height: 40px;
    line-height: 40px;
    outline: none;
    border: none;
    text-indent: 14px;
    color: #606266;
    font-size: inherit;
    &::placeholder {
      color: #bbb;
    }
  }
}
.send-type-tags {
  border-radius: 12px;
  padding: 2px 4px;
  font-size: 10px;
  border: 1px solid #b2bbdc;
  background: #b2bbdc;
  color: #fff;
}

.customer-tag-container {
  margin-right: -5px;
  line-height: normal;
}

.customer-tag {
  margin-right: 5px;
  margin-bottom: 5px;
  display: inline-block;
  padding: 2px 6px;
  font-size: 10px;
  border-radius: 12px;
  border: 1px solid #dee1e6;
}
</style>
