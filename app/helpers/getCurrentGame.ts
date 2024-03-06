import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = 'https://nmpawygvrvljzwkubune.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY ?? ''
const supabase = createClient(supabaseUrl, supabaseKey)

export const getCurrentGame = async () => {
    const { data: game, error } = await supabase.from('games').select('*').eq('finished', false).limit(1);
    if (error || game.length === 0) {
        // if no current game, create a new one!
        const { data: locations, error: locationError } = await supabase
            .from('locations')
            .select('*')
            .order('times_played', { ascending: true })
            .limit(1);
        const nextLocation = locations?.[0];
        // create new game for new location
        let { data: game, error: newGameError } = await supabase.from('games')
            .upsert({ 
                latitude: nextLocation?.['latitude'], 
                longitude: nextLocation?.['longitude'], 
                finished: false 
            }).select()
        return game
    } else {
        return game[0];
    }
}

// getCurrentGame();