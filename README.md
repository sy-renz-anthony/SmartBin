# SmartBin

Trash Bin that automatically segregates wet, dry, and metallic materials. It also detects when the bins are full and can be monitored online through a MERN web app.

## Backend NPM modules setup
### Run this command in the directory of the backend
-npm install express  mongoose cors  dotenv nodemailer jsonwebtoken bcryptjs cookie-parser body-parser \
-npm install nodemon -D

### About the .env file
I excluded the .env file that was suppose to be inside of the backend folder for security purposes since it would expose the accounts I used for some of the external services I used to build this app. Please just create your own .env file inside of the backend folder and follow this format: \
\
\
MONGO_URI= <*URL of your mongodb collection>/SmartBin \
PORT= <*the port where your server runs> \
SALT= <*integer number used to encrypt the password> \
NODE_ENV= <you can put in either development or production in here, enclose it with '     '> \
JWT_SECRET=<10 character string used to encrypt jwt token, enclose it with '     '> \
\
SMTP_USERNAME=<the username for your smtp service, enclose it with '     '> \
SMTP_PASSWORD=<the password for your smtp service, enclose it with '     '> \
SMTP_HOST=<the url of the host for your smtp service, enclose it with '     '> \
SMTP_PORT=<the port for your smtp service, since this is an integer, just don't enclose it whith '     '> \
SENDER_EMAIL_ID=<the email address used as sender for your smtp service, enclose it with '     '>  \

* I am using various external services to build this app, you can use the same service provider I signed up for since they are free or you can use your own. I am using mongo DB for my database, you can visit them at: https://www.mongodb.com/ and signup for a free account. I want to stress out that although there is a local version of mongodb you can install on your machine, it is advisable to use the online mongo DB instead since I am using mongoose session on my code. they are similar to transactions in RDBMS and this feature requires replica sets. A functionality not automatically set up on mongodb local versions, unless you can set it up on your local machine yourself, you need to use the online mongo DB instead or else the code will not work. Also, I am using brevo as my smtp service provider for the email functionality. You can visit them at: https://www.brevo.com/ and signup for a free account. After setting it up they will provide you with the values needed to make the email functionality work such as SMTP_USERNAME, SMTP_PASSWORD, and the rest.

## Arduino Code additional Info
The code is written specifically for Arduino Uno R3 model. Please don't forget to download and install the additional libraries for the sensors and actuators to work.
### List of Libraries used:
-Servo by Michael Margolis \
-DHT Sensor library by Adafruit \
-LiquidCrystal I2C by Frank de Brabander