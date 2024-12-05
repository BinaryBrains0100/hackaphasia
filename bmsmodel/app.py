from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import tensorflow as tf
import numpy as np
import io

# Initialize FastAPI and load your TensorFlow Lite model
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Add your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model_path = "C:\\Users\\Raju Dhangar\\Documents\\bmsmodel\\BMSmodel.tflite"
interpreter = tf.lite.Interpreter(model_path=model_path)

interpreter.allocate_tensors()

# Get input and output details
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Define the class names corresponding to each index
class_names =[
    'Apple Apple scab',
    'Apple Black rot',
    'Apple Cedar apple rust',
    'Apple healthy',
    'Blueberry healthy',
    'Cherry (including sour) Powdery mildew',
    'Cherry (including sour) healthy',
    'Corn (maize) Cercospora leaf spot Gray leaf spot',
    'Corn (maize) Common rust',
    'Corn (maize) Northern Leaf Blight',
    'Corn (maize) healthy',
    'Grape Black rot',
    'Grape Esca (Black Measles)',
    'Grape Leaf blight (Isariopsis Leaf Spot)',
    'Grape healthy',
    'Orange Haunglongbing (Citrus greening)',
    'Peach Bacterial spot',
    'Peach healthy',
    'Pepper, bell Bacterial spot',
    'Pepper, bell healthy',
    'Potato Early blight',
    'Potato Late blight',
    'Potato healthy',
    'Raspberry healthy',
    'Soybean healthy',
    'Squash Powdery mildew',
    'Strawberry Leaf scorch',
    'Strawberry healthy',
    'Tomato Bacterial spot',
    'Tomato Early blight',
    'Tomato Late blight',
    'Tomato Leaf Mold',
    'Tomato Septoria leaf spot',
    'Tomato Spider mites Two-spotted spider mite',
    'Tomato Target Spot',
    'Tomato Tomato Yellow Leaf Curl Virus',
    'Tomato Tomato mosaic virus',
    'Tomato healthy'
]

# Preprocess the image to match the model input
def preprocess_image(image: Image.Image, target_size=(224, 224)):
    image = image.convert('RGB')
    image = image.resize(target_size)
    input_data = np.array(image, dtype=np.float32) / 255.0  # Normalize
    input_data = np.expand_dims(input_data, axis=0)  # Add batch dimension
    return input_data

@app.post("/predict")
async def predict_food(file: UploadFile = File(...)):
    try:
        print("request aaya")
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
    except Exception as e:
        print("Error reading image:", e)
        raise HTTPException(status_code=400, detail=f"Error reading image: {e}")

    try:
        input_data = preprocess_image(image, (input_details[0]['shape'][1], input_details[0]['shape'][2]))
    except Exception as e:
        print("Error preprocessing image:", e)
        raise HTTPException(status_code=500, detail=f"Error preprocessing image: {e}")

    try:
        interpreter.set_tensor(input_details[0]['index'], input_data)
        interpreter.invoke()
        output_data = interpreter.get_tensor(output_details[0]['index']).flatten()
    except Exception as e:
        print("Error during model inference:", e)
        raise HTTPException(status_code=500, detail=f"Error during model inference: {e}")

    try:
        predicted_class_index = np.argmax(output_data)
        predicted_probability = output_data[predicted_class_index]

        if predicted_probability < 0.5:
            print("Prediction not possible")
            return {"prediction": "NONE"}

        predicted_class = class_names[predicted_class_index]
        print("Prediction:", predicted_class)
        print("Confidence:",predicted_probability*100)
        return {
            "prediction": predicted_class,
            "confidence": f"{predicted_probability * 100:.2f}%"
        }
    except Exception as e:
        print("Error processing prediction result:", e)
        raise HTTPException(status_code=500, detail=f"Error processing prediction result: {e}")
