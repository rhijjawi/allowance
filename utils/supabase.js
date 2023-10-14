// utils/supabase.js

import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
const getSupabase = async (accessToken) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );

  return supabase;
};

export { getSupabase };
