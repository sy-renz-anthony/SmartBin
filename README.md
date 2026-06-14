# SmartBin
Updating the Entire system for integration with AI. Changing the categories of materials. This Trash Bin that automatically segregates biodegradable, non-biodegradable and hazardous materials. It also detects when the bins are full and can be monitored online through a MERN web app. I deployed the backend of this project to render.com and is now currently running, though it isn't really deployed yet appropriately for production still it is enough to play around with it's functionalities. Since I am using an orange pi pc for this project and with it's limited hardware capabilities. I deployed the ai model in huggingface.com as a public API using python and docker container. Take note though that I didn't trained the model myself as I am in tight schedule so I just downloaded one at kaggle.com. If you want to know more about the model I used in here, the url will be: https://www.kaggle.com/models/wasifmahmood01/waste-classification-model
\
\
The hardware is implemented using Arduino uno R3 for precise reading of sensors and control of actuators. The API backend, AI model API deployment, Camera interface and gsm module network implementation is done using an Orange Pi PC running xenial ubuntu linux and coded using java zulu 11 jdk. The class files are run using bash script that is run on boot-up by turning it as a service using chmod. the High-Definition camera capture is done using ffmpeg tool. The gsm module is interfaced using AT commands thru minicom tool. all of these are available for download in ubuntu's repository. the Arduino Uno R3 is connected to the Orange Pi PC thru the usb port and is communicating to the java app thru JSerialComm lib. I am using Process Builder for integrating the other tools in java, running them as stand alone programs in bash and reading their results thru ProcessBuilder.
\
\
the URL for the backend is: https://smartbin-x0i7.onrender.com
\
the URL for the web app is: https://smartbin-admin.onrender.com
\
the URL for the AI model deployed as an API: https://renz-sy-waste-classification.hf.space/predict
\
\
The Apk companion app can be downloaded here: https://www.mediafire.com/file/qifvpjzu4voeme4/SmartBinApp.apk/file