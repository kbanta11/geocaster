import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = 'https://nmpawygvrvljzwkubune.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY ?? ''
const supabase = createClient(supabaseUrl, supabaseKey)

export const getUserCanPlay = async (currentGame: any, accountAddress: string) => {
    const { data: userPlays, error } = await supabase.from('game_plays').select('*').eq('game_id', currentGame.id).eq('user_address', accountAddress);
    console.log(`-- User Plays: ${JSON.stringify(userPlays)} / error: ${JSON.stringify(error)}`);
    if (!userPlays || userPlays?.length >= 3) {
        return false
    }
    return true
}