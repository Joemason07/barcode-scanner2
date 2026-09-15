// Camera access and live barcode detection.
//
// This module owns the camera stream.
// The Scan page starts the camera when it loads,
// and the router stops it when leaving the page.

let cameraStream = null;
let detectionActive = false;


// --------------------------------------------------
// Stop camera
// --------------------------------------------------

export function stopCamera() {
  detectionActive = false;

  cameraStream
    ?.getTracks()
    .forEach(track => track.stop());

  cameraStream = null;

  document.querySelector('#scanner video')?.remove();
}


// --------------------------------------------------
// Start camera
// --------------------------------------------------

export async function startCamera() {
  const scanner = document.querySelector('#scanner');
  const status = document.querySelector('#scanner-status');

  if (!scanner || !status) {
    return;
  }

  // Make sure an existing camera is not still running.
  stopCamera();

  const video = document.createElement('video');

  video.setAttribute('playsinline', '');
  video.autoplay = true;
  video.muted = true;

  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error(
        'Secure camera access unavailable'
      );
    }

    // Request the rear-facing camera.
    cameraStream =
      await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: 'environment'
          }
        }
      });

    video.srcObject = cameraStream;

    scanner.prepend(video);

    status.textContent =
      'Align the barcode within the frame';

    detectionActive = true;

    startBarcodeDetection(
      video,
      status
    );

  } catch (error) {
    console.error(
      'Camera could not be started:',
      error
    );

    status.textContent =
      'Camera needs HTTPS and permission — enter a code instead';

    cameraStream = null;
  }
}


// --------------------------------------------------
// Barcode detection
// --------------------------------------------------

async function startBarcodeDetection(
  video,
  status
) {
  if (!('BarcodeDetector' in window)) {
    status.textContent =
      'Camera ready — use manual entry if scanning is unavailable';

    return;
  }

  const detector = new BarcodeDetector({
    formats: [
      'ean_13',
      'ean_8',
      'upc_a',
      'upc_e',
      'code_128',
      'qr_code'
    ]
  });

  const detect = async () => {
    if (!detectionActive || !cameraStream) {
      return;
    }

    try {
      const codes =
        await detector.detect(video);

      const code = codes[0]?.rawValue;

      if (code) {
        detectionActive = false;

        // Stop the camera before navigating.
        stopCamera();

        location.hash =
          `item/${encodeURIComponent(code)}`;

        return;
      }
    } catch (error) {
      console.error(
        'Barcode detection failed:',
        error
      );
    }

    if (detectionActive) {
      requestAnimationFrame(detect);
    }
  };

  video.addEventListener(
    'loadeddata',
    detect,
    { once: true }
  );
}