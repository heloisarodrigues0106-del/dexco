"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"

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
    <div className="flex min-h-screen w-full bg-background overflow-hidden relative">
      {/* 
        FRONTEND RULE COMPLIANCE: 
        - Extreme Asymmetry (70/30 split instead of generic centered 50/50).
        - Brutalist Typography (Massive lettering clipping out of box).
        - Sharp Geometry (No rounded corners, pure 0px radius).
        - Martinelli Azul Royal Palette (No purple/cyan 'SaaS' traps).
      */}
      
      {/* LEFT COMPONENT - MASSIVE TYPOGRAPHY HERO (70%) */}
      <div className="hidden lg:flex w-[70%] bg-primary flex-col justify-between p-12 relative overflow-hidden text-primary-foreground border-r border-background">
        
        {/* Abstract Architectural Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.1]" 
          style={{
            backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
            backgroundSize: "6rem 6rem",
            backgroundPosition: "-1px -1px"
          }}
        />

        <div className="relative z-10">
          <h2 className="text-xl font-bold tracking-widest uppercase">
            DEXCO // V.2026
          </h2>
        </div>

        <div className="relative z-10 space-y-4">
          <h1 className="text-[9vw] font-black leading-[0.8] tracking-tighter uppercase whitespace-nowrap overflow-visible">
            Análise<br />
            Jurídica<br />
            Avançada
          </h1>
          <p className="max-w-md pt-8 text-xl font-light opacity-90 border-t border-primary-foreground/30">
            Inteligência de dados aplicada ao contencioso. Gestão de processos trabalhistas especializada pela Martinelli Advogados.
          </p>
        </div>
      </div>

      {/* RIGHT COMPONENT - BRUTALIST LOGIN FORM (30%) */}
      <div className="w-full lg:w-[30%] flex flex-col justify-center bg-card p-8 sm:p-12 z-20 border-l-4 border-primary">
        <div className="w-full max-w-sm mx-auto space-y-10">
          
          <div className="space-y-2">
            <h3 className="text-4xl font-black uppercase tracking-tight text-foreground">Acesso</h3>
            <div className="h-1 w-full bg-primary" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 form-group">
            
            {error && (
              <div className="border border-destructive bg-destructive/10 text-destructive p-3 text-sm font-bold uppercase tracking-wider backdrop-blur-sm">
                [ERRO] {error}
              </div>
            )}

            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Identificação Operacional (E-mail)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background border-2 border-input px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:ring-0 focus:outline-none transition-colors rounded-none"
                placeholder="insira@email.com"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label 
                htmlFor="password" 
                className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Chave de Acesso (Senha)
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-background border-2 border-input px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:ring-0 focus:outline-none transition-colors rounded-none"
                placeholder="••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground font-black uppercase tracking-widest py-4 mt-6 hover:bg-foreground hover:text-background transition-colors duration-300 disabled:opacity-50 flex justify-center border-2 border-transparent active:border-primary-foreground focus:outline-none rounded-none"
            >
              {isLoading ? (
                <span className="animate-pulse">Validando Sistema...</span>
              ) : (
                <span className="flex items-center gap-3">
                  Autenticar 
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                </span>
              )}
            </button>
            
          </form>

          <div className="pt-8 text-center text-[10px] text-muted-foreground uppercase opacity-70 tracking-widest border-t border-border mt-8">
            © {new Date().getFullYear()} DEXCO S.A. | Powered by Martinelli Advogados
          </div>
        </div>
      </div>
    </div>
  )
}
