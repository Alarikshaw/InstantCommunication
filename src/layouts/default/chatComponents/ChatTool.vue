<template>
  <div class="tool">
    <div class="tool-avatar">
      <div
        class="tool-avatar-img"
        @click="showUserInfo()"
      >
        <img
          :src="state.avatar"
          alt=""
        >
      </div>
      <div class="tool-avatar-name">
        {{ state.user.username }}
      </div>
    </div>
    <Tooltip
      placement="topLeft"
      arrow-point-at-center
    >
      <template v-slot:title>
        <div>请文明聊天</div>
        <div>截图粘贴可发送图片</div>
      </template>
      <BulbOutlined
        class="icon tool-tip"
        :style="{fontSize: '32px'}"
      />
    </Tooltip>
    <SkinOutlined
      class="icon tool-skin"
      :style="{fontSize: '32px'}"
      @click="state.showBackgroundModal = true"
    />
    <a
      href="https://github.com/Alarikshaw"
      target="_blank"
    >
      <GithubOutlined
        class="icon tool-github"
        :style="{fontSize: '32px'}"
      />
    </a>
    <PoweroffOutlined
      class="icon tool-out"
      @click="handleLoginOut()"
      :style="{fontSize: '32px'}"
    />
    <Modal
      title="用户信息"
      :visible="state.showUserModal"
      footer=""
      @cancel="state.showUserModal = false"
    >
      <div class="tool-user">
        <div
          @mouseover="state.showUpload = true"
          @mouseleave="state.showUpload = false"
          class="tool-user-avatar"
          :class="{ active: state.showUpload || state.uploading }"
        >
          <Avatar
            :src="state.avatar"
            class="img"
            :size="120"
          ></Avatar>
          <Upload
            class="tool-user-upload"
            :show-upload-list="true"
            v-if="state.showUpload && !state.uploading"
            :withCredentials="true"
            :before-upload="beforeUpload"
          >
            <div class="text">
              <ToTopOutlined style="margin-right:4px" />
              <span>更换头像</span>
            </div>
          </Upload>
          <LoadingOutlined
            class="loading"
            v-if="state.uploading"
          />
        </div>
        <div class="tool-user-info">
          <div class="tool-user-title">
            更改用户名
          </div>
          <Input
            class="tool-user-input"
            placeholder="请输入用户名"
            v-model:value="userInfo.username"
          />
          <Button
            type="primary"
            @click="changeUserName"
          >确认</Button>
        </div>
        <div class="tool-user-info">
          <div class="tool-user-title">
            更改密码
          </div>
          <InputPassword
            class="tool-user-input"
            v-model:value="userInfo.password"
            placeholder="请输入密码"
          ></InputPassword>
          <Button
            type="primary"
            @click="changePassword"
          >确认</Button>
        </div>
      </div>
    </Modal>
    <Modal
      title="主题"
      :visible="state.showBackgroundModal"
      footer=""
      @cancel="state.showBackgroundModal = false"
    >
      <div class="tool-user-info">
        <div
          class="tool-user-title"
          style="width: 65px;"
        >
          <span>背景图</span>
          <Tooltip
            placement="topLeft"
            arrow-point-at-center
          >
            <template v-slot:title>
              <span>输入空格时为默认背景, 支持 jpg, png, gif等格式</span>
            </template>
            <ExclamationCircleOutlined style="margin-left: 5px;" />
          </Tooltip>
        </div>
        <Input
          v-model="state.background"
          class="tool-user-input"
          placeholder="请输入背景图片网址"
        />
        <Button
          type="primary"
          @click="changeBackground"
        >确认</Button>
      </div>
      <div class="tool-recommend">
        <div
          class="recommend"
          v-for="(item, index) in imgData"
          :key="index"
          @click="setBackground(item.src)"
        >
          <img
            :src="item.src"
            alt=""
          >
          <span class="text">{{ item.text }}</span>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUpdated,
  onUnmounted,
  reactive,
  onBeforeMount,
  unref,
} from 'vue';
import { Tooltip, Modal, Avatar, Upload, Input, Button } from 'ant-design-vue';
import {
  BulbOutlined,
  SkinOutlined,
  PoweroffOutlined,
  GithubOutlined,
  ToTopOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import { userStore } from '/@/store/modules/user';
import { getTokenState } from '/@/utils/auth';
import { useMessage } from '/@/hooks/web/useMessage';
import { patchUserName, setUserAvatar, patchPassword } from '/@/api/apis';
import { nameVerify } from '/@/utils/common';
import { imgList } from './imgData';
export default defineComponent({
  name: 'ChatTool',
  components: {
    Tooltip,
    Modal,
    Avatar,
    Upload,
    Input,
    Button,
    InputPassword: Input.Password,
    BulbOutlined,
    SkinOutlined,
    PoweroffOutlined,
    GithubOutlined,
    ToTopOutlined,
    LoadingOutlined,
    ExclamationCircleOutlined,
  },
  setup() {
    // 页面数据池
    const origin: any = {
      username: '',
      password: '',
      background: '',
      uploading: '',
      avatar: '',
      showUpload: false,
      showUserModal: false, // 修改用户信息弹框
      showBackgroundModal: false,
      user: {
        username: '',
        password: '',
      },
    };
    const imgData: any = reactive(imgList);
    // 用户信息池
    const userOrigin = {
      username: '',
      password: '',
    };
    let userInfo = reactive(userOrigin);
    const state = reactive(origin);
    const showUserInfo = () => {
      state.username = '';
      state.showUserModal = true;
    };
    // 提示信息
    const { createMessage } = useMessage();
    /**
     * 退出登录
     */
    function handleLoginOut() {
      userStore.confirmLoginOut();
    }
    // 上传图片(更新头像)
    async function handleUpload(file: any) {
      state.uploading = true;
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', state.user.userId);
      formData.append('password', state.user.password);
      let data = await setUserAvatar(formData, state.user);
      // code: 0 成功; 1 错误; 2 后端报错
      if (data!.data!.code === 0) {
        // 上传成功，替换图片，更新状态
        state.uploading = false;
        state.showUpload = false;
        createMessage.success(data.data.msg);
        let param = data.data.data;
        param.background = userStore.getUserInfoState.background;
        userStore.getUserInfoAction(param);
        state.avatar = data.data.data.avatar;
        // 通知其他用户个人信息改变
      } else {
        createMessage.error('更新失败！');
      }
    }
    /**
     * 上传更改头像
     */
    function beforeUpload(file: any) {
      const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg' ||
        file.type === 'image/gif';
      if (!isJpgOrPng) {
        return createMessage.error('请上传jpeg/jpg/png/gif格式的图片!');
      }
      const isLt1M = file.size / 1024 / 1024 < 0.5;
      if (!isLt1M) {
        return createMessage.error('图片必须小于500K!');
      }
      handleUpload(file);
    }
    // 修改用户名
    async function changeUserName() {
      if (!nameVerify(userInfo.username)) {
        return;
      }
      let param = unref({ ...state.user });
      param.username = userInfo.username;
      let updateName = await patchUserName(param);
      if (updateName?.data?.code === 0) {
        createMessage.success(updateName.data.msg);
        userStore.getUserInfoAction(updateName.data.data);
        state.user = updateName.data.data;
        userInfo.username = updateName.data.data.username;
      } else {
        createMessage.error('更新失败！');
      }
    }
    /**
     * 更新密码
     */
    async function changePassword() {
      if (!nameVerify(userInfo.password)) {
        return;
      }
      let param = unref({ ...state.user });
      let updateName = await patchPassword(param, userInfo.password);
      if (updateName?.data?.code === 0) {
        createMessage.success(updateName.data.msg);
        userStore.getUserInfoAction(updateName.data.data);
        state.user = updateName.data.data;
        userInfo.password = updateName.data.data.password;
      } else {
        createMessage.error('更新失败！');
      }
    }
    /**
     * 修改背景图
     */
    async function changeBackground() {
      state.showBackgroundModal = false;
    }
    async function setBackground(src: any) {
      let param = unref({ ...state.user });
      param.background = src;
      userStore.getUserInfoAction(param);
    }
    onBeforeMount(() => {});
    onMounted(() => {
      state.user = getTokenState();
      userInfo.username = getTokenState().username;
      userInfo.password = getTokenState().password;
      state.avatar = getTokenState().avatar;
    });
    onUpdated(() => {
      //   console.log('updated!');
    });
    onUnmounted(() => {
      //   console.log('unmounted!');
    });

    return {
      showUserInfo,
      handleLoginOut,
      state,
      beforeUpload,
      userInfo,
      changeUserName,
      changePassword,
      changeBackground,
      imgData,
      setBackground,
    };
  },
});
</script>

<style lang="less" scoped>
.tool {
  padding: 10px 5px;
  height: 98%;
  position: relative;
  .tool-avatar {
    margin-top: 3px;
    .tool-avatar-img {
      margin: 0 auto;
      width: 55px;
      height: 55px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .tool-avatar-name {
      color: #fff;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
      margin-top: 2px;
      text-align: center;
    }
  }
  .tool-tip {
    bottom: 190px;
  }
  .tool-skin {
    bottom: 130px;
  }
  .tool-github {
    color: rgba(255, 255, 255, 0.85);
    bottom: 70px;
  }
  .tool-out {
    bottom: 10px;
  }
  .icon {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 25px;
    font-size: 25px;
    cursor: pointer;
    z-index: 100;
    color: #fff;
    &:hover {
      color: skyblue;
    }
  }
}

.tool-user {
  text-align: center;
  font-size: 16px;
  .tool-user-avatar {
    position: relative;
    width: 120px;
    overflow: hidden;
    margin: 0 auto 24px;
    border-radius: 50%;
    cursor: pointer;
    .tool-user-upload {
      .text {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        line-height: 120px;
        font-weight: bold;
      }
    }
    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -18px 0 0 -18px;
      font-size: 35px;
      font-weight: bold;
      color: #fff;
    }
    .img {
      transition: 0.2s all linear;
    }
    &.active {
      .img {
        filter: blur(3px);
      }
    }
  }
}
.tool-user-info {
  display: flex;
  justify-content: left;
  align-items: center;
  .tool-user-input {
    flex: 1;
    margin-right: 5px;
  }
  .tool-user-title {
    display: flex;
    align-items: center;
    width: 90px;
    text-align: left;
    font-weight: bold;
    word-break: keep-all;
    margin-right: 15px;
  }
  &:nth-child(2) {
    margin-bottom: 15px;
  }
}

.tool-recommend {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  .recommend {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100px;
    height: 100px;
    margin: 15px 10px 0;
    overflow: hidden;
    cursor: pointer;
    transition: 0.3s all linear;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    span {
      position: absolute;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 600;
      transition: 0.3s all linear;
      opacity: 0;
    }
    &:hover {
      box-shadow: 1px 5px 10px gray;
      span {
        opacity: 1;
      }
    }
  }
}
</style>
