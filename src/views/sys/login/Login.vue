<template>
  <div
    class="init"
    v-if="state.isInit"
  >
    <div class="init-mask" />
    <div class="init-form-wrap">
      <div class="mx-6 init-form">
        <div class="px-2 py-10 init-form__content">
          <header>
            <h1>您需要初始化您的数据库并且填充初始数据</h1>
          </header>
          <Form
            class="mx-auto mt-10"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :model="state.initData"
            ref="formRef"
          >
            <FormItem
              name="mysql"
              label="数据库类型"
            >
              <Input
                size="large"
                disabled
                v-model:value="state.initData.mysql"
                placeholder="mysql"
              />
            </FormItem>
            <FormItem
              name="host"
              label="host"
            >
              <Input
                size="large"
                visibilityToggle
                v-model:value="state.initData.host"
                placeholder="host"
              />
            </FormItem>
            <FormItem
              name="port"
              label="port"
            >
              <Input
                size="large"
                visibilityToggle
                v-model:value="state.initData.port"
                placeholder="port"
              />
            </FormItem>
            <FormItem
              name="userName1"
              label="userName1"
            >
              <Input
                size="large"
                visibilityToggle
                v-model:value="state.initData.userName"
                placeholder="userName"
              />
            </FormItem>
            <FormItem
              name="password1"
              label="password1"
            >
              <InputPassword
                size="large"
                visibilityToggle
                v-model:value="state.initData.password"
                placeholder="password"
              />
            </FormItem>
            <FormItem
              name="dbName"
              label="dbName"
            >
              <Input
                size="large"
                visibilityToggle
                v-model:value="state.initData.dbName"
                placeholder="dbName"
              />
            </FormItem>
            <FormItem>
              <AButton
                type="primary"
                size="large"
                class="rounded-sm"
                :block="true"
                @click="clickLogin"
                :loading="state.loading"
              >{{ state.btnText }}</AButton>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>

  </div>
  <div
    class="login"
    v-if="!state.isInit"
  >
    <div class="login-modal">
      <div class="mx-6 login-form">
        <div class="px-2 py-10 login-content">
          <header>
            <h1>InstantCommunication</h1>
          </header>
          <div class="head-title">登录</div>
          <Form
            class="mx-auto mt-10"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :model="state.initData"
            ref="formRef"
          >
            <FormItem
              name="userName"
              label="userName"
            >
              <Input
                size="large"
                visibilityToggle
                v-model:value="state.initData.userName"
                placeholder="userName"
              />
            </FormItem>
            <FormItem
              name="password"
              label="password"
            >
              <InputPassword
                size="large"
                visibilityToggle
                v-model:value="state.initData.password"
                placeholder="password"
              />
            </FormItem>
            <FormItem
              name="captcha"
              label="请输入验证码"
            >
              <div class="vPic">
                <img
                  v-if="state.picPath"
                  :src="state.picPath"
                  width="100%"
                  height="100%"
                  alt="请输入验证码"
                  @click="loginVefify()"
                />
              </div>
            </FormItem>
            <FormItem>
              <AButton
                type="primary"
                size="large"
                class="rounded-sm"
                :block="true"
                @click="state.isInit=true"
                :loading="state.loading"
              >{{ state.btnText }}</AButton>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue';
import { Checkbox, Tabs, Form, Input, Select } from 'ant-design-vue';
import { useLoading } from '/@/components/Loading';
import { Button } from '/@/components/Button';
// import { BasicDragVerify, DragVerifyActionType } from '/@/components/Verify/index';
import { Checkdb, InitDB, captcha } from '/@/api';
// import { userStore } from '/@/store/modules/user';

// import { appStore } from '/@/store/modules/app';
import { useMessage } from '/@/hooks/web/useMessage';

export default defineComponent({
  components: {
    //  BasicDragVerify,
    AButton: Button,
    ACheckbox: Checkbox,
    Tabs,
    TabPane: Tabs.TabPane,
    Form,
    FormItem: Form.Item,
    Input,
    InputPassword: Input.Password,
    Select,
  },
  setup() {
    const origin = {
      btnText: '立即初始化', // 按钮相应文字
      initData: {
        mysql: 'mysql(目前只支持mysql)',
        host: '127.0.0.1',
        port: '3306',
        userName: 'root',
        password: '',
        dbName: 'gva-alarik',
      }, // 表单数据
      loading: false, // 加载状态
      isInit: false,
      loginData: {
        userName: 'admin',
        password: '123456',
        captcha: '',
        captchaId: '',
      },
      picPath: '',
    };
    const state = reactive(origin);
    const { createMessage } = useMessage();
    async function checketDB() {
      let checketInfo: ResponseParam = await Checkdb();
      console.log('checketInfo', checketInfo);
      if (checketInfo?.data?.needInit) {
        createMessage.warning('您是第一次使用，请初始化');
        state.btnText = '立即初始化';
        state.isInit = true;
      } else {
        state.btnText = '登录';
        state.isInit = false;
        loginVefify();
      }
    }

    const formRef = ref<any>(null);
    const [openFullLoading, closeFullLoading] = useLoading({
      tip: '正在初始化数据库，请稍候',
    });
    async function clickLogin() {
      openFullLoading();
      let initDB: ResponseParam = await InitDB(state.initData);
      console.log('isInit', initDB);
      closeFullLoading();
      if (initDB?.code === 0) {
        state.isInit = false;
        state.btnText = '登录';
        createMessage.success('自动创建数据库成功');
      } else {
        state.isInit = true;
        createMessage.warning('创建数据库失败，请联系作者！');
      }
    }
    async function loginVefify() {
      captcha().then((ele) => {

        if (ele?.data?.picPath && ele?.code === 0) {
          state.picPath = ele.data.picPath;
          state.loginData.captchaId = ele.data.captchaId;
        } else {
          createMessage.error('获取验证码失败，请联系作者！');
        }

        if ((ele && ele.data && ele.data.code) && (ele.data && ele.data.code)) {
          state.picPath = ele.data.picPath;
          state.loginData.captchaId = ele.data.captchaId;
        } else {
          createMessage.error('获取验证码失败，请联系作者！');
        }

      });
    }
    const initData = async () => {
      checketDB();
    };
    // 暴露给模板
    onMounted(() => {
      initData();
    });
    return {
      formRef,
      state,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      clickLogin,
      loginVefify,
    };
  },
});
</script>
<style lang="less">
@import (reference) '../../../design/index.less';

.init-form__locale {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 1;
}

.init {
  position: relative;
  height: 100vh;
  width: 100%;
  min-width: 1200px;
  background-size: 100% 100%;

  &-mask {
    display: none;
    height: 100%;
    //   background: url(../../../assets/images/init/init-in.png) no-repeat;
    background-position: 30% 30%;
    background-size: 80% 80%;

    .respond-to(xlarge, { display: block;});
  }

  &-form {
    position: relative;
    width: 700px;
    background: @white;
    //   border: 10px solid rgba(255, 255, 255, 0.5);

    border-width: 0;
    border-radius: 10px;
    background-clip: padding-box;
    // box-shadow: 0px 0px 5px 0px rgb(5 12 66 / 15%);
    box-shadow: 0px 0px 5px 0px #ccc;
    .respond-to(xlarge, { margin: 0 120px 0 50px});

    &-wrap {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      width: 100%;
      height: 100%;
      // height: 90%;
      justify-content: center;
      align-items: center;
      .respond-to(xlarge, {
        // justify-content: flex-end;
          });
    }

    &__content.py-10 {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 60px 0 0px 0;
      border: 1px solid #999;
      border: none;
      border-radius: 2px;
      padding-top: 20px;
      .init-tab {
        width: 80%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 20px;
      }
      header {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0 50px 0;

        img {
          display: inline-block;
          width: 48px;
        }

        h1 {
          margin-bottom: 0;
          font-size: 24px;
          text-align: center;
        }
      }

      form {
        width: 80%;
        margin-top: 10px;
        margin-bottom: 30px;
        > div {
          justify-content: center;
        }
      }
    }
  }
}
.login {
  position: relative;
  height: 100vh;
  width: 100%;
  min-width: 1200px;
  background: url(../../../assets/images/login/bannerimgs.jpg) no-repeat;
  background-size: 100% 100%;
  .login-modal {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    .login-form {
      position: relative;
      width: 400px;
      bottom: 60px;
      background: #fff;
      border-width: 0;
      border-radius: 10px;
      background-clip: padding-box;
      box-shadow: 0px 0px 5px 0px #ccc;
      .login-content {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 60px 0 0px 0;
        border: 1px solid #999;
        border: none;
        border-radius: 2px;
        padding-top: 20px;
        .init-tab {
          width: 80%;
          margin-left: auto;
          margin-right: auto;
          margin-top: 20px;
        }
        header {
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            display: inline-block;
            width: 48px;
          }

          h1 {
            margin-bottom: 0;
            font-size: 24px;
            text-align: center;
          }
        }
        .head-title {
          position: relative;
          display: inline-block;
          box-sizing: border-box;
          height: 100%;
          margin: 0 32px 0 0;
          padding: 12px 16px;
          text-decoration: none;
          //   cursor: pointer;
          transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          color: rgba(0, 0, 0, 0.85);
          &:hover {
            color: #40a9ff;
          }
        }

        form {
          width: 80%;
          margin-top: 10px;
          margin-bottom: 30px;
          > div {
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
