
import {h} from 'preact';
import linkState from 'linkstate';
import util from '../util.js';

var QrCode = require('qrcode-reader');
var getUserMedia = require('getusermedia');
var path = require('path');
var settings = require('../../../settings.js')();

module.exports = function(Component) {

  return class Scan extends Component {
   
    constructor(props) {
      super(props);
      
      this.setState({
        code: '',
        scanAccess: false
      });

      this.enableDM = false;


    }

    componentWillUnmount() {
      this.changeState({
        scanAccess: false
      });
      this.stopCameraStream();
    }

    componentDidMount() {

      this.modalCallback = this.props.cb;
      this.qr = new QrCode();
      this.scanCtx = document.getElementById('scanCanvas').getContext("2d");

      this.initKeyboardCapture();

      getUserMedia({
        video: true,
        audio: false
      }, function(err, stream) {

        if(err) {
          if (err.name === 'DevicesNotFoundError' || err.name === 'NotFoundError') {
            this.changeState({
              error: (
                  <span>
                    Hmm, looks like your device does not have a camera.
                    <br/>
                    You can still use the hand-held USB scanner.</span>
              ),
              scanAccess: false
            });
          } else if (err.name === 'InternalError') {
            this.changeState({
              error: "Could not access your camera. Is another application using it?",
              scanAccess: false
            });
          } else {
            this.changeState({
              error: "Unknown camera access error: " + err.msg || err,
              scanAccess: false
            });
            console.error("Camera access error:", err);
          }
          return;
        }
        
        this.changeState({
          scanAccess: true
        });
        this.cameraStream = stream;
        var scanVideo = document.getElementById('scanVideo');

        if(scanVideo) {
          // we have to save a reference due to this issue:
          // https://github.com/developit/preact/issues/732
          scanVideo.style.visibility = 'visible';
          scanVideo.src = window.URL.createObjectURL(stream);
          scanVideo.play().catch(function(err) {
            if(err) {
              app.actions.notify("Camera access failed", 'error', 0);
              console.error(err);
              return;
            }
          });

          setTimeout(this.scan.bind(this), 500);
        }
      }.bind(this));
    }

    // check if something is a v4 uuid
    isUUID(id) {
      return !!(id.match(/[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}/i))
    }

    getIDFromURL(url) {
      console.log("URL:", url)
      var m = url.match(new RegExp('^' + settings.baseUrl + '/o/(\\d+)'));
      if (!m || (m.length < 2)) return null;
      return parseInt(m[1]);
    }

    decodeQrCode(self, cb) {
      var scanCanvas = document.getElementById('scanCanvas');
      var data = self.scanCtx.getImageData(0, 0, scanCanvas.width, scanCanvas.height);
      this.qr.callback = cb;
      this.qr.decode(data);
    }


    debug(str) {
//      str = $('#debug').html() + "<br/>\n" + str;
//      $('#debug').html(str);
    }

    scanSuccess(code) {

      app.remote.getBy('barcode', code, function(err, m) {
        if(err || !m) {
          app.remote.getByHumanID(code, function(err, m) {
            if(err || !m) {
              this.runCallback(null, null, code)
              return;
            }
            this.runCallback(null, m)
          }.bind(this))
          return;
        }
        this.runCallback(null, m, code)
      }.bind(this));
    }

    scan(delay) {
      if(!this.state.scanAccess) return;
      delay = delay || 500; // delay between frames in ms
      
      var scanVideo = document.getElementById('scanVideo');
      try {
        this.scanCtx.drawImage(scanVideo, 0, 0);
      } catch(e) {
        
      }

      this.decodeQrCode(this, function(err, data) {
        if(err || !data || !data.result) {
          if(!this.enableDM) {
            setTimeout(this.scan.bind(this), delay);
          } else {
            console.error("DataMatrix scanning not currently supported");
//            decodeDMCode(function(data) {
//              if (!data) return setTimeout(scan.bind(this), delay);
//              // TODO decode then call scanSuccess
//            });
          }
          return
        }
        var id = this.getIDFromURL(data.result);
        if(!id) return setTimeout(this.scan.bind(this), delay);

        // TODO visual indication of scan success
        this.scanSuccess(id);
      }.bind(this));
    }


    keyboardScan(e) {
      e.preventDefault();

      var code = this.state.code.replace(/[^\d]+/g, '');
      console.log("code:", code);

      if(code.length <= 0) {
        document.getElementById('keyboardInput').value = '';
        // TODO better error handling
        app.actions.notify("Invalid barcode...", 'warning', 1500);
        return;
      }
      this.scanSuccess(code);
    }

    // prevent text input field from loosing focus
    initKeyboardCapture() {
      var ki = document.getElementById('keyboardInput');
      ki.focus(true);
    }

    onInputBlur(e) {
      // firefox needs the setTimeout
      setTimeout(function() {
        e.target.focus(true);
      }, 1);
    }


    stopCameraStream() {
      if(this.cameraStream) {
        var tracks = this.cameraStream.getTracks();
        var i;
        for (i = 0; i < tracks.length; i++) {
          tracks[i].stop();
        }
        this.cameraStream = null
      }
    }
    
    runCallback(err, m, barcode) {
      if(this.modalCallback) {
        if(this.modalCallback(err, m, barcode)) {
          // only stop scanning if callback returns true (success)
          this.stopCameraStream();
        }
        return;
      }
      
      if(!m) {
        app.actions.notify("The scanned item is not associated with this bionet node", 'warning');
        return;
      }

      app.actions.route('/inventory/' + m.id);
    }

	  render() {

      var scanVideo = '';
      if(!this.state.error) {
        scanVideo = (<video id="scanVideo" class="scanVideo" width="440" height="330"></video>);
      }

      var cameraAccessMsg = '';

      if(!this.state.scanAccess) {
        cameraAccessMsg = (
            <div id="cameraAccessMsg">
              <div class="spinner">
                <div class="cssload-whirlpool"></div>
              </div>
              <h5 style="color:green">Waiting for browser camera access</h5>
              <p>Without camera access you will only be able to scan using an attached USB barcode scanner</p>
            </div>
        );
      }

      return (

        <div id="scan-wrapper" class="scan">
          <div class="row">
            <div class="col s1 m1 l1"></div>
            
            <div class="col s6 m6 l6">
              <div id="scanError" class="error">{this.state.error}</div>
              {cameraAccessMsg}
              <canvas id="scanCanvas" class="scanCanvas" width="560" height="560"></canvas>
              {scanVideo}

              <div id="debug"></div>
              <div class="canvas-layers"></div>
              <div class="canvas-box"></div>
            </div>
            
            <div class="col s5 m5 l5">
              <form class="keyboard-form" onsubmit={this.keyboardScan.bind(this)}>
                <input id="keyboardInput" type="text" autocomplete="off" oninput={linkState(this, 'code')} onblur={this.onInputBlur} autofocus />
                <input type="submit" />
              </form>
            </div>
          </div>      
        </div>
      )
    }
  }
}
