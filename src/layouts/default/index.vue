<template>
  <!-- <div>
        主体布局
        <button @click="handleLoginOut">退出</button>
    </div> -->
  <div
    class="chat"
    :style="{
      '--bg-image': `url('${imgSrc.src}')`,
    }"
  >
    <div class="chat-form1">
      <ChatTool></ChatTool>
    </div>
    <div class="chat-form2">
      <ChatSearch></ChatSearch>
    </div>
  </div>
  <img
    class="background"
    :src="imgSrc.src"
    alt=""
  />
</template>
<script lang="ts">
import { defineComponent, reactive, onBeforeMount, watch } from 'vue';
import { defaultImg } from './chatComponents/imgData';
import ChatTool from '/@/layouts/default/chatComponents/ChatTool.vue';
import ChatSearch from '/@/layouts/default/chatComponents/ChatSearch.vue';
import { getTokenState } from '/@/utils/auth';
import { userStore } from '/@/store/modules/user';
import { chatStore } from '/@/store/chat/chatStore';
export default defineComponent({
  components: {
    ChatTool,
    ChatSearch,
  },
  name: 'Chat',
  setup() {
    let imgSrc = reactive({
      src: '',
    });
    onBeforeMount(() => {
      if (getTokenState()?.background) {
        imgSrc.src = getTokenState().background;
      } else {
        imgSrc.src = defaultImg.src;
      }
    });
    chatStore.connectSocket();
    watch(
      () => userStore.getUserInfoState,
      (userInfo) => {
        imgSrc.src = userInfo.background;
      }
    );
    return {
      imgSrc,
    };
  },
});
</script>
<style lang="less" scoped>
.chat {
  font-size: 16px;
  z-index: 999;
  //   max-width: 1000px;
  min-width: 300px;
  width: 100%;
  height: 80%;
  //   max-height: 900px;
  min-height: 470px;
  position: relative;
  margin: auto 20px;
  box-shadow: 10px 20px 80px rgba(0, 0, 0, 0.8);
  display: flex;
  overflow: hidden;
  margin: 0;
  height: 100%;
  .chat-form1 {
    width: 100px;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.7);
  }
  .chat-form2 {
    width: 230px;
    padding: 10px;
  }
}
.background {
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
  min-width: 1100px;
}
</style>
