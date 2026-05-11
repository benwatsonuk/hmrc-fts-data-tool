import app from "./app";

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`FTS Data Tool Server running on port ${PORT}`);
});