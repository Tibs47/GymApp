import { createClient } from '@supabase/supabase-js';
import { environment } from './environment';

const supabaseUrl = environment.supabaseUrl;
const supabaseKey = environment.supabaseBypassKey;

export const supabase = createClient(supabaseUrl, supabaseKey);
