import { supabase } from "../config/supabase";

interface DashboardStats {
  total_reports: number;
  states_covered: number;
  citizens_protected: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data, error } = await supabase.rpc("get_dashboard");

  if (error)
    throw new Error(`Failed to fetch dashboard stats: ${error.message}`);

  return data as DashboardStats;
};
