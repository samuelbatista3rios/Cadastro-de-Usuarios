require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const swaggerDocs = require("./config/swagger");

const app = express();
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo de 100 requisições por IP
});

// Conectar ao Banco de Dados antes de iniciar o servidor
connectDB().then(() => {
  app.use(express.json());
  app.use(cors());
  app.use(limiter);
  app.use(morgan("dev"));
  app.use(routes);


  swaggerDocs(app);

  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
}).catch((err) => {
  console.error("Erro ao conectar ao banco de dados:", err);
  process.exit(1);
});
