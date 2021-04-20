export const SET_SOCKET = 'set_socket';
export const SET_DROPPED = 'set_dropped';
export const SET_ACTIVE_GROUP_USER = 'set_active_group_user';
export const SET_ACTIVE_ROOM = 'set_active_room';
export const SET_USER_GATHER = 'set_user_gather';
export const SET_FRIEND_GATHER = 'set_friend_gather';
export const SET_GROUP_GATHER = 'set_group_gather';
export const ADD_GROUP_MESSAGE = 'add_group_message';
export const SET_GROUP_MESSAGES = 'set_group_messages';
export const ADD_FRIEND_MESSAGE = 'add_friend_message';
export const SET_FRIEND_MESSAGES = 'set_friend_messages';
export const DEL_GROUP = 'del_group';
export const DEL_FRIEND = 'del_friend';
export const ADD_UNREAD_GATHER = 'set_unread_gather';
export const LOSE_UNREAD_GATHER = 'lose_unread_gather';

export interface ChatState {
  socket: SocketIOClient.Socket;
  dropped: boolean;
  activeGroupUser: ActiveGroupUser;
  activeRoom: (Group & Friend) | null;
  groupGather: GroupGather;
  userGather: FriendGather;
  friendGather: FriendGather;
  unReadGather: UnReadGather;
}

const chatState: ChatState = {
  // @ts-ignore
  socket: null,
  dropped: false,
  activeGroupUser: {},
  activeRoom: null,
  groupGather: {},
  userGather: {},
  friendGather: {},
  unReadGather: {},
};

export default chatState;

export interface AppState {
  user: User;
  token: string;
  mobile: boolean;
  background: string;
}

export interface ChatState {
  socket: SocketIOClient.Socket;
  dropped: boolean;
  activeGroupUser: ActiveGroupUser;
  activeRoom: (Group & Friend) | null;
  groupGather: GroupGather;
  userGather: FriendGather;
  friendGather: FriendGather;
  unReadGather: UnReadGather;
}

export type RootState = {
  app: AppState;
  chat: ChatState;
};
