<template>
  <div class="login-form">
    <div class="login-form-content">
      <div class="formTitle">
        <h1>InstantCommunication</h1>
      </div>
      <Tabs
        @change="changeType"
        class="login-tab"
      >
        <TabPane
          key="login"
          tab="登录"
        > </TabPane>
        <TabPane
          key="register"
          tab="注册"
        > </TabPane>
      </Tabs>
      <Form
        class="p-4 enter-x chat-form"
        :model="state.formData"
        :rules="state.formRules"
        ref="formRef"
      >
        <FormItem
          name="userName"
          class="enter-x"
        >
          <Input
            size="large"
            visibilityToggle
            v-model:value="state.formData.userName"
            placeholder="userName"
          />
        </FormItem>
        <FormItem
          name="password"
          class="enter-x"
        >
          <InputPassword
            size="large"
            visibilityToggle
            v-model:value="state.formData.password"
            placeholder="password"
          />
        </FormItem>
        <FormItem class="enter-x">
          <Button
            type="primary"
            size="large"
            block
            @click="login"
            :loading="state.loading"
          >
            {{ state.btnText }}
          </Button>
        </FormItem>
      </Form>
    </div>
  </div>

</template>
<script lang="ts">
import { defineComponent, reactive, ref, unref } from 'vue';

import { Checkbox, Form, Input, Row, Col, Button, Divider, Tabs } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import {
  GithubFilled,
  WechatFilled,
  AlipayCircleFilled,
  GoogleCircleFilled,
  TwitterCircleFilled,
} from '@ant-design/icons-vue';

export default defineComponent({
  name: 'LoginForm',
  components: {
    [Col.name]: Col,
    [Row.name]: Row,
    Checkbox,
    Button,
    Form,
    FormItem: Form.Item,
    Input,
    Divider,
    InputPassword: Input.Password,
    Tabs,
    TabPane: Tabs.TabPane,
    GithubFilled,
    WechatFilled,
    AlipayCircleFilled,
    GoogleCircleFilled,
    TwitterCircleFilled,
  },
  setup() {
    const origin = {
      titleType: 'login', // 当前状态
      btnText: '登录', // 按钮相应文字
      formData: {
        userName: 'userName',
        password: '123456',
      }, // 表单数据
      loading: false, // 加载状态
      formRules: {
        userName: [{ required: true, message: '填写用户名', trigger: 'blur' }],
        password: [{ required: true, message: '输入密码', trigger: 'blur' }],
      }, // 表单校验
    };
    const state = reactive(origin);
    // 提示信息
    const { createMessage } = useMessage();
    async function changeType(type: string) {
      state.titleType = type;
      if (state.titleType === 'login') {
        state.btnText = '登录';
      } else if (state.titleType === 'register') {
        state.btnText = '注册';
      }
    }
    const formRef = ref<any>(null);
    const { notification } = useMessage();
    /**
     * 登录
     */
    async function handleLogin() {
      const form = unref(formRef);
      if (!form) return;
      let data = await form.validate();
      //   state.loading = true;
      if (state.titleType === 'register') {
        data.createTime = new Date().valueOf();
        try {
        } catch (e) {
          state.loading = false;
          return e;
        } finally {
          state.loading = false;
        }
        return false;
      } else {
        state.loading = false;
        try {
        } catch (error) {
        } finally {
          state.loading = false;
        }
      }
    }
    return {
      formRef,
      login: handleLogin,
      changeType,
      state,
    };
  },
});
</script>
