export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.15" }
  public: {
    Tables: {
      escola_participacao_carnaval: {
        Row: { ano: number; escola_id: string; grupo: string }
        Insert: { ano: number; escola_id: string; grupo: string }
        Update: { ano?: number; escola_id?: string; grupo?: string }
        Relationships: [{ foreignKeyName: "escola_participacao_carnaval_escola_id_fkey"; columns: ["escola_id"]; isOneToOne: false; referencedRelation: "escola_samba"; referencedColumns: ["id"] }]
      }
      escola_samba: {
        Row: { created_at: string; id: string; nome: string; slug: string }
        Insert: { created_at?: string; id: string; nome: string; slug: string }
        Update: { created_at?: string; id?: string; nome?: string; slug?: string }
        Relationships: []
      }
      execucao_informacao: {
        Row: { conteudo: Json; execucao_id: string; updated_at: string }
        Insert: { conteudo?: Json; execucao_id: string; updated_at?: string }
        Update: { conteudo?: Json; execucao_id?: string; updated_at?: string }
        Relationships: []
      }
      execucao_video_referencia: {
        Row: { created_at: string; execucao_id: string; storage_path: string; updated_at: string }
        Insert: { created_at?: string; execucao_id: string; storage_path: string; updated_at?: string }
        Update: { created_at?: string; execucao_id?: string; storage_path?: string; updated_at?: string }
        Relationships: []
      }
      trecho_estudo: {
        Row: { analise_musical: Json | null; created_at: string; execucao_id: string; fim_segundos: number; id: string; inicio_segundos: number; nome: string; ordem: number }
        Insert: { analise_musical?: Json | null; created_at?: string; execucao_id: string; fim_segundos: number; id?: string; inicio_segundos: number; nome: string; ordem: number }
        Update: { analise_musical?: Json | null; created_at?: string; execucao_id?: string; fim_segundos?: number; id?: string; inicio_segundos?: number; nome?: string; ordem?: number }
        Relationships: []
      }
      trecho_pessoal: {
        Row: { created_at: string; execucao_id: string; fim_segundos: number; id: string; inicio_segundos: number; nome: string; user_id: string }
        Insert: { created_at?: string; execucao_id: string; fim_segundos: number; id?: string; inicio_segundos: number; nome: string; user_id: string }
        Update: { created_at?: string; execucao_id?: string; fim_segundos?: number; id?: string; inicio_segundos?: number; nome?: string; user_id?: string }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | { schema: keyof DatabaseWithoutInternals }, TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals } ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"]) : never = never> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals } ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends { Row: infer R } ? R : never : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends { Row: infer R } ? R : never : never

export type TablesInsert<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals }, TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals } ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never = never> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals } ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends { Insert: infer I } ? I : never : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Insert: infer I } ? I : never : never

export type TablesUpdate<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals }, TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals } ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never = never> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals } ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends { Update: infer U } ? U : never : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Update: infer U } ? U : never : never

export type Enums<DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals }, EnumName extends DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals } ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"] : never = never> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals } ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName] : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions] : never

export type CompositeTypes<PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals }, CompositeTypeName extends PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals } ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"] : never = never> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals } ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName] : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions] : never

export const Constants = { public: { Enums: {} } } as const
