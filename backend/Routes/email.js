//Nodemailer pour envoyer des e-mails
import nodemailer from 'nodemailer';
//Charge les variables d’environnement depuis le fichier .env
import dotenv from 'dotenv';
import express from 'express';
//Permet de sécuriser les routes avec des tokens.
import jwt from 'jsonwebtoken';

dotenv.config();
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
		subject: 'Rejet de consultation',
		text: `Cher(e) ${receiver_name},\n\nVotre consultation avec le Dr. ${sender_name} a été rejetée.\nRaison : ${reason}\n\nCordialement,\nBasmah_Hospital`,
		html: `<p>Cher(e) ${receiver_name},</p><br><p>Votre consultation avec le Dr. ${sender_name} a été rejetée.</p><p><b>Raison</b> : ${reason}.</p><br><p>Cordialement,</p><p>Basmah_Hospital</p>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else {
			console.log('E-mail envoyé : ' + info.response);
		}
	});
};

//Confirmation d’un rendez-vous
const appointmentMail = (to, receiver_name, sender_name, Specialité, date, time) => {
	const mailOptions = {
		from: process.env.EMAIL,
		to: to,
		subject: 'Rendez-vous confirmé',
		text: `Cher(e) ${receiver_name},\n\nVotre consultation avec le Dr. ${sender_name} a été confirmée.\nSpécialité : ${Specialité}\nDate : ${date}\nHeure : ${time}\n\nCordialement,\nBasmah_Hospital`,
		html: `<p>Cher(e) ${receiver_name},</p><br><p>Votre consultation avec le Dr. ${sender_name} a été confirmée.</p><p><b>Spécialité</b> : ${Specialité}</p><p><b>Date</b> : ${date}</p><p><b>Heure</b> : ${time}</p><br><p>Cordialement,</p><p>Basmah_Hospital</p>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else {
			console.log('E-mail envoyé : ' + info.response);
		}
	});
};

//Email de fin de consultation
const completionMail = (to, receiver_name, sender_name, Doc_Email) => {
	const mailOptions = {
		from: process.env.EMAIL,
		to: to,
		subject: 'Consultation terminée',
		text: `Cher(e) ${receiver_name},\n\nVotre consultation avec le Dr. ${sender_name} est terminée. Nous espérons que vous avez reçu le traitement approprié. Si vous avez des questions, des doutes ou des problèmes, veuillez contacter le Dr. ${sender_name} à l'adresse e-mail suivante : ${Doc_Email} dans les 7 prochains jours.\n\nCordialement,\nBasmah_Hospital`,
		html: `<p>Cher(e) ${receiver_name},</p><br><p>Votre consultation avec le Dr. ${sender_name} est terminée. Nous espérons que vous avez reçu le traitement approprié.</p><p>Si vous avez des questions ou des préoccupations, vous pouvez soumettre un avis via la section "Consultations terminées" sur notre site web.</p><p><b>Attention</b> : Cette option est valable uniquement pendant les <b>7 prochains jours</b>.</p><br><p>Cordialement,</p><p>Basmah_Hospital</p>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else {
			console.log('E-mail envoyé : ' + info.response);
		}
	});
};

//Email de réception d’un avis (feedback)
const feedbackMail = (to, receiver_name, sender_name) => {
	const mailOptions = {
		from: process.env.EMAIL,
		to: to,
		subject: 'Vous avez reçu un avis !',
		text: `Bonjour Dr. ${receiver_name},\n\nVous avez reçu un avis de votre patient(e) ${sender_name}. Veuillez cliquer sur le bouton "Avis" dans la section "CONSULTATIONS TERMINÉES" pour le consulter.\n\nCordialement,\nBasmah_Hospital`,
		html: `<p>Bonjour Dr. ${receiver_name},</p><p>Vous avez reçu un avis de votre patient(e) ${sender_name}. Veuillez cliquer sur le bouton "Avis" dans la section "CONSULTATIONS TERMINÉES" pour le consulter.</p><br><p>Cordialement,</p><p>Basmah_Hospital</p>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else {
			console.log('E-mail envoyé : ' + info.response);
		}
	});
};

//Email de réponse à un avis
const replyMail = (to, receiver_name, sender_name) => {
	const mailOptions = {
		from: process.env.EMAIL,
		to: to,
		subject: 'Vous avez reçu une réponse !',
		text: `Bonjour ${receiver_name},\n\nVous avez reçu une réponse du Dr. ${sender_name}. Veuillez cliquer sur le bouton "Réponse" dans la section "CONSULTATIONS TERMINÉES" pour la consulter.\n\nCordialement,\nOMCS`,
		html: `<p>Bonjour ${receiver_name},</p><p>Vous avez reçu une réponse du Dr. ${sender_name}. Veuillez cliquer sur le bouton "Réponse" dans la section "CONSULTATIONS TERMINÉES" pour la consulter.</p><br><p>Cordialement,</p><p>OMCS</p>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else {
			console.log('E-mail envoyé : ' + info.response);
		}
	});
};

//Route API pour envoyer un e-mail
emailRouter.post('/sendMail', authenticateToken, async (req, res) => {
	try {
		const { to, Doc_Email, context, receiver_name, sender_name, Specialité, date, time, reason } = req.body;

		if (context === 'rejection') {
			rejectionMail(to, receiver_name, sender_name, reason);
		}
		if (context === 'appointment') {
			appointmentMail(to, receiver_name, sender_name, Specialité, date, time);
		}
		if (context === 'completion') {
			completionMail(to, receiver_name, sender_name, Doc_Email);
		}
		if (context === 'feedback') {
			feedbackMail(to, receiver_name, sender_name);
		}
		if (context === 'reply') {
			replyMail(to, receiver_name, sender_name);
		}

		return res.status(200).json({ message: 'E-mail envoyé' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Erreur interne du serveur' });
	}
});

export default emailRouter;