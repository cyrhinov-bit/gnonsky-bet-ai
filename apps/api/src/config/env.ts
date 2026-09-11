import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback

export const CONFIG = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'dummy-anon-key',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-key',
  
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o',
  
  BETSTUDY_BASE_URL: process.env.BETSTUDY_BASE_URL || 'https://www.betstudy.com',
  BETSTUDY_RATE_LIMIT_MS: process.env.BETSTUDY_RATE_LIMIT_MS ? parseInt(process.env.BETSTUDY_RATE_LIMIT_MS, 10) : 1500,
  
  ADMIN_API_KEY: process.env.ADMIN_API_KEY || 'admin-secret-key-123',
  JWT_SECRET: process.env.JWT_SECRET || 'jwt-secret-key-betpulse-32chars'
};

