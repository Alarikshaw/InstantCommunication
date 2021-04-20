<template>
  <div class="search">
    <div class="search-select">
      <Select
        show-search
        placeholder="搜索聊天组"
        :show-arrow="false"
        :filter-option="false"
        :not-found-content="null"
        @search="handleSearch"
      >

      </Select>
      <Dropdown
        class="search-dropdown"
        placement="bottomCenter"
        :trigger="['click']"
      >
        <PlusCircleOutlined class="search-dropdown-button" />
        <template #overlay>
          <Menu
            selectable
            v-model="state.visibleAddGroup"
          >
            <MenuItem
              key="default"
              @click="() => (state.visibleAddGroup = !state.visibleAddGroup)"
            >
            <span>创建群</span>
            </MenuItem>
            <MenuItem key="middle"><span>搜索群</span></MenuItem>
            <MenuItem key="small"><span>搜索用户</span></MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </div>
    <Modal
      title="创建群"
      :visible="state.visibleAddGroup"
      footer=""
      @cancel="state.visibleAddGroup = false"
    >
      <div style="display: flex;">
        <Input
          v-model:value="state.groupName"
          placeholder="请输入群名字"
        />
        <Button
          @click="addGroup"
          type="primary"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { Select, Dropdown, Menu, Modal, Input, Button } from 'ant-design-vue';
import { PlusCircleOutlined } from '@ant-design/icons-vue';
import { nameVerify } from '/@/utils/common';
import { SocketIoLink } from '/@/utils/chat';
import { chatStore } from '/@/store/chat/chatStore';
export default defineComponent({
  name: 'ChatSearch',
  components: {
    Select,
    Dropdown,
    Menu,
    MenuItem: Menu.Item,
    Modal,
    Input,
    Button,
    PlusCircleOutlined,
  },
  setup() {
    const origin: any = {
      visibleAddGroup: false,
      visibleJoinGroup: false,
      visibleAddFriend: false,
      groupName: '',
      groupId: '',
      friendId: '',
      searchData: [],
      groupArr: [],
      userArr: [],
    };
    const state = reactive(origin);
    function handleSearch() {}
    /**
     * 创建群组
     */
    function addGroup() {
      state.visibleAddGroup = false;
      if (!nameVerify(state.groupName)) {
        state.visibleAddGroup = true;
        return;
      }
      SocketIoLink.SocketAddGroup(state.groupName);
      chatStore.doPublicBank(state.groupName);
      // 直接处理 创建接口
      //   state.groupName = '';
    }
    return {
      state,
      handleSearch,
      addGroup,
    };
  },
});
</script>

<style lang="less" scoped>
.search {
  position: relative;
  //   height: 60px;
  //   padding: 10px;
  display: flex;
  align-items: center;
  .search-select {
    width: 100%;
    .ant-select {
      width: 100%;
    }
  }
  .search-dropdown {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 40px;
    height: 32px;
    font-size: 20px;
    cursor: pointer;
    line-height: 39px;
    color: gray;
    transition: 0.2s all linear;
    border-radius: 4px;
    &:hover {
      background-color: skyblue;
    }
  }
}
</style>
