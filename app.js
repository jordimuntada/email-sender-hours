const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

// View engine setup
app.engine('handlebars', exphbs());
app.set('views', path.join(__dirname, "views")); //gràcies a aquesta línia, funciona ara el formulari "contact" amb now i now dev
app.set('view engine', 'handlebars');

/************************* CORS configuration ******************************/
/*
var allowedOrigins = ['http://localhost:3000',
					  'http://hoursapp.es'];

var corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// CORS config
app.use(
	cors({
	origin: '*',
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options('*', cors());
*/
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', "*");
	res.header(
		'Access-Control-Allow-Headers', 
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	if(req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

/************************* End CORS configuration ******************************/

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('I am an Email Sender for Hours app!');
	//res.render('contact', {layout: false});
});
console.log("------------------->  fora de app.post");
// Vaig tenir problema amb async i await
// Solució: https://stackoverflow.com/questions/55396788/how-to-fix-await-is-only-valid-in-async-function-error-when-using-nodemailer
app.post("/send", async (req, res) => {
	//res.header("Access-Control-Allow-Origin", "*");
    //res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    //res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	console.log("------------------->  dins de app.post");
	console.log(req.body);
	res.send(req.body);
	const output =`
		<p> You have a new contact request </p>
		<h3> Contact Details </h3>
		<ul>
			<li> Name: ${req.body.name}</li>
			<li> Company: ${req.body.company}</li>
			<li> Email: ${req.body.email}</li>
			<li> Phone: ${req.body.phone}</li>
		</ul>
		<h3> Message </h3>
		<p> ${req.body.message} </p>
	`;
	

	// create reusable transporter object using the default SMTP transport
	  let transporter = nodemailer.createTransport({
	    //host: "smtp.hostalia.com",
	    //port: 587,
	    host: 'smtp.gmail.com',
    	port: 465,
	    secure: true, // true for 465, false for other ports
	    auth: {
	      user: "hoursisthefuture@gmail.com", //"info@hours.es", // generated ethereal user
	      pass: "somelfutur2018" //"Hours2019" // generated ethereal password
	    }/*,
	    tls: {
	    	rejectUnauthorized: false
	    }*/
	  });
console.log("------------> FUNCIONA createTransport ");
	  // send mail with defined transport object
	  let info = await transporter.sendMail({
	    from: '"Hours Contact 👻" <hoursisthefuture@gmail.com>', // sender address
	    to: "jmuntada@gmail.com, jmuntada3@gmail.com", // list of receivers
	    subject: "Hello from Hours ✔", // Subject line
	    text: "Hello world?", // plain text body
	    //html: "<b>Hello world?</b>" // html body
	    html: output // html body
	  });
console.log("------------> FUNCIONA sendMail ");
	  console.log("Message sent: %s", info); //info.messageId
	  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	  res.render('contact', {
	  	layout: false,
	  	msg:'Email has been sent'
	  });
});

app.listen(process.env.PORT, () => console.log("server started at port: ", process.env.PORT));

