const tf = require('@tensorflow/tfjs-node');
const path = require('path');

const MODEL_PATH = `file://${path.resolve(
  __dirname,
  '../tfjs_model/model.json'
)}`;

let modelPromise = null;

async function loadModel() {
  if (!modelPromise) {
    modelPromise = tf.loadGraphModel(MODEL_PATH);
    await modelPromise;
    console.log('Model loaded!');
  }
  return modelPromise;
}

function preprocessImage(base64Data) {
  const cleanBase64 = base64Data.replace(
    /^data:image\/\w+;base64,/,
    ''
  );

  const buffer = Buffer.from(cleanBase64, 'base64');

  return tf.tidy(() => {
    const image = tf.node.decodeImage(buffer, 3);
    const resized = tf.image.resizeBilinear(image, [64, 64]);
    const normalized = resized.toFloat().div(255.0);
    return normalized.expandDims(0);
  });
}

async function predict(base64Image) {
  const model = await loadModel();

  const inputTensor = preprocessImage(base64Image);

  let outputTensor = await model.executeAsync(inputTensor);

  if (Array.isArray(outputTensor)) {
    outputTensor = outputTensor[0];
  }

  const squeezed = outputTensor.squeeze();

  const probabilities = squeezed.dataSync();
  const predictedIndex = squeezed.argMax().dataSync()[0];

  const classNames = [
    'A+',
    'A-',
    'AB+',
    'AB-',
    'B+',
    'B-',
    'O+',
    'O-'
  ];

  inputTensor.dispose();
  outputTensor.dispose();
  squeezed.dispose();

  return {
    predicted_class_index: predictedIndex,
    predicted_blood_group: classNames[predictedIndex],
    confidence: probabilities[predictedIndex],
    all_probabilities: probabilities
  };
}

module.exports = {
  loadModel,
  predict
};
