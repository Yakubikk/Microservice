import express from 'express';
import { join } from 'path';

const app = express();

// Статические файлы из сборки Vite
app.use(express.static(join(process.cwd(), 'dist')));

// Обработка всех роутов для SPA
app.get('*', (req, res) => {
  res.sendFile(join(process.cwd(), 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
