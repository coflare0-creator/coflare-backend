import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
dotenv.config();

const node_env = process.env.NODE_ENV;

const supabaseUrl =
  node_env === "development"
    ? String(process.env.SUPABASE_URL)
    : String(process.env.SUPABASE_URL_PROD);

const supabaseKey =
  node_env === "development"
    ? String(process.env.SUPABASE_SERVICE_ROLE_KEY)
    : String(process.env.SUPABASE_SERVICE_ROLE_KEY_PROD);

export const supabase = createClient(supabaseUrl!, supabaseKey!);
