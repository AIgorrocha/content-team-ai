"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push("/")
        router.refresh()
      } else {
        setError(data.error || "Erro ao fazer login")
      }
    } catch {
      setError("Erro de conexão")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#0a0a0a",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "380px",
        backgroundColor: "#1a1a1a",
        borderRadius: "12px",
        padding: "32px",
        border: "1px solid #2a2a2a",
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", margin: "0 0 8px" }}>
            Content Team AI
          </h1>
          <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>
            Entre com suas credenciais para acessar o dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#fff", marginBottom: "6px" }}>
              Usuário
            </label>
            <input
              type="text"
              placeholder="Seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              style={{
                width: "100%",
                padding: "10px 12px",
                backgroundColor: "#0a0a0a",
                border: "1px solid #3b82f6",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#fff", marginBottom: "6px" }}>
              Senha
            </label>
            <input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                backgroundColor: "#0a0a0a",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#ef4444", fontSize: "13px", margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "11px",
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}
