// supabase.js
const supabase = supabase.createClient(
  'https://gbqgtnukoucxagswqspx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicWd0bnVrb3VjeGFnc3dxc3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4ODcwNTAsImV4cCI6MjA2NjQ2MzA1MH0.uHqKZ-KnW1sv7CSD37D6dh1qYfSLMznud947DEZI93Q',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);
