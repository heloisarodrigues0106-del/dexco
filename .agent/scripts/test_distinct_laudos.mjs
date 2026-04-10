import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não encontradas no .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
    const { data } = await supabase.from('tb_laudo').select('insalubridade, periculosidade, do_mental, do_ergonomica');

    const unique = (arr) => [...new Set(arr)];

    const result = {
        Insalubridade: unique(data.map(d => d.insalubridade)),
        Periculosidade: unique(data.map(d => d.periculosidade)),
        Mental: unique(data.map(d => d.do_mental)),
        Ergo: unique(data.map(d => d.do_ergonomica))
    };
    fs.writeFileSync(resolve(__dirname, 'distinct.json'), JSON.stringify(result, null, 2));
}

run();
