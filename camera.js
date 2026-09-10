// Camera access and live barcode detection for the Scan page.
// The active stream is kept private to this module — call stopCamera()
// whenever you navigate away, and startCamera() when the Scan page mounts.

let cameraStream;

export function stopCamera() {
  cameraStream?.getTracks().forEach(track => track.stop());
  cameraStream = undefined;
}

// Requests the rear camera, shows the live feed behind the scanner frame,
// and — if the browser supports the Barcode Detection API — continuously
// scans frames until a code is found, then navigates to its detail page.
export async function startCamera() {
  const status = document.querySelector('#scanner-status');
  const video = document.createElement('video');
  video.setAttribute('playsinline', '');
  video.autoplay = true;

  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Secure camera access unavailable');
    }

    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
    });
    video.srcObject = cameraStream;
    document.querySelector('#scanner').prepend(video);
    status.textContent = 'Align the barcode within the frame';

    if ('BarcodeDetector' in window) {
      const detector = new BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'qr_code'],
      });

      const detect = async () => {
        if (!cameraStream) return; // camera was stopped (e.g. user navigated away)
        const codes = await detector.detect(video);
        if (codes[0]) {
          location.hash = `item/${codes[0].rawValue}`;
          return;
        }
        requestAnimationFrame(detect);
      };
      video.onloadeddata = detect;
    } else {
      status.textContent = 'Camera ready — use manual entry if scanning is unavailable';
    }
  } catch {
    status.textContent = 'Camera needs HTTPS and permission — enter a code instead';
  }
}
