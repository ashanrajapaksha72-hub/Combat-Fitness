//CONFIG
var SESSION_MS = 2 * 60 * 60 * 1000;

//STATE
var scanning   = false;
var cameras    = [];
var camIdx     = 0;
var streamObj  = null;
var lastCode   = '';
var lastTime   = 0;

var count   = 0;
var inToday = 0;
var logArr  = [];

var sessions = {};

// PERSISTENCE
function persist() {
    var toSave = {};
    Object.keys(sessions).forEach(function(id) {
        toSave[id] = { time: sessions[id].time, expiry: sessions[id].expiry };
    });

    try {
        localStorage.setItem('gymCount', count);
        localStorage.setItem('gymInToday', inToday);
        localStorage.setItem('gymLog', JSON.stringify(logArr.slice(0, 50)));
        localStorage.setItem('gymSessions', JSON.stringify(toSave));
    } catch (e) {
        debug('Save failed: ' + e.message);
    }
}

function restore() {
    count   = parseInt(localStorage.getItem('gymCount'))   || 0;
    inToday = parseInt(localStorage.getItem('gymInToday')) || 0;

    try { logArr = JSON.parse(localStorage.getItem('gymLog') || '[]'); }
    catch (e) { logArr = []; }

    var saved = {};
    try { saved = JSON.parse(localStorage.getItem('gymSessions') || '{}'); }
    catch (e) { saved = {}; }

    var now = Date.now();
    Object.keys(saved).forEach(function(id) {
        var remaining = saved[id].expiry - now;
        if (remaining > 0) {
            armSession(id, saved[id].time, saved[id].expiry, remaining);
        } else if (count > 0) {
            count--; // expired while page was closed
        }
    });

    updateUI();
}

//CLOCK
function tick() {
    document.getElementById('clock').textContent =
        new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
tick();
setInterval(tick, 10000);
setInterval(updateUI, 30000); // keep countdown labels fresh

// HELPERS
function now() { return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); }

function debug(msg) {
    document.getElementById('debug').textContent = msg;
}

function showBanner(msg, type) {
    var b = document.getElementById('banner');
    b.className = 'banner ' + type;
    b.textContent = msg;
    b.style.display = 'block';
    clearTimeout(b._t);
    b._t = setTimeout(function() { b.style.display = 'none'; }, 4000);
}

function formatTimeLeft(expiry) {
    var ms = expiry - Date.now();
    if (ms <= 0) return 'expiring...';
    var mins = Math.floor(ms / 60000);
    var hrs  = Math.floor(mins / 60);
    return hrs > 0 ? (hrs + 'h ' + (mins % 60) + 'm left') : (mins + 'm left');
}

// Creates a session + timer; used by both fresh check-ins and restored ones
function armSession(id, time, expiry, msLeft) {
    var timerId = setTimeout(function() { checkOut(id, true); }, msLeft);
    sessions[id] = { time: time, expiry: expiry, timerId: timerId };
}

//UI
function updateUI() {
    document.getElementById('m-now').textContent = count;
    document.getElementById('m-in').textContent  = inToday;
    persist();

    var logEl = document.getElementById('log');
    if (!logArr.length) {
        logEl.innerHTML = '<div class="empty">No scans yet today</div>';
        return;
    }

    logEl.innerHTML = logArr.slice(0, 10).map(function(e) {
        var isIn = e.dir === 'in';
        var session = isIn ? sessions[e.id] : null;
        var extra = session ? '<span class="log-ttl">' + formatTimeLeft(session.expiry) + '</span>' : '';

        return '<div class="log-item ' + e.dir + '">' +
            '<span class="log-id">' + e.id + '</span>' +
            '<div class="log-meta">' +
                '<span class="log-badge ' + (isIn ? 'badge-in' : 'badge-expired') + '">' +
                    (isIn ? 'IN' : 'EXPIRED') +
                '</span>' + extra +
                '<span class="log-time">' + e.time + '</span>' +
            '</div></div>';
    }).join('');
}

//CHECK IN / OUT
function doCheckIn(id) {
    if (sessions[id]) {
        showBanner(id + ' is already inside', 'danger');
        return;
    }

    var time = now();
    armSession(id, time, Date.now() + SESSION_MS, SESSION_MS);

    count++;
    inToday++;
    logArr.unshift({ id: id, dir: 'in', time: time });

    updateUI();
    showBanner(id + ' checked in ✓ — auto-removes in 2 hrs', 'success');
    debug('Checked in: ' + id);
}


function checkOut(id, isAutoExpiry) {
    if (!sessions[id]) return;

    delete sessions[id];
    if (count > 0) count--;

    if (isAutoExpiry) {
        logArr.unshift({ id: id, dir: 'expired', time: now() });
        showBanner(id + ' removed after 2 hrs — count now ' + count, 'info');
    }

    updateUI();
    debug((isAutoExpiry ? 'Auto-expired: ' : 'Checked out: ') + id);
}

//CAMERA
function toggleCamera() {
    if (scanning) return stopCamera();

    debug('Requesting camera...');
    navigator.mediaDevices.enumerateDevices()
        .then(function(devices) {
            cameras = devices.filter(function(d) { return d.kind === 'videoinput'; });
            camIdx = cameras.length - 1; // prefer last camera (usually rear on phones)
            startCamera();
        })
        .catch(function(e) {
            debug('Error: ' + e.message);
            showBanner('Error: ' + e.message, 'danger');
        });
}

function startCamera() {
    var video = document.getElementById('video');
    var constraints = {
        video: cameras.length
            ? { deviceId: { exact: cameras[camIdx].deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
            : { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
    };

    if (streamObj) streamObj.getTracks().forEach(function(t) { t.stop(); });

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            streamObj = stream;
            video.srcObject = stream;
            video.play();

            video.style.display = 'block';
            document.getElementById('placeholder').style.display = 'none';
            document.getElementById('viewfinder').style.display = 'flex';
            document.getElementById('camBtn').textContent = '⬛ Stop camera';
            scanning = true;

            debug('Camera on — starting barcode detection...');
            startQuagga(video);
        })
        .catch(function(e) {
            debug('Camera error: ' + e.name + ' - ' + e.message);
            showBanner('Camera error: ' + e.name, 'danger');
        });
}

function stopCamera() {
    try { Quagga.stop(); } catch (e) {}

    if (streamObj) {
        streamObj.getTracks().forEach(function(t) { t.stop(); });
        streamObj = null;
    }

    var video = document.getElementById('video');
    video.srcObject = null;
    video.style.display = 'none';

    document.getElementById('placeholder').style.display = 'flex';
    document.getElementById('viewfinder').style.display = 'none';
    document.getElementById('camBtn').textContent = '▶ Start camera';

    scanning = false;
    lastCode = '';
    debug('Camera stopped');
}

//BARCODE SCANNING
function startQuagga(video) {
    Quagga.init({
        inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: video,
            constraints: { width: 1280, height: 720 }
        },
        decoder: {
            readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader', 'upc_reader', 'upc_e_reader', 'codabar_reader'],
            multiple: false
        },
        locate: true,
        numOfWorkers: 2,
        frequency: 10
    }, function(err) {
        if (err) {
            debug('Quagga init error: ' + err);
            showBanner('Scanner error: ' + err, 'danger');
            return;
        }
        debug('Scanner active — show barcode to camera');
        Quagga.start();
    });

    Quagga.onDetected(function(result) {
        var code = result.codeResult.code;
        var t = Date.now();
        if (!code || (code === lastCode && t - lastTime < 3000)) return; // debounce repeats

        lastCode = code;
        lastTime = t;
        debug('Detected: ' + code);
        doCheckIn(code);
    });
}

//INIT
restore();