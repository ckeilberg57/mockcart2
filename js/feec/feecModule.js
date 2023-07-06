var pexRtcWrapper;

var feecSnapshot = { init: false };

var commandDelay = 0;

const handleFeecMessage = (message, mainRtc) => {
  if (JSON.parse(message.payload).type === "message:panTilt") {
    let tilt = JSON.parse(message.payload).tilt;
    let tiltOffset = JSON.parse(message.payload).tiltOffset;

    let pan = JSON.parse(message.payload).pan;
    let panOffset = JSON.parse(message.payload).panOffset;

    let tiltMovement = false;

    const [track] = window.stream.getVideoTracks();
    const capabilities = track.getCapabilities();

    //Tilt
    let tiltStep = capabilities.tilt.step * tiltOffset;

    tiltStep = tiltStep * tilt;

    let newTilt = feecSnapshot.tilt + tiltStep;

    if (newTilt > capabilities.tilt.max) {
      newTilt = capabilities.tilt.max;
    }

    if (newTilt < capabilities.tilt.min) {
      newTilt = capabilities.tilt.min;
    }

    const tiltConst = {
      advanced: [{ tilt: newTilt }],
    };

    if (feecSnapshot.tilt != newTilt) {
      tiltMovement = true;
      /*     (async () => {
        try {
          await track.applyConstraints(tiltConst);
          feecSnapshot.tilt = newTilt;
        } catch (err) {
          console.error("applyConstraints() failed: ", err);
        }
      })(); */
      try {
        track.applyConstraints(tiltConst);
        feecSnapshot.tilt = newTilt;
      } catch (err) {
        console.error("applyConstraints() failed: ", err);
      }
    }

    // Pan
    let panStep = capabilities.pan.step * panOffset;

    panStep = panStep * pan * -1;

    let newPan = feecSnapshot.pan + panStep;

    if (newPan > capabilities.pan.max) {
      newPan = capabilities.tilt.max;
    }

    if (newPan < capabilities.pan.min) {
      newPan = capabilities.pan.min;
    }

    const panConst = {
      advanced: [{ pan: newPan }],
    };

    if (feecSnapshot.pan != newPan) {
      var delay = 0;
      if (tiltMovement) {
        delay = commandDelay;
      }

      setTimeout(() => {
        /*     (async () => {
          try {
            await track.applyConstraints(panConst);
            feecSnapshot.pan = newPan;
          } catch (err) {
            console.error("applyConstraints() failed: ", err);
          }
        })(); */
        try {
          track.applyConstraints(panConst);
          feecSnapshot.pan = newPan;
        } catch (err) {
          console.error("applyConstraints() failed: ", err);
        }
      }, delay);
    }

    return;
  }

  if (JSON.parse(message.payload).type === "message:zoom") {
    let zoom = JSON.parse(message.payload).zoom;
    let zoomOffset = JSON.parse(message.payload).zoomOffset;

    const [track] = window.stream.getVideoTracks();
    const capabilities = track.getCapabilities();

    // Zoom
    let zoomStep = capabilities.zoom.step * zoom * zoomOffset;

    let newZoom = feecSnapshot.zoom + zoomStep;

    if (newZoom > capabilities.zoom.max) {
      newZoom = capabilities.zoom.max;
    }

    if (newZoom < capabilities.zoom.min) {
      newZoom = capabilities.zoom.min;
    }

    const zoomConst = {
      advanced: [{ zoom: newZoom }],
    };

    try {
      track.applyConstraints(zoomConst);
      feecSnapshot.zoom = newZoom;
    } catch (err) {
      console.error("applyConstraints() failed: ", err);
    }

    return;
  }

  if (JSON.parse(message.payload).type === "message:reset") {
    resetZoom();
  }

  if (JSON.parse(message.payload).type !== "message:handshake") {
    return;
  }

  const [track] = window.stream.getVideoTracks();
  const settings = track.getSettings();

  if (!feecSnapshot.init) {
    feecSnapshot.pan = settings.pan;
    feecSnapshot.tilt = settings.tilt;
    feecSnapshot.zoom = settings.zoom;
    feecSnapshot.init = true;
  }

  commandDelay = JSON.parse(message.payload).commandDelay;
  let node = JSON.parse(message.payload).node;
  let alias = JSON.parse(message.payload).alias;
  let pin = JSON.parse(message.payload).pin;

  pexRtcWrapper = new PexRtcWrapper(
    undefined,
    node,
    alias,
    "Remote Camera",
    pin,
    "2464",
    mainRtc.video_source
  );
  pexRtcWrapper.makeCall().muteAudio();

  pexRtcWrapper.addApplicationMessageListener(function (message) {
    handleFeecMessage(message, mainRtc);
  });
};

const resetZoom = () => {
  const [track] = stream.getVideoTracks();
  const capabilities = track.getCapabilities();
  const tiltConstrains = {
    advanced: [{ tilt: 0 }],
  };
  track.applyConstraints(tiltConstrains);

  const panConstrains = {
    advanced: [{ pan: 0 }],
  };

  window.setTimeout(function () {
    track.applyConstraints(panConstrains);
  }, commandDelay);

  const zoomConstrains = {
    advanced: [{ zoom: 0 }],
  };
  window.setTimeout(function () {
    track.applyConstraints(zoomConstrains);
  }, 2 * commandDelay);

  feecSnapshot.pan = 0;
  feecSnapshot.zoom = 0;
  feecSnapshot.tilt = 0;
};
