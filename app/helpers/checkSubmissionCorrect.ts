import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = 'https://nmpawygvrvljzwkubune.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY ?? ''
const supabase = createClient(supabaseUrl, supabaseKey)

export const checkSubmissionCorrect = async (value: string | undefined, game: any): Promise<boolean> => {
    const { data: locations } = await supabase.from('locations').select('*').eq('latitude', game?.latitude).eq('longitude', game?.longitude).limit(1);
    if (locations && locations?.length > 0) {
        const location = locations[0];
        const country = location?.country;
        // better matching with llm?
        if (country.toLowerCase() === value?.toLowerCase()) {
            return true;
        }
    }
    return false;
}