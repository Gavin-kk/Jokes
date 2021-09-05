// eslint-disable-next-line max-classes-per-file
import { Vue, Component } from 'vue-property-decorator';
import { TOKEN_KEY } from '@common/constant/storage.constant';
import { WS_SERVER } from '@config/service.config';

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
let timer: number | undefined;
let currentReconnectCount: number = 0;

export abstract class WebsocketMixinAbstract {
  abstract watchMessage: (msg: ISocketMessage) => void;
}

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
        url: WS_SERVER,
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
    if (typeof timer !== 'undefined') {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.reconnect();
      }, 3000);
    } else {
      timer = setTimeout(() => {
        this.reconnect();
      }, 3000);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  watchMessage(msg: ISocketMessage) {}

  watchMessagef(msg: ISocketMessage) {
    if (msg.event === 'heartbeat') {
      this.reactHeartbeat();
    }
  }

  close() {
    return new Promise((resolve, reject) => {
      this.isConnected = false;
      this.isExit = true;
      this.socket?.close({
        success: () => {
          this.readState = readyStateArr[2];
          resolve('');
        },
        fail: () => {
          reject(new Error(''));
        },
      });
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
    reconnectTimer = setInterval(() => {
      currentReconnectCount++;
      if (currentReconnectCount === reconnectCount || this.isConnected || this.isExit) {
        clearInterval(reconnectTimer);
        clearTimeout(timer);
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
