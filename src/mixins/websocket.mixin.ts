import { Vue, Component, Watch } from 'vue-property-decorator';
import { TOKEN_KEY } from '@common/constant/storage.constant';

export interface IReadState {
  key: number;
  value: string;
}
export interface ISocketMessage {
  event: string;
  data: any;
}
const readyStateArr: IReadState[] = [
  { key: 0, value: '正在连接中' },
  { key: 1, value: '已连接' },
  { key: 2, value: '连接已关闭' },
  { key: 3, value: '连接已关闭或未连接成功' },
];
@Component({})
export default class WebsocketMixin extends Vue {
  public socket: UniApp.SocketTask | null = null;
  public message: ISocketMessage | null = null;
  public readState: IReadState | null = null;
  public currentIsChatPage: boolean = false;

  created() {
    this.initWebsocket();
  }

  initWebsocket() {
    this.createSocket();
  }

  @Watch('readState')
  watchReadState(newState: IReadState) {
    if (newState.key === 3) {
      this.reconnect();
    }
  }

  createSocket() {
    try {
      this.socket = uni.connectSocket({
        url: 'ws://127.0.0.1:5001',
        success: () => {
          this.readState = readyStateArr[0];
        },
      });
      this.socket.onOpen(() => {
        this.readState = readyStateArr[1];
        this.authSocket();
      });
      this.socket.onClose(() => {
        this.readState = readyStateArr[2];
      });
      this.socket.onError(() => {
        this.readState = readyStateArr[3];
      });
      this.socket.onMessage((res) => {
        const msg: ISocketMessage = JSON.parse(typeof res.data === 'string' ? res.data : '');
        this.message = msg;
        this.watchMessage(msg);
      });
    } catch (err) {
      console.log(err);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  watchMessage(msg: ISocketMessage) {}

  close() {
    this.socket?.close({
      success: () => {
        this.readState = readyStateArr[2];
      },
    });
  }
  // 重连
  reconnect() {
    this.close();
    this.socket = null;
    this.readState = readyStateArr[2];
    this.createSocket();
  }
  // 鉴权
  authSocket() {
    this.sendMessage({
      event: 'auth',
      data: {
        token: uni.getStorageSync(TOKEN_KEY),
      },
    });
  }
  sendMessage(data: ISocketMessage) {
    this.socket?.send({
      data: JSON.stringify(data),
    });
  }

  destroyed() {
    this.socket?.close({});
  }
}
