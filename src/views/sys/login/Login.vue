<template>
  <div
    :class="prefixCls"
    class="relative w-full h-full px-4"
  >
    <div class="container relative h-full py-2 mx-auto sm:px-10">
      <div class="flex h-full">
        <div class="chat-login-auto-form h-full xl:h-auto flex py-5 xl:py-0 xl:my-0 w-full xl:w-6/12">
          <div class="chat-login-auto ">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';

import { AppLogo } from '/@/components/Application';
import LoginForm from './LoginForm.vue';

import { useGlobSetting } from '/@/hooks/setting';
import { useDesign } from '/@/hooks/web/useDesign';
import { localeStore } from '/@/store/modules/locale';

export default defineComponent({
  name: 'Login',
  components: {
    AppLogo,
    LoginForm,
  },
  setup() {
    const globSetting = useGlobSetting();
    const { prefixCls } = useDesign('login');

    return {
      prefixCls,
      title: computed(() => globSetting?.title ?? ''),
      showLocale: localeStore.getShowPicker,
    };
  },
});
</script>
<style lang="less">
@prefix-cls: ~'@{namespace}-login';
@logo-prefix-cls: ~'@{namespace}-app-logo';
@countdown-prefix-cls: ~'@{namespace}-countdown-input';

.@{prefix-cls} {
  //   @media (max-width: @screen-xl) {
  //     background: linear-gradient(180deg, #1c3faa, #1c3faa);
  //   }

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // margin-left: -48%;
    background-image: url(/@/assets/images/login-bg.jpg);
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    min-width: 1400px;
    min-height: 565px;
    content: '';
    // @media (max-width: @screen-xl) {
    //   display: none;
    // }
  }

  .@{logo-prefix-cls} {
    position: absolute;
    top: 12px;
    height: 30px;

    &__title {
      font-size: 16px;
      color: #fff;
    }

    img {
      width: 32px;
    }
  }

  .container {
    .@{logo-prefix-cls} {
      display: flex;
      width: 60%;
      height: 80px;

      &__title {
        font-size: 24px;
        color: #fff;
      }

      img {
        width: 48px;
      }
    }
  }

  &-sign-in-way {
    .anticon {
      font-size: 22px;
      color: #888;
      cursor: pointer;

      &:hover {
        color: @primary-color;
      }
    }
  }
  .@{countdown-prefix-cls} input {
    min-width: unset;
  }

  .ant-divider-inner-text {
    font-size: 12px;
    color: @text-color-secondary;
  }
}
.chat-login-auto-form {
  width: 100%;
  .chat-login-auto {
    width: 100%;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    .login-form {
      position: relative;
      bottom: 60px;
      width: 400px;
      background: padding-box rgb(255, 255, 255);
      border-width: 0px;
      border-radius: 10px;
      .login-form-content {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 20px 0px 40px;
        border: none;
        border-radius: 2px;
        .formTitle {
          display: flex;
          justify-content: center;
          align-items: center;
          h1 {
            margin-bottom: 0px;
            font-size: 24px;
            text-align: center;
          }
        }
        .login-tab {
          width: 80%;
          margin-left: auto;
          margin-right: auto;
          margin-top: 20px;
          display: flex;
          justify-content: center;
          .ant-tabs-content-animated {
            display: none;
          }
        }
        .chat-form {
          width: 80%;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
