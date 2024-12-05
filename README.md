# AgroEye: Plant Disease Detection using Computer Vision

AgroEye is a web-based platform designed to detect plant diseases through image recognition and provide insightful information to users. By capturing an image of a plant leaf using the camera, AgroEye leverages deep learning models to analyze the image and identify potential plant diseases. Upon detection, the system provides detailed information about the disease, as well as a chat interface to ask further questions related to the plant health issue.

## Features

- **Leaf Image Upload**: Capture a leaf image directly using your device's camera or upload an image of a plant leaf.
- **CNN Model for Disease Detection**: The captured image is sent to a server that utilizes a Convolutional Neural Network (CNN) to detect any plant diseases.
- **Disease Information**: Upon detecting a disease, AgroEye prompts a LLaMA (Large Language Model) to provide detailed information about the disease, including symptoms, causes, and suggested remedies.
- **Interactive Chat**: Users can ask further questions related to the disease or plant care, and the LLaMA model will provide helpful insights to guide them.
- **Real-time Feedback**: The system provides quick and accurate feedback, helping users identify issues and take preventive or corrective actions promptly.

## How It Works

1. **Capture or Upload Image**: The user takes a picture of the plant leaf using the device camera or uploads an image.
2. **Image Processing**: The image is sent to the server for processing, where a CNN model analyzes the leaf to detect any signs of disease.
3. **Disease Detection**: If a disease is detected, the CNN model classifies it and provides a result.
4. **Disease Information**: Based on the classification result, AgroEye prompts a LLaMA model to generate detailed information about the detected disease.
5. **Interactive Dialogue**: Users can then interact with the LLaMA model to learn more about the disease, its prevention, and treatment.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (for the user interface and camera integration).
- **Backend**: Python (FastAPI for handling requests), CNN model for image classification.
- **Model**:
  - **CNN**: Convolutional Neural Network (CNN) for detecting plant diseases based on leaf images.
  - **LLaMA**: A large language model to generate insights and answer questions related to plant diseases.
- **Cloud Storage**: For storing and serving images.
- **Server**: The backend server hosts the CNN model and communicates with the LLaMA model for generating responses.

## How to Use

1. Open the AgroEye website in your browser.
2. Use the camera functionality to take a picture of a plant leaf.
3. The system will process the image and detect any diseases.
4. Once a disease is detected, a detailed description of the disease will appear, and you can interact with the system for further information or recommendations.

## License

This project is licensed under the MIT License.

## Acknowledgments

- **TensorFlow/PyTorch**: For deep learning and CNN model support.
- **Groq**: For providing the LLaMA model for language generation:https://console.groq.com/docs/overview
- **Kaggle**: dataset-https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset
