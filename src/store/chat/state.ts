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

export type RootState = {
  app: AppState;
  chat: ChatState;
};
