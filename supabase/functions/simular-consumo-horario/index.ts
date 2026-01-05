import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Dispositivo {
  id: string;
  nombre: string;
  potencia_w: number;
  user_id: string;
}

interface ConsumoHorario {
  dispositivo_id: string;
  ts: string;
  consumo_kwh: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. Leer todos los dispositivos desde la tabla dispositivos
    const { data: dispositivos, error: fetchError } = await supabase
      .from("dispositivos")
      .select("id, nombre, potencia_w, user_id");

    if (fetchError) {
      throw new Error(`Error fetching devices: ${fetchError.message}`);
    }

    if (!dispositivos || dispositivos.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No devices found", 
          registros_creados: 0 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // 2. Crear timestamp actual (truncado a la hora actual)
    const now = new Date();
    now.setMinutes(0, 0, 0); // Truncar a la hora completa
    const timestamp = now.toISOString();

    // 3. Para cada dispositivo, simular el consumo energético horario
    const consumosHorarios: ConsumoHorario[] = [];

    for (const dispositivo of dispositivos as Dispositivo[]) {
      const potencia_w = dispositivo.potencia_w || 0;
      
      // Aplicar la fórmula especificada:
      // variacion = 0.7 + random * 0.6       // 70% – 130%
      const variacion = 0.7 + Math.random() * 0.6;
      
      // factor_uso = 0.3 + random * 0.7      // 30% – 100%
      const factor_uso = 0.3 + Math.random() * 0.7;
      
      // consumo_kwh = (potencia_w * variacion * factor_uso) / 1000
      const consumo_kwh = (potencia_w * variacion * factor_uso) / 1000;
      
      // Redondear consumo_kwh a 3 decimales
      const consumo_kwh_redondeado = Math.round(consumo_kwh * 1000) / 1000;

      consumosHorarios.push({
        dispositivo_id: dispositivo.id,
        ts: timestamp,
        consumo_kwh: consumo_kwh_redondeado,
      });
    }

    // 4. Insertar un registro en dispositivo_consumo_horario
    // Usar upsert para evitar duplicados (unique constraint en dispositivo_id, ts)
    const { data: insertedData, error: insertError } = await supabase
      .from("dispositivo_consumo_horario")
      .upsert(consumosHorarios, {
        onConflict: "dispositivo_id,ts",
        ignoreDuplicates: false,
      })
      .select();

    if (insertError) {
      throw new Error(`Error inserting consumption data: ${insertError.message}`);
    }

    // 5. Retornar un JSON con el número de registros creados
    const registrosCreados = insertedData?.length || consumosHorarios.length;

    return new Response(
      JSON.stringify({
        success: true,
        timestamp,
        registros_creados: registrosCreados,
        dispositivos_procesados: dispositivos.length,
        detalles: consumosHorarios.map((c) => ({
          dispositivo_id: c.dispositivo_id,
          consumo_kwh: c.consumo_kwh,
        })),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in simular-consumo-horario:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
