const { predict } = require("../services/modelService");

exports.handlePrediction = async (req, res) => {
  try {
    const base64Image = req.body.image;

    if (!base64Image) {
      return res.status(400).json({
        success: false,
        message: "Image not provided",
      });
    }

    const result = await predict(base64Image);

    return res.status(200).json({
      success: true,
      message: "Blood group prediction successful",
      predicted_label: result.predicted_blood_group,
      confidence: result.confidence,
      all_probabilities: result.all_probabilities,
    });

  } catch (error) {
    console.error("Prediction Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error processing prediction",
      error: error.message,
    });
  }
};
