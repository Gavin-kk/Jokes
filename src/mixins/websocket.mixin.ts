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

let clientTimer: number | undefined;
let serverTimer: number | undefined;
// 重连定时器
let reconnectTimer: number | undefined;
// 重连次数
const reconnectCount: number = 10;
// 心跳检测超时时间
const timeout: number = 3000;

@Component({})
export default class WebsocketMixin extends Vue {
  public socket: UniApp.SocketTask | null = null;
  public message: ISocketMessage | null = null;
  public readState: IReadState | null = null;
  public isConnected: boolean = false;
  public isExit: boolean = false;

  initWebsocket() {
    this.createSocket();
  }

  createSocket() {
    if (this.isConnected) return;
    try {
      this.socket = uni.connectSocket({
        url: 'ws://127.0.0.1:5001',
        success: () => {
          this.readState = readyStateArr[0];
        },
      });
      this.socket.onOpen(() => this.onWebsocketOpen());
      this.socket.onClose(() => this.onWebsocketClose());
      this.socket.onError(() => this.onWebsocketError());
      this.socket.onMessage((res) => {
        const msg: ISocketMessage = JSON.parse(typeof res.data === 'string' ? res.data : '');
        this.message = msg;
        this.watchMessage(msg);
        this.watchMessagef(msg);
      });
    } catch (err) {
      console.log(err);
    }
  }

  onWebsocketOpen() {
    this.isConnected = true;
    this.readState = readyStateArr[1];
    this.authSocket();
    this.reactHeartbeat();
    console.log(this.readState);
  }
  onWebsocketClose() {
    this.isConnected = false;
    this.readState = readyStateArr[2];
    console.log(this.readState, 'close');
  }
  onWebsocketError() {
    this.isConnected = false;
    this.readState = readyStateArr[3];
    console.log(this.readState, 'er');
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  watchMessage(msg: ISocketMessage) {}

  watchMessagef(msg: ISocketMessage) {
    if (msg.event === 'heartbeat') {
      this.reactHeartbeat();
    }
  }

  close() {
    this.isConnected = false;
    this.isExit = true;
    this.socket?.close({
      success: () => {
        this.readState = readyStateArr[2];
      },
    });
  }
  // 心跳检测
  heartbeatDetection() {
    // console.log(this.timeout);
    clientTimer = setTimeout(() => {
      this.sendMessage({ data: '', event: 'heartbeat' });
      serverTimer = setTimeout(() => {
        this.reconnect();
      }, timeout);
    }, timeout);
  }

  // 重置心跳检测
  reactHeartbeat() {
    if (this.isExit) return;
    clearTimeout(clientTimer);
    clearTimeout(serverTimer);
    clearInterval(reconnectTimer);
    this.heartbeatDetection();
  }

  // 重连
  reconnect() {
    let count: number = 0;
    reconnectTimer = setInterval(() => {
      count++;
      if (count === reconnectCount || this.isConnected || this.isExit) {
        clearInterval(reconnectTimer);
        return;
      }
      this.socket?.close({
        success: () => {
          this.readState = readyStateArr[2];
        },
      });
      this.socket = null;
      this.readState = readyStateArr[2];
      this.createSocket();
    }, timeout);
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
