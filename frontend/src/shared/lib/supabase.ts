import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://fpohpcpdejokkvhormqa.supabase.co"
const supabaseAnonKey = "sb_publishable_BFn88eCB9XsJovhsA6knxw_G0DQD-7k"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)