import { connectDatabase } from './config/database';
import { createApp } from './app';

async function bootstrap() {
  await connectDatabase();
  const app = createApp();

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Orders-Service running on port ${port}`);
  });
}

bootstrap().catch(err => {
  console.error('Failed to start application:', err);
});
