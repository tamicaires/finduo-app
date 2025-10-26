import { Card, CardContent, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { TransactionCategoryLabels } from '@core/enums/TransactionCategory'

interface ExpensesByCategoryChartProps {
  data: Array<{ category: string; amount: number }>
}

// Paleta harmônica com tons de laranja, coral, terracota e complementares
const COLORS = [
  '#FF6B35', // Laranja vibrante
  '#FF8C42', // Laranja médio
  '#FFB347', // Laranja claro
  '#FF9770', // Coral
  '#F4A261', // Terracota claro
  '#E76F51', // Terracota
  '#E85D75', // Rosa coral
  '#FF7F50', // Coral clássico
  '#FFA07A', // Salmão claro
  '#FF9E80', // Pêssego
]

export function ExpensesByCategoryChart({ data }: ExpensesByCategoryChartProps) {
  const chartData = data.map((item) => ({
    name: TransactionCategoryLabels[item.category as keyof typeof TransactionCategoryLabels] || item.category,
    value: item.amount,
  }))

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  interface TooltipProps {
    active?: boolean
    payload?: Array<{ name: string; value: number }>
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1)
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-sm">{payload[0].name}</p>
          <p className="text-primary font-bold">
            R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground">{percentage}% do total</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ((props: any) => {
                  const value = props.value || 0
                  const percentage = ((Number(value) / total) * 100).toFixed(0)
                  return Number(percentage) > 5 ? `${percentage}%` : ''
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }) as any
              }
              outerRadius={120}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              animationDuration={800}
            >
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
