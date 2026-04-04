"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError("Credenciais inválidas. Acesso negado.")
      setIsLoading(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      
      {/* Left Panel — Brand Hero */}
      <div 
        className="hidden lg:flex w-[55%] flex-col justify-between p-12 relative overflow-hidden text-white"
        style={{ background: "linear-gradient(160deg, #0a1e47 0%, #0F2A60 50%, #1a3f80 100%)" }}
      >
        {/* Geometric Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        
        {/* Subtle gradient orb */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(59,125,216,0.15) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-60 -left-20 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(59,125,216,0.1) 0%, transparent 70%)" }} />

        {/* Left panel is left completely blank with only background textures per user request */}
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center bg-background px-8 sm:px-16 lg:px-20">
        <div className="w-full max-w-sm mx-auto space-y-10">
          
          {/* Dexco Logo */}
          <div className="space-y-6 flex flex-col items-center text-center">
            <div className="flex items-center justify-center h-24">
              <Image
                src="/dexco-logo.svg"
                alt="Dexco"
                width={300}
                height={300}
                className="w-48 h-auto scale-[1.5]"
                priority
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Bem-vindo de volta</h2>
              <p className="text-sm text-muted-foreground">Acesse sua conta para continuar</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 text-destructive px-4 py-3 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label 
                htmlFor="email" 
                className="block text-xs font-semibold text-foreground/70"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <label 
                htmlFor="password" 
                className="block text-xs font-semibold text-foreground/70"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                placeholder="••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, #0F2A60 0%, #1a3f80 100%)` }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Autenticando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Entrar
                  <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">
              © {new Date().getFullYear()} Dexco S.A. · Martinelli Advogados
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
