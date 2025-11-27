import { useCallback, useMemo } from 'react'
import type { LifePlanYearResult } from '../../lib/simulation'
import { formatCurrency } from '../../lib/simulation'
import { DataTable, type DataTableColumn } from '../common/DataTable'
import { EmptyState } from '../common/EmptyState'
import { Panel } from '../common/Panel'
import { TimelineLegend } from './TimelineLegend'

interface TimelineTableProps {
  readonly entries: ReadonlyArray<LifePlanYearResult>
  readonly retirementAge: number
  readonly shortfallYear: number | null
}

export const TimelineTable = ({ entries, retirementAge, shortfallYear }: TimelineTableProps) => {
  const columns = useMemo<ReadonlyArray<DataTableColumn<LifePlanYearResult>>>(
    () => [
      { key: 'age', header: '年齢', renderCell: (row) => row.age },
      { key: 'year', header: '西暦', renderCell: (row) => row.year },
      {
        key: 'contribution',
        header: '年間積立',
        renderCell: (row) => formatCurrency(row.contribution),
        align: 'right',
      },
      {
        key: 'investmentGrowth',
        header: '運用益',
        renderCell: (row) => formatCurrency(row.investmentGrowth),
        align: 'right',
      },
      {
        key: 'withdrawal',
        header: '年間引き出し',
        renderCell: (row) => formatCurrency(row.withdrawal),
        align: 'right',
      },
      {
        key: 'endBalance',
        header: '年末残高',
        renderCell: (row) => formatCurrency(row.endBalance),
        align: 'right',
      },
    ],
    [],
  )

  const retirementIndex = useMemo(
    () => entries.findIndex((entry) => entry.age === retirementAge),
    [entries, retirementAge],
  )

  const getRowClassName = useCallback(
    (entry: LifePlanYearResult, index: number) => {
      const classNames: string[] = []
      if (index === retirementIndex) {
        classNames.push('table__row--retirement')
      }
      if (shortfallYear === entry.year) {
        classNames.push('table__row--shortfall')
      }
      return classNames.length > 0 ? classNames.join(' ') : undefined
    },
    [retirementIndex, shortfallYear],
  )

  const hasEntries = entries.length > 0
  const panelFooter = hasEntries ? (
    <TimelineLegend retirementAge={retirementAge} shortfallYear={shortfallYear} />
  ) : null

  return (
    <Panel
      title="年次の資産推移"
      description="積立・運用・引き出しの推移を年単位で追跡し、退職後の資金計画を検証します。"
      footer={panelFooter}
    >
      {hasEntries ? (
        <DataTable
          rows={entries}
          columns={columns}
          getRowKey={(row) => row.year}
          getRowClassName={getRowClassName}
        />
      ) : (
        <EmptyState
          title="年次の推移を表示するには条件を入力してください"
          description="シミュレーション条件を調整すると、積立額や運用益、残高の遷移がここに表示されます。"
          icon={<span>📊</span>}
        />
      )}
    </Panel>
  )
}
