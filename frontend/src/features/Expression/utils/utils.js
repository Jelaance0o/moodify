import { FaceLandmarker, FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

export async function init({
  landmarkerRef,
  handLandmarkerRef,
  videoRef,
  streamRef,
  isCancelled = () => false,
}) {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Camera access is not available in this browser.");
  }

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  if (isCancelled()) {
    stream.getTracks().forEach((track) => track.stop());
    return;
  }

  streamRef.current = stream;
  videoRef.current.srcObject = streamRef.current;
  await videoRef.current.play();
  if (isCancelled()) return;

  if (landmarkerRef.current && handLandmarkerRef.current) return;

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm"
  );
  if (isCancelled()) return;

  let faceLandmarker = landmarkerRef.current;
  let handLandmarker = handLandmarkerRef.current;
  const createdFaceLandmarker = !faceLandmarker;
  const createdHandLandmarker = !handLandmarker;

  try {
    if (!faceLandmarker) {
      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      });
    }

    if (isCancelled()) {
      if (createdFaceLandmarker) faceLandmarker?.close();
      return;
    }

    if (!handLandmarker) {
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        },
        runningMode: "VIDEO",
        numHands: 2,
        minHandDetectionConfidence: 0.35,
        minHandPresenceConfidence: 0.35,
        minTrackingConfidence: 0.35,
      });
    }

    if (isCancelled()) {
      if (createdFaceLandmarker) faceLandmarker?.close();
      if (createdHandLandmarker) handLandmarker?.close();
      return;
    }

    landmarkerRef.current = faceLandmarker;
    handLandmarkerRef.current = handLandmarker;
  } catch (error) {
    if (createdFaceLandmarker) faceLandmarker?.close();
    if (createdHandLandmarker) handLandmarker?.close();
    throw error;
  }
}

function distanceBetween(first, second) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function isOpenPalm(landmarks) {
  const wrist = landmarks[0];
  const extensionThreshold = Math.max(distanceBetween(wrist, landmarks[9]) * 0.12, 0.003);
  const extendedFingers = [
    [8, 6],
    [12, 10],
    [16, 14],
    [20, 18],
  ].filter(([tip, joint]) => {
    const tipDistance = distanceBetween(landmarks[tip], wrist);
    const jointDistance = distanceBetween(landmarks[joint], wrist);
    return tipDistance > jointDistance + extensionThreshold;
  }).length;
  const thumbTipDistance = distanceBetween(landmarks[4], landmarks[5]);
  const thumbJointDistance = distanceBetween(landmarks[3], landmarks[5]);
  const thumbExtended = thumbTipDistance > thumbJointDistance + extensionThreshold;

  return extendedFingers >= 4 || (extendedFingers >= 3 && thumbExtended);
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

  const score = (name) => blendshapes.find((item) => item.categoryName === name)?.score || 0;
  const smile = Math.max(score("mouthSmileLeft"), score("mouthSmileRight"));
  let openPalms = 0;
  if (smile > 0.42 && handLandmarkerRef.current) {
    const hands = handLandmarkerRef.current.detectForVideo(videoRef.current, timestamp);
    openPalms = hands?.landmarks?.filter(isOpenPalm).length || 0;
  }

  const frown = Math.max(score("mouthFrownLeft"), score("mouthFrownRight"));
  const browDown = Math.max(score("browDownLeft"), score("browDownRight"));
  const browInnerUp = score("browInnerUp");
  const eyesDown = Math.max(score("eyeLookDownLeft"), score("eyeLookDownRight"));
  const mouthPress = Math.max(score("mouthPressLeft"), score("mouthPressRight"));
  const sadConfidence = Math.max(frown, (browInnerUp + eyesDown) / 2);
  const angerConfidence = Math.max(browDown, browDown * 0.8 + mouthPress * 0.2);
  const hasSadCue =
    frown > 0.16 ||
    (frown > 0.1 && (browInnerUp > 0.1 || eyesDown > 0.1)) ||
    (browInnerUp > 0.25 && eyesDown > 0.1);
  const hasStrongSadCue = frown > 0.28 || (browInnerUp > 0.3 && eyesDown > 0.2);
  const hasAngerCue = angerConfidence > 0.25;
  const hasStrongAngerCue = angerConfidence > 0.42;

  if (smile > 0.42 && openPalms >= 2) {
    return { expression: "Bliss", mood: "bliss", confidence: smile };
  }
  if (hasStrongSadCue) {
    return { expression: "Sad", mood: "sad", confidence: sadConfidence };
  }
  if (
    hasStrongAngerCue &&
    (!hasSadCue || angerConfidence > sadConfidence + 0.15)
  ) {
    return { expression: "Angry", mood: "anger", confidence: angerConfidence };
  }
  if (smile > 0.42) {
    return { expression: "Happy", mood: "happy", confidence: smile };
  }
  if (hasSadCue) {
    return { expression: "Sad", mood: "sad", confidence: sadConfidence };
  }
  if (hasAngerCue) {
    return { expression: "Angry", mood: "anger", confidence: angerConfidence };
  }

  return { expression: "Neutral", mood: null, confidence: 0 };
}
