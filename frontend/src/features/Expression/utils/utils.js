import { FaceLandmarker, FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

export async function init({ landmarkerRef, handLandmarkerRef, videoRef, streamRef }) {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Camera access is not available in this browser.");
  }

  streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
  videoRef.current.srcObject = streamRef.current;
  await videoRef.current.play();

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm"
  );
  landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1,
  });
  handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
    },
    runningMode: "VIDEO",
    numHands: 2,
  });
}

function isOpenPalm(landmarks) {
  const wrist = landmarks[0];
  const extendedFingers = [
    [8, 6],
    [12, 10],
    [16, 14],
    [20, 18],
  ].filter(([tip, joint]) => {
    const tipDistance = Math.hypot(landmarks[tip].x - wrist.x, landmarks[tip].y - wrist.y);
    const jointDistance = Math.hypot(landmarks[joint].x - wrist.x, landmarks[joint].y - wrist.y);
    return tipDistance > jointDistance + 0.02;
  }).length;
  const thumbTipDistance = Math.hypot(landmarks[4].x - landmarks[5].x, landmarks[4].y - landmarks[5].y);
  const thumbJointDistance = Math.hypot(landmarks[3].x - landmarks[5].x, landmarks[3].y - landmarks[5].y);

  return extendedFingers >= 4 && thumbTipDistance > thumbJointDistance + 0.02;
}

export function detect({ landmarkerRef, handLandmarkerRef, videoRef }) {
  if (!landmarkerRef.current || !videoRef.current) {
    return { expression: "Camera is off", mood: null, confidence: 0 };
  }

  const timestamp = performance.now();
  const results = landmarkerRef.current.detectForVideo(videoRef.current, timestamp);
  const blendshapes = results.faceBlendshapes?.[0]?.categories;
  if (!blendshapes) {
    return { expression: "No face detected", mood: null, confidence: 0 };
  }

  const hands = handLandmarkerRef.current?.detectForVideo(videoRef.current, timestamp);
  const openPalms = hands?.landmarks?.filter(isOpenPalm).length || 0;
  const score = (name) => blendshapes.find((item) => item.categoryName === name)?.score || 0;
  const smile = (score("mouthSmileLeft") + score("mouthSmileRight")) / 2;
  const frown = (score("mouthFrownLeft") + score("mouthFrownRight")) / 2;
  const browDown = (score("browDownLeft") + score("browDownRight")) / 2;
  const browInnerUp = score("browInnerUp");
  const eyesDown = (score("eyeLookDownLeft") + score("eyeLookDownRight")) / 2;

  if (smile > 0.5 && openPalms >= 2) {
    return { expression: "Bliss", mood: "bliss", confidence: smile };
  }
  if (smile > 0.5) {
    return { expression: "Happy", mood: "happy", confidence: smile };
  }
  if (browDown > 0.5) {
    return { expression: "Angry", mood: "anger", confidence: browDown };
  }
  if (
    frown > 0.28 ||
    (frown > 0.12 && browInnerUp > 0.18) ||
    (browInnerUp > 0.4 && eyesDown > 0.2)
  ) {
    const confidence = Math.max(frown, browInnerUp * 0.7 + eyesDown * 0.3);
    return { expression: "Sad", mood: "sad", confidence };
  }

  return { expression: "Neutral", mood: null, confidence: 0 };
}
