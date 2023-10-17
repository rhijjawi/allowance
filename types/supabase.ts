export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface ExpenseSchema {
    amount: number
    created_at?: string
    currency: string
    category : number[] 
    id?: number
    label: string
    refunded: boolean
    transaction_date: string
    user_id: string | unknown
    recurring: boolean
    files: string[]
    standardizedCurrency? : number
} 
export interface CategorySchema{
  category: string
  id?: number
  subcategories: Json[]
}
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          category: string | null
          id: number
          subcategories: Json[]
        }
        Insert: {
          category?: string | null
          id?: number
          subcategories?: Json[]
        }
        Update: {
          category?: string | null
          id?: number
          subcategories?: Json[]
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category_id: number
          created_at: string
          currency: string
          id: number
          label: string | null
          refunded: boolean
          transaction_date: string
          user_id: string
        }
        Insert: {
          amount?: number
          category_id?: number
          created_at?: string
          currency: string
          id?: number
          label?: string | null
          refunded?: boolean
          transaction_date: string
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: number
          created_at?: string
          currency?: string
          id?: number
          label?: string | null
          refunded?: boolean
          transaction_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
