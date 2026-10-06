import {
    FaceLandmarker,
    FilesetResolver
} from "@mediapipe/tasks-vision";


export const init = async ({landmarkerRef , videoRef , streamRef , }) => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
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

  streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });

  videoRef.current.srcObject = streamRef.current;

  await videoRef.current.play();

};

export const detect = ({landmarkerRef , videoRef , setExpression}) => {
  if (!landmarkerRef.current || !videoRef.current) return;

  const results = landmarkerRef.current.detectForVideo(
    videoRef.current,
    performance.now(),
  );

  if (results.faceBlendshapes?.length > 0) {
    const blendshapes = results.faceBlendshapes[0].categories;

    const getScore = (name) =>
      blendshapes.find((b) => b.categoryName === name)?.score || 0;

    // Mouth
    const smileLeft = getScore("mouthSmileLeft");
    const smileRight = getScore("mouthSmileRight");

    const frownLeft = getScore("mouthFrownLeft");
    const frownRight = getScore("mouthFrownRight");

    const jawOpen = getScore("jawOpen");

    // Eyebrows
    const browUp = getScore("browInnerUp");
    const browDownLeft = getScore("browDownLeft");
    const browDownRight = getScore("browDownRight");

    let currentExpression = "Neutral";

    // Happy 😄
    if (smileLeft > 0.5 && smileRight > 0.5) {
      currentExpression = "Happy 😄";
    }

    // Surprised 😲
    else if (jawOpen > 0.6 && browUp > 0.5) {
      currentExpression = "Surprised 😲";
    }

    // Sad 😢
    else if (frownLeft > 0.001 && frownRight > 0.001) {
      currentExpression = "Sad 😢";
    }

    // Angry 😠
    else if (browDownLeft > 0.5 && browDownRight > 0.5) {
      currentExpression = "Angry 😠";
    }

    setExpression(currentExpression);
  }

  animationRef.current = requestAnimationFrame(detect);
};
