# SmartBin

Trash Bin that automatically segregates wet, dry, and metallic materials. It also detects when the bins are full and can be monitored online through a MERN web app.

## Backend NPM modules setup
### Run this command in the directory of the backend
-npm install express  mongoose cors  dotenv nodemailer jsonwebtoken bcryptjs cookie-parser body-parser \
-npm install nodemon -D

## Arduino Code additional Info
The code is written specifically for Arduino Uno R3 model. Please don't forget to download and install the additional libraries for the sensors and actuators to work. \
### List of Libraries used:
-Servo by Michael Margolis \
-DHT Sensor library by Adafruit \
-LiquidCrystal I2C by Frank de Brabander