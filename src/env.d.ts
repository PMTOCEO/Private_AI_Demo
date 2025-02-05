/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_SUPABASE_JWT_SECRET: string
    readonly VITE_AUTH0_DOMAIN: string
    readonly VITE_AUTH0_CLIENT_ID: string
    readonly VITE_AUTH0_AUDIENCE: string
    readonly MODE: string
    readonly DEV: boolean
    readonly PROD: boolean
    readonly SSR: boolean
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  
  // Extend ProcessEnv to include our custom env variables
  declare namespace NodeJS {
    interface ProcessEnv extends ImportMetaEnv {}
  }