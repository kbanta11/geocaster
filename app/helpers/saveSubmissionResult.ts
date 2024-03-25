import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = 'https://nmpawygvrvljzwkubune.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY ?? ''
const supabase = createClient(supabaseUrl, supabaseKey)

export const saveSubmissionResult = async (user: string, isCorrect: boolean, currentGame: any): Promise<any> => {
    if (isCorrect) {
        // end game and save user as winner and increment location times played and 
        // award points (50 + 1 for every incorrect guess), -5 for second try, -15 for third try
        
    } else {
        // save user game_play as incorrect
    }
}