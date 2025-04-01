//Nodemailer pour envoyer des e-mails
const nodemailer = require('nodemailer');
//Charge les variables d’environnement depuis le fichier .env
require('dotenv').config();
const express = require('express');
//Permet de sécuriser les routes avec des tokens.
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const emailRouter = express.Router();

// fonction protège les routes en s’assurant qu’un utilisateur est authentifié avec un token JWT
function authenticateToken(req, res, next) {
	const token = req.headers['authorization'];

	if (!token) {
		return res.status(401).send('Token not provided');
	}

	const tokenParts = token.split(' ');
	const jwtToken = tokenParts[1];

	//Vérifie s'il est valide avec jwt.verify().
    jwt.verify(jwtToken, JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(403).send('Invalid token');
		}
		req.user = decoded;
		next();
	});
}

//Crée un "transporteur" qui va permettre d’envoyer des emails.
const transporter = nodemailer.createTransport({ 
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, //On utilise le port 587, qui fonctionne avec un système de chiffrement (STARTTLS).Si on utilisait le port 465, il faudrait mettre secure: true.
	auth: {
		user: process.env.EMAIL,
		pass: process.env.APP_PASSWORD,
	},
});

const rejectionMail = (to, receiver_name, sender_name, reason) => {
	const mailOptions = {
		from: process.env.EMAIL,
		to: to,
		subject: 'Consultation Rejection',
		text: `Dear ${receiver_name},\n\nYour consultation with Dr. ${sender_name} has been rejected. \nReason: ${reason}\n\nRegards,\nBasmah_Hospital`,
		html: `<p>Dear ${receiver_name},</p><br><p>Your consultation with Dr. ${sender_name} has been rejected.</p><p><b>Reason</b>: ${reason}.</p><br><p>Regards,</p><p>Basmah_Hospital</p>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else {
			console.log('Email Envoyé: ' + info.response);
		}
	});
};

const appointmentMail = (to, receiver_name, sender_name, Specialité, date, time) => {
	const mailOptions = {
		from: process.env.EMAIL,
		to: to,
		subject: 'Appointment Confirmed',
		text: `Dear ${receiver_name},\n\nYour consultation with Dr. ${sender_name} has been confirmed.\nSpecialité: ${Specialité}\nDate: ${date}\nHeure: ${time}\n\nRegards,\nBasmah_Hospital`,
		html: `<p>Dear ${receiver_name},</p><br><p>Your consultation with Dr. ${sender_name} has been confirmed.</p><p><b>Specialité</b>: ${Specialité}</p><p><b>Location</b>: ${location}</p><p><b>Date</b>: ${date}</p><p><b>Heure</b>: ${time}</p><br><p>Regards,</p><p>Basmah_Hospital</p>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else {
			console.log('Email Envoyé: ' + info.response);
		}
	});
};

const completionMail = (to, receiver_name, sender_name, Doc_Email) => {
	const mailOptions = {
		from: process.env.EMAIL,
		to: to,
		subject: 'Consultation Completed',
		text: `Dear ${receiver_name},\n\nYour consultation with Dr. ${sender_name} has been completed. Hope you have received the proper treatment. If you have any querries, doubts or problems, please contact Dr. ${sender_name} through their email address: ${Doc_Email} for the NEXT 7 DAYS.\n\nRegards,\nBasmah_Hospital`,
		html: `<p>Dear ${receiver_name},</p><br><p>Your consultation with Dr. ${sender_name} has been completed. Hope you have received the proper treatment. If you have any querries, doubts or problems, please go to 'Your Consultations' on the website and submit your feedback through the 'Feedback' option in the Completed Consulations section.</p> <p>
		Please note, this will be valid for the <b>NEXT 7 DAYS</b> only.</p><br><p>Regards,</p><p>Basmah_Hospital</p>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
};

const feedbackMail = (to, receiver_name, sender_name) => {
	const mailOptions = {
		from: process.env.EMAIL,
		to: to,
		subject: 'You have received a feedback!',
		text: `Hello Dr. ${receiver_name},\n You have received a feedback from your patient ${sender_name}. Please click the feedback button in the 'COMPLETED CONSULTATIONS' section to view the feedback.\n\n Regards,\nBasmah_Hospital`,
		html: `<p>Hello Dr. ${receiver_name},</p><p>You have received a feedback from your patient ${sender_name}. Please click the feedback button in the 'COMPLETED CONSULTATIONS' section to view the feedback.</p><br><p>Regards,</p><p>Basmah_Hospital</p>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
};

const replyMail = (to, receiver_name, sender_name) => {
	const mailOptions = {
		from: process.env.EMAIL,
		to: to,
		subject: 'You have received a reply!',
		text: `Hello ${receiver_name},\n You have received a reply from Dr. ${sender_name}. Please click the feedback button in the 'COMPLETED CONSULTATIONS' section to view the reply.\n\n Regards,\nOMCS`,
		html: `<p>Hello ${receiver_name},</p><p>You have received a reply from Dr. ${sender_name}. Please click the reply button in the 'COMPLETED CONSULTATIONS' section to view the reply.</p><br><p>Regards,</p><p>OMCS</p>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
};

emailRouter.post('/sendMail', authenticateToken, async (req, res) => {
	try {
		const { to, Doc_Email, context, receiver_name, sender_name, Specialité, date, time, reason} = req.body;
		if (context === 'rejection') {
			rejectionMail(to, receiver_name, sender_name, reason);
		}
		if (context === 'appointment') {
			appointmentMail(to, receiver_name, sender_name, Specialité, date, time);
		}
		if (context === 'completion') {
			completionMail(to , receiver_name, sender_name, Doc_Email);
		}
		if (context === 'feedback') {
			feedbackMail(to, receiver_name, sender_name);
		}
		if (context === 'reply') {
			replyMail(to, receiver_name, sender_name);
		}
		return res.status(200).json({ message: 'Mail sent' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

module.exports = emailRouter;