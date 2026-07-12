import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://slreigjhnfhsffisxqws.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYxYjhhMjAxLTE4MzktNDFkZS1iY2UxLTAxMTkyOGM0YWFkMiJ9.eyJwcm9qZWN0SWQiOiJzbHJlaWdqaG5maHNmZmlzeHF3cyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc4Nzc1NTg0LCJleHAiOjIwOTQxMzU1ODQsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.sDB8qZa5AX1RwKSHjYKomerrS0jeVxPDgcqE-CLqwns';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };