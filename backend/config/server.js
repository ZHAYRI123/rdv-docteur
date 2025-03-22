import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
//import royes creer (ex:import routes from './routes/index.js';)

dotenv.config();
const app = express();

// Connexion MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(Serveur sur http://localhost:${PORT}));
