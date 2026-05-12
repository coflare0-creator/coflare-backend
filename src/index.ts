import app from "./app";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  app.listen(PORT, () =>
    console.log(`Server listening on port http://localhost:${PORT}`),
  );
};

if (require.main === module) {
  startServer();
}
