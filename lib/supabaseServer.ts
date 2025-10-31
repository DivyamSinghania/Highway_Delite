// lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gpdjacajxnqianxiqxon.supabase.co';
// const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwZGphY2FqeG5xaWFueGlxeG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4ODg1OTksImV4cCI6MjA3NzQ2NDU5OX0.n-b9_jO8cBr6S-EX3ly_aCb3oMyjMG3sXLMT-yhb7tw';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwZGphY2FqeG5xaWFueGlxeG9uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTg4ODU5OSwiZXhwIjoyMDc3NDY0NTk5fQ.87bWrA24MV2969aTp7vBYf0BmuE-V-BCQEj2gy0u3A0';

export const supabaseServer = createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY);
