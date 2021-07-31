import { Vue, Component, Mixins, Watch } from 'vue-property-decorator';

export interface IReadState {
  key: number;
  value: string;
}
export interface ISocketMessage {
  event: string;
  data: any;
}

@Component({})
export default class WebsocketMixin extends Vue {
  public readyStateArr: IReadState[] = [
    { key: 0, value: '正在连接中' },
    { key: 1, value: '已连接' },
    { key: 2, value: '连接已关闭' },
    { key: 3, value: '连接已关闭或未连接成功' },
  ];
  public socket: UniApp.SocketTask | null = null;
  public message: ISocketMessage | null = null;
  public readState: IReadState | null = null;

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
          this.readState = this.readyStateArr[0];
        },
      });

      this.socket.onOpen(() => {
        this.readState = this.readyStateArr[1];
      });
      this.socket.onClose(() => {
        this.readState = this.readyStateArr[2];
      });
      this.socket.onError(() => {
        this.readState = this.readyStateArr[3];
      });
      this.socket.onMessage((res) => {
        this.message = JSON.parse(typeof res.data === 'string' ? res.data : '');
      });
    } catch (err) {
      console.log(err);
    }
  }

  close() {
    this.socket?.close({
      success: () => {
        this.readState = this.readyStateArr[2];
      },
    });
  }
  // 重连
  reconnect() {
    this.close();
    this.socket = null;
    this.readState = this.readyStateArr[2];
    this.createSocket();
  }

  sendMessage(data: { event: string; data: any }) {
    this.socket?.send({
      data: JSON.stringify(data),
    });
  }

  destroyed() {
    this.socket?.close({});
  }
}
