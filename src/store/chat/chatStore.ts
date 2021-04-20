import store from '/@/store/index';
import io from 'socket.io-client';
import { setLocal, getLocal, setSession, getSession } from '/@/utils/helper/persistent';
import { CacheTypeEnum, USER_INFO_KEY, ROLES_KEY, TOKEN_KEY } from '/@/enums/cacheEnum';
import { useProjectSetting } from '/@/hooks/setting';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { VuexModule, Module, getModule, Mutation, Action } from 'vuex-module-decorators';
import { userStore } from '../modules/user';
const NAME = 'chat';
hotModuleUnregisterModule(NAME);
import { ChatState, RootState } from './mutation-types';
import { useMessage } from '/@/hooks/web/useMessage';
const { permissionCacheType } = useProjectSetting();
function setCache(USER_INFO_KEY: string, info: any) {
  if (!info) return;
  setLocal(USER_INFO_KEY, info, true);
  setSession(USER_INFO_KEY, info, true);
}
function getCache<T>(key: string) {
  const fn = permissionCacheType === CacheTypeEnum.LOCAL ? getLocal : getSession;
  return fn(key) as T;
}
@Module({ namespaced: true, name: NAME, dynamic: true, store })
class Chat extends VuexModule<ChatState, RootState> {
  /**
   * socket连接
   */
  @Action
  getSocketIO(): Promise<any> {
    let user = userStore.getUserInfoState;
    return new Promise((resolve) => {
      resolve(
        io.connect(`/?userId=${user.userId}`, {
          reconnection: true,
        })
      );
    });
  }
  /**
   * 初始化socket连接和监听socket事件
   */
  @Action
  async connectSocket() {
    console.log('------------');
    let user = userStore.getUserInfoState;
    let socket: SocketIOClient.Socket = io.connect(`/?userId=${user.userId}`, {
      reconnection: true,
    });
    console.log('userId', user.userId);
    console.log('socket', socket);
    socket.connected = true;
    socket.on('connect', async () => {
      console.log('连接成功');

      // 获取聊天室所需所有信息
      socket.emit('chatData', user);

      // 先保存好socket对象
      console.log('socket', socket);
    });
    // 初始化事件监听
    socket.on('activeGroupUser', (data: any) => {
      console.log('activeGroupUser', data);
    });

    socket.on('addGroup', (res: ServerRes) => {
      console.log('on addGroup', res);
    });

    socket.on('joinGroup', async (res: ServerRes) => {
      console.log('on joinGroup', res);
    });

    socket.on('joinGroupSocket', (res: ServerRes) => {
      console.log('on joinGroupSocket', res);
    });

    socket.on('groupMessage', (res: ServerRes) => {
      console.log('on groupMessage', res);
    });

    socket.on('addFriend', (res: ServerRes) => {
      console.log('on addFriend', res);
    });

    socket.on('joinFriendSocket', (res: ServerRes) => {
      console.log('on joinFriendSocket', res);
    });

    socket.on('friendMessage', (res: ServerRes) => {
      console.log('on friendMessage', res);
    });

    socket.on('chatData', (res: ServerRes) => {
      const { createMessage } = useMessage();
      if (res.code) {
        return createMessage.error(res.msg);
      }
      console.log('on chatData', res);
    });

    socket.on('exitGroup', (res: ServerRes) => {
      console.log('on exitGroup', res);
    });

    socket.on('exitFriend', (res: ServerRes) => {
      console.log('on exitFriend', res);
    });
    return socket;
  }

  @Action
  async doPublicBank(groupName: string) {
    let socket = await this.getSocketIO();
    socket.emit('addGroup', {
      userId: userStore.getUserInfoState.userId,
      groupName: groupName,
      createTime: new Date().valueOf(),
    });
  }
}
export const chatStore = getModule<Chat>(Chat);
