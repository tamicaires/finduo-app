import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import type { ChartOptions } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface ExpensesChartProps {
  coupleExpenses: number
  userAExpenses: number
  userBExpenses: number
}

export function ExpensesChart({ coupleExpenses, userAExpenses, userBExpenses }: ExpensesChartProps) {
  const data = {
    labels: ['Despesas do Casal', 'Gastos Livres - Você', 'Gastos Livres - Parceiro(a)'],
    datasets: [
      {
        data: [coupleExpenses, userAExpenses, userBExpenses],
        backgroundColor: [
          'hsl(var(--primary))',
          'hsl(142.1 76.2% 36.3%)',
          'hsl(24.6 95% 53.1%)',
        ],
        borderColor: [
          'hsl(var(--primary))',
          'hsl(142.1 76.2% 36.3%)',
          'hsl(24.6 95% 53.1%)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`
          },
        },
      },
    },
  }

  return <Doughnut data={data} options={options} />
}
