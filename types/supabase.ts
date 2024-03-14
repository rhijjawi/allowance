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
    category: [number, number]
    id?: number
    label: string
    refunded: boolean
    transaction_date: Date
    user_id: string | unknown
    recurring: boolean
    standardizedCurrency?: number
    is_displayed?: boolean
    files: string[]
}
export interface IncomeSchema {
    amount: number
    currency: string
    category: [number, number]
    id?: number
    label: string
    transaction_date: string
    user_id: string | unknown
    recurring: boolean
    files: string[]
    standardizedCurrency?: number
}
export interface CategorySchema {
    category: string
    id: number
    subcategories: string[]
}
export type Database = {
    public: {
        Tables: {
            categories: {
                Row: {
                    category: string
                    id: number
                    subcategories: string[]
                }
                Insert: {
                    category: string
                    id?: number
                    subcategories?: Json[]
                }
                Update: {
                    category?: string
                    id?: number
                    subcategories?: Json[]
                }
                Relationships: []
            }
            codes: {
                Row: {
                    code: string
                    id: number
                    parentId: string
                }
                Insert: {
                    code: string
                    id?: number
                    parentId: string
                }
                Update: {
                    code?: string
                    id?: number
                    parentId?: string
                }
                Relationships: []
            }
            debts: {
                Row: {
                    debt_name: string
                    due_date: string
                    generic_icon: string | null
                    id: number
                    initial_amt: number
                    initial_curr: string
                    interest_rate: number
                    minimum_mtly: number
                    outstanding_bal: number | null
                    past_pmts: Json | null
                    status: string
                    user_id: string | null
                }
                Insert: {
                    debt_name: string
                    due_date: string
                    generic_icon?: string | null
                    id?: number
                    initial_amt: number
                    initial_curr: string
                    interest_rate: number
                    minimum_mtly?: number
                    outstanding_bal?: number | null
                    past_pmts?: Json | null
                    status?: string
                    user_id?: string | null
                }
                Update: {
                    debt_name?: string
                    due_date?: string
                    generic_icon?: string | null
                    id?: number
                    initial_amt?: number
                    initial_curr?: string
                    interest_rate?: number
                    minimum_mtly?: number
                    outstanding_bal?: number | null
                    past_pmts?: Json | null
                    status?: string
                    user_id?: string | null
                }
                Relationships: []
            }
            expenses: {
                Row: {
                    amount: number
                    standardizedCurrency?: number
                    category: [number, number]
                    created_at: string
                    currency: string
                    files: Json
                    id: number
                    is_displayed: boolean | null
                    label: string | null
                    recurring: boolean
                    refunded: boolean
                    transaction_date: string
                    user_id: string
                }
                Insert: {
                    amount?: number
                    category: [number, number]
                    created_at?: string
                    currency: string
                    files?: string[]
                    id?: number
                    is_displayed?: boolean | null
                    label?: string | null
                    recurring?: boolean
                    refunded?: boolean
                    transaction_date: string
                    user_id: string
                }
                Update: {
                    amount?: number
                    category?: [number, number]
                    created_at?: string
                    currency?: string
                    files?: Json
                    id?: number
                    is_displayed?: boolean | null
                    label?: string | null
                    recurring?: boolean
                    refunded?: boolean
                    transaction_date?: string
                    user_id?: string
                }
                Relationships: []
            }
            income: {
                Row: {
                    amount: number
                    category: [number, number]
                    currency: string
                    files: Json
                    id: number
                    label: string | null
                    recurring: boolean
                    transaction_date: string
                    user_id: string
                }
                Insert: {
                    amount: number
                    category: [number, number]
                    currency: string
                    files?: Json
                    id?: number
                    label?: string | null
                    recurring: boolean
                    transaction_date: string
                    user_id: string
                }
                Update: {
                    amount?: number
                    category?: [number, number]
                    currency?: string
                    files?: Json
                    id?: number
                    label?: string | null
                    recurring?: boolean
                    transaction_date?: string
                    user_id?: string
                }
                Relationships: []
            }
            incomeCategories: {
                Row: {
                    category: string
                    id: number
                    subcategories: string | Json
                }
                Insert: {
                    category: string
                    id?: number
                    subcategories: Json
                }
                Update: {
                    category?: string
                    id?: number
                    subcategories?: Json
                }
                Relationships: []
            }
            misc: {
                Row: {
                    allowance: Json | null
                    budget: Json | null
                    clerk_id: string
                    emergency: Json | null
                    savings: Json
                }
                Insert: {
                    allowance?: Json | null
                    budget?: Json | null
                    clerk_id: string
                    emergency?: Json | null
                    savings?: Json
                }
                Update: {
                    allowance?: Json | null
                    budget?: Json | null
                    clerk_id?: string
                    emergency?: Json | null
                    savings?: Json
                }
                Relationships: []
            }
            oversight: {
                Row: {
                    childId: string
                    supervisors: string[]
                    unconfirmed: string[]
                }
                Insert: {
                    childId: string
                    supervisors: string[]
                    unconfirmed: string[]
                }
                Update: {
                    childId?: string
                    supervisors?: string[]
                    unconfirmed?: string[]
                }
                Relationships: []
            }
            pairingHashes: {
                Row: {
                    childId: string
                    hash: string
                    parentId: string
                    valid: boolean
                    wasApproved: boolean | null
                }
                Insert: {
                    childId: string
                    hash?: string
                    parentId: string
                    valid?: boolean
                    wasApproved?: boolean | null
                }
                Update: {
                    childId?: string
                    hash?: string
                    parentId?: string
                    valid?: boolean
                    wasApproved?: boolean | null
                }
                Relationships: []
            }
            parents: {
                Row: {
                    clerk_id: string
                    customer_since: string | null
                    plan: string | null
                    stripe_id: string | null
                    subscription_id: string | null
                    subscription_status: string | null
                }
                Insert: {
                    clerk_id: string
                    customer_since?: string | null
                    plan?: string | null
                    stripe_id?: string | null
                    subscription_id?: string | null
                    subscription_status?: string | null
                }
                Update: {
                    clerk_id?: string
                    customer_since?: string | null
                    plan?: string | null
                    stripe_id?: string | null
                    subscription_id?: string | null
                    subscription_status?: string | null
                }
                Relationships: []
            }
            referrals: {
                Row: {
                    created_at: string
                    id: number
                    referral: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    id?: number
                    referral?: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    id?: number
                    referral?: string
                    user_id?: string
                }
                Relationships: []
            }
            reports: {
                Row: {
                    created_at: string
                    date_range: number[] | null
                    forchild: string
                    no_login: string | null
                    parent_id: string
                    uuid: string
                }
                Insert: {
                    created_at?: string
                    date_range?: number[] | null
                    forchild: string
                    no_login?: string | null
                    parent_id: string
                    uuid?: string
                }
                Update: {
                    created_at?: string
                    date_range?: number[] | null
                    forchild?: string
                    no_login?: string | null
                    parent_id?: string
                    uuid?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            requesting_user_id: {
                Args: Record<PropertyKey, never>
                Returns: string
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (Database['public']['Tables'] & Database['public']['Views'])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
              Database[PublicTableNameOrOptions['schema']]['Views'])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
          Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
            Database['public']['Views'])
      ? (Database['public']['Tables'] &
            Database['public']['Views'])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
          ? R
          : never
      : never

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof Database['public']['Tables']
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof Database['public']['Tables']
      ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
            Insert: infer I
        }
          ? I
          : never
      : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof Database['public']['Tables']
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof Database['public']['Tables']
      ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
            Update: infer U
        }
          ? U
          : never
      : never

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof Database['public']['Enums']
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
    : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
      ? Database['public']['Enums'][PublicEnumNameOrOptions]
      : never
