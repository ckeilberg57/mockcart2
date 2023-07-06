class PexRtcWrapper {
  constructor(
    videoElement,
    confNode,
    confName,
    displayName,
    pin,
    bandwidth = "1264",
    source,
  ) {
    this.videoElement = videoElement;
    this.confNode = confNode;
    this.confName = confName;
    this.displayName = displayName;
    this.pin = pin;
    this.bandwidth = parseInt(bandwidth);

    this.pexRtc = new PexRTC();

    this.pexRtc.video_source = source;

    this.onParticipantEvent;

    this.onApplicationMessage;

    this.onConnect;

    this.attachEvents();

    console.debug(`Video Element: ${this.videoElement}`);
    console.debug(`Bandwidth: ${this.bandwidth}`);
  }

  addParticipantListener(participantEventCallBack) {
    this.onParticipantEvent = participantEventCallBack;
  }

  addApplicationMessageListener(applicationMessageEventCallBack) {
    this.onApplicationMessage = applicationMessageEventCallBack;
  }

  addConnectListener(connectEventCallBack) {
    this.onConnect = connectEventCallBack;
  }

  _hangupHandler(event) {
    this.pexRtc.disconnect();
    this.videoElement.src = "";
  }

  _setupHandler(videoUrl, pinStatus) {
    console.debug(`PIN status: ${pinStatus}`);
    this.pexRtc.connect(this.pin);
  }

  _errorHandler(err) {
    console.error({ err });
  }

  _connectHandler(videoUrl) {

    if(this.videoElement){
      this.videoElement.poster = "";
      if (typeof MediaStream !== "undefined" && videoUrl instanceof MediaStream) {
        this.videoElement.srcObject = videoUrl;
      } else {
        this.videoElement.src = videoUrl;
      }
    }
    if(this.onConnect){
      this.onConnect()
    }
  }

  _disconnectHandler(reason) {
    console.debug({ reason });
    window.removeEventListener("beforeunload", (...args) =>
      this._hangupHandler(...args)
    );
   //S window.close();
  }

  _participantHandler() {
    if(this.onParticipantEvent){
      this.onParticipantEvent(this.pexRtc.getRosterList());
    }
  }

  _applicationMessageHandler(message) {
    this.onApplicationMessage(message);
  }

  attachEvents() {
    window.addEventListener("beforeunload", (...args) =>
      this._hangupHandler(...args)
    );
    this.pexRtc.onSetup = (...args) => this._setupHandler(...args);
    this.pexRtc.onError = (...args) => this._errorHandler(...args);
    this.pexRtc.onConnect = (...args) => this._connectHandler(...args);
    this.pexRtc.onDisconnect = (...args) => this._disconnectHandler(...args);
    this.pexRtc.onParticipantUpdate = (...args) =>
      this._participantHandler(...args);
    this.pexRtc.onParticipantDelete = (...args) =>
      this._participantHandler(...args);
    this.pexRtc.onParticipantCreate = (...args) =>
      this._participantHandler(...args);
    this.pexRtc.onApplicationMessage = (...args) =>
      this._applicationMessageHandler(...args);
  }

  makeCall() {
    this.pexRtc.makeCall(
      this.confNode,
      this.confName,
      this.displayName,
      this.bandwidth
    );
    return this;
  }

  muteAudio() {
    this.pexRtc.muteAudio(true);
    return this;
  }

  disconnectAll() {
    this.pexRtc.disconnectAll();
    return this;
  }

  getOwnUuid() {
    return this.pexRtc.uuid;
  }

  sendApplicationMessage(data, targetUuid) {
    this.pexRtc.sendApplicationMessage(data, targetUuid);
  }
}
