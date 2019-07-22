const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const path = require('path');
const axios = require('axios');
const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('views', path.join(__dirname, "views")); //gràcies a aquesta línia, funciona ara el formulari "contact" amb now i now dev
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	//res.send('Hello World');
	res.render('contact', {layout: false});
});

// Vaig tenir problema amb async i await
// Solució: https://stackoverflow.com/questions/55396788/how-to-fix-await-is-only-valid-in-async-function-error-when-using-nodemailer
app.post("/send", async (req, res) => {
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
	console.log(req.body);

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

	  // send mail with defined transport object
	  let info = await transporter.sendMail({
	    from: '"Hours Contact 👻" <hoursisthefuture@gmail.com>', // sender address
	    to: "jmuntada@gmail.com, jmuntada3@gmail.com", // list of receivers
	    subject: "Hello from Nodemailer test✔", // Subject line
	    text: "Hello world?", // plain text body
	    //html: "<b>Hello world?</b>" // html body
	    html: output // html body
	  });
	  console.log("Message sent: %s", info); //info.messageId
	  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	  res.render('contact', {
	  	layout: false,
	  	msg:'Email has been sent'
	  });
});

app.listen(3000, () => console.log("server started"));

