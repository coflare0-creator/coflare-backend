import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
dotenv.config();

const supabaseUrl = String(process.env.SUPABASE_URL);
const supabaseKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY);

export const supabase = createClient(supabaseUrl!, supabaseKey!);
