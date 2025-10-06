// src/components/FaceCapture.jsx
import { useEffect, useRef, useState } from "react";
import * as cam from "@mediapipe/camera_utils";
import * as mpFaceMesh from "@mediapipe/face_mesh";
import { drawConnectors, FACEMESH_TESSELATION } from "@mediapipe/drawing_utils";

export default function FaceCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const [faceDetected, setFaceDetected] = useState(false);

  useEffect(() => {
    let faceMesh;

    const initFaceMesh = async () => {
      if (faceMesh) return;

      faceMesh = new mpFaceMesh.FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults(onResults);

      if (videoRef.current && !cameraRef.current) {
        const camera = new cam.Camera(videoRef.current, {
          onFrame: async () => await faceMesh.send({ image: videoRef.current }),
          width: 640,
          height: 480,
        });
        camera.start();
        cameraRef.current = camera;
      }
    };

    initFaceMesh();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
      if (faceMesh && faceMesh.close) faceMesh.close();
    };
  }, []);

  const onResults = (results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiFaceLandmarks?.length > 0) {
      setFaceDetected(true);
      for (const landmarks of results.multiFaceLandmarks) {
        drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, {
          color: "#00FF00",
          lineWidth: 1,
        });
      }
    } else {
      setFaceDetected(false);
    }

    ctx.restore();
  };

  const handleCapture = () => {
    if (!faceDetected) {
      alert("❌ No se detectó un rostro válido. Intenta acercarte o mejora la iluminación.");
      return;
    }
    const canvas = canvasRef.current;
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(blob);
        else alert("Error al capturar la imagen del rostro.");
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <div className="relative flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        className="rounded-lg shadow-lg border border-gray-300"
      />
      <video
        ref={videoRef}
        className="hidden"
        width="640"
        height="480"
        autoPlay
        muted
      />
      <button
        onClick={handleCapture}
        className="mt-4 bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-all"
      >
        Capturar Rostro
      </button>
      <p className="mt-2 text-sm text-gray-600">
        {faceDetected ? "✅ Rostro detectado correctamente" : "🔴 Esperando detección de rostro..."}
      </p>
    </div>
  );
}
