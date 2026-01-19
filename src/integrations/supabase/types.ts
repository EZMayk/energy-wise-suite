export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      consumo_usuarios: {
        Row: {
          consumo_kwh: number
          created_at: string
          dispositivo_id: string | null
          fecha: string
          id: string
          user_id: string
        }
        Insert: {
          consumo_kwh: number
          created_at?: string
          dispositivo_id?: string | null
          fecha: string
          id?: string
          user_id: string
        }
        Update: {
          consumo_kwh?: number
          created_at?: string
          dispositivo_id?: string | null
          fecha?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consumo_usuarios_dispositivo_id_fkey"
            columns: ["dispositivo_id"]
            isOneToOne: false
            referencedRelation: "dispositivos"
            referencedColumns: ["id"]
          },
        ]
      }
      dispositivo_consumo_diario: {
        Row: {
          consumo_kwh: number
          created_at: string
          dispositivo_id: string
          fecha: string
          id: string
        }
        Insert: {
          consumo_kwh: number
          created_at?: string
          dispositivo_id: string
          fecha: string
          id?: string
        }
        Update: {
          consumo_kwh?: number
          created_at?: string
          dispositivo_id?: string
          fecha?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispositivo_consumo_diario_dispositivo_id_fkey"
            columns: ["dispositivo_id"]
            isOneToOne: false
            referencedRelation: "dispositivos"
            referencedColumns: ["id"]
          },
        ]
      }
      dispositivo_consumo_horario: {
        Row: {
          consumo_kwh: number
          created_at: string
          dispositivo_id: string
          id: string
          ts: string
        }
        Insert: {
          consumo_kwh: number
          created_at?: string
          dispositivo_id: string
          id?: string
          ts: string
        }
        Update: {
          consumo_kwh?: number
          created_at?: string
          dispositivo_id?: string
          id?: string
          ts?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispositivo_consumo_horario_dispositivo_id_fkey"
            columns: ["dispositivo_id"]
            isOneToOne: false
            referencedRelation: "dispositivos"
            referencedColumns: ["id"]
          },
        ]
      }
      dispositivos: {
        Row: {
          created_at: string
          id: string
          nombre: string
          potencia_w: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nombre: string
          potencia_w?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nombre?: string
          potencia_w?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      metricas_usabilidad: {
        Row: {
          accion: string
          formulario: string
          id: string
          metadata: Json | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          accion: string
          formulario: string
          id?: string
          metadata?: Json | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          accion?: string
          formulario?: string
          id?: string
          metadata?: Json | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          configuracion_accesibilidad: Json | null
          created_at: string
          email: string
          id: string
          nombre: string
          perfil_accesibilidad:
            | Database["public"]["Enums"]["perfil_accesibilidad"]
            | null
          updated_at: string
        }
        Insert: {
          configuracion_accesibilidad?: Json | null
          created_at?: string
          email: string
          id: string
          nombre: string
          perfil_accesibilidad?:
            | Database["public"]["Enums"]["perfil_accesibilidad"]
            | null
          updated_at?: string
        }
        Update: {
          configuracion_accesibilidad?: Json | null
          created_at?: string
          email?: string
          id?: string
          nombre?: string
          perfil_accesibilidad?:
            | Database["public"]["Enums"]["perfil_accesibilidad"]
            | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      insert_daily_consumption: {
        Args: { _date?: string; _hours_per_day?: number }
        Returns: undefined
      }
      insert_hourly_consumption: {
        Args: { _date?: string; _device_id?: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "usuario"
      perfil_accesibilidad:
        | "visual"
        | "auditiva"
        | "motriz"
        | "cognitiva"
        | "ninguna"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "usuario"],
      perfil_accesibilidad: [
        "visual",
        "auditiva",
        "motriz",
        "cognitiva",
        "ninguna",
      ],
    },
  },
} as const
