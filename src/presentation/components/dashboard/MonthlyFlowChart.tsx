import { Card, CardContent, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MonthlyFlowChartProps {
  data: Array<{
    month: string
    income: number
    expenses: number
  }>
}

export function MonthlyFlowChart({ data }: MonthlyFlowChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-sm mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              <span className="text-xs">Receitas:</span>
              <span className="font-bold text-[#10B981]">
                R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF6B35]" />
              <span className="text-xs">Despesas:</span>
              <span className="font-bold text-[#FF6B35]">
                R$ {payload[1].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="border-t border-border mt-2 pt-2">
              <span className="text-xs text-muted-foreground">Saldo:</span>
              <span className={`font-bold ml-2 ${payload[0].value - payload[1].value >= 0 ? 'text-[#10B981]' : 'text-[#FF6B35]'}`}>
                R$ {(payload[0].value - payload[1].value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Fluxo Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) =>
                `R$ ${value.toLocaleString('pt-BR', { notation: 'compact', compactDisplay: 'short' })}`
              }
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-sm text-foreground">
                  {value === 'income' ? 'Receitas' : 'Despesas'}
                </span>
              )}
            />
            <Bar dataKey="income" fill="#10B981" radius={[8, 8, 0, 0]} animationDuration={800} />
            <Bar dataKey="expenses" fill="#FF6B35" radius={[8, 8, 0, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
