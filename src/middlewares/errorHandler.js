const errorHandler = (err, req, res, next) => {
    console.error("Erro:", err.message);
    res.status(err.status || 500).json({ error: err.message || "Erro interno no servidor" });
  };
  
  module.exports = errorHandler;