"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface EnvVar {
  name: string
  present: boolean
}

interface BotConfig {
  model: string
  maxHistory: number
  ttl: string
  envVars: EnvVar[]
}

interface BotConfigSectionProps {
  botConfig: BotConfig
}

export function BotConfigSection({ botConfig }: BotConfigSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bot Telegram</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 text-text-secondary">Modelo</td>
                <td className="py-2 text-text-primary font-mono">{botConfig.model}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 text-text-secondary">Historico maximo</td>
                <td className="py-2 text-text-primary">{botConfig.maxHistory} mensagens</td>
              </tr>
              <tr>
                <td className="py-2 text-text-secondary">TTL da sessao</td>
                <td className="py-2 text-text-primary">{botConfig.ttl}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Variaveis de Ambiente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {botConfig.envVars.map((v) => (
              <div key={v.name} className="flex items-center gap-2 text-sm">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    v.present ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="font-mono text-text-secondary">{v.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
