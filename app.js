/* Modules */
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require("https");

/* Activate modules */
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mailchimp.setConfig({
	apiKey: "",
	server: "",
});

/* GET Requests */
app.get("/", function (_req, res) {
	res.sendFile(__dirname + "/signup.html");
});

app.get("/success.html", function (_req, res) {
	res.sendFile(__dirname + "/success.html");
});

app.get("/failure.html", function (_req, res) {
	res.sendFile(__dirname + "/failure.html");
});

/* POST Requests */
app.post("/", function (req, res) {
	const firstName = req.body.fName;
	const lastName = req.body.lName;
	const email = req.body.email;

	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	const jsonData = JSON.stringify(data);
	const url = "";
	const options = {
		method: "POST",
		auth: "cecilia:",
	};

	const Request = https.request(url, options, function (response) {
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}

		response.on("data", function (data) {
			console.log(JSON.parse(data));
		});
	});

	Request.write(jsonData);
	Request.end();
});

app.post("/failure.html", function (_req, res) {
	res.redirect("/");
});

/* Server port check */
const server = app.listen(process.env.PORT || 3000, () => {
	const port = server.address().port;
	console.log(`Express is working on port ${port}`);
});

/* Mailchimp check */
async function callPing() {
	const response = await mailchimp.ping.get();
	console.log(response);
}
callPing();
