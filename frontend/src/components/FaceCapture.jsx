import React, { useRef, useEffect, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

export default function FaceCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.multiFaceLandmarks?.length > 0) {
        ctx.strokeStyle = "#00b4d8";
        ctx.lineWidth = 1;
        results.multiFaceLandmarks[0].forEach((landmark) => {
          const x = landmark.x * canvas.width;
          const y = landmark.y * canvas.height;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, 2 * Math.PI);
          ctx.stroke();
        });
        setReady(true);
      } else {
        setReady(false);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
      width: 480,
      height: 360,
    });
    camera.start();
  }, []);

  const handleCapture = () => {
    const image = canvasRef.current.toDataURL("image/jpeg");
    onCapture(image);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width={480} height={360} />
      <div style={{ marginTop: "1rem" }}>
        <button disabled={!ready} onClick={handleCapture}>
          {ready ? "Capturar rostro" : "Esperando rostro..."}
        </button>
      </div>
    </div>
  );
}
