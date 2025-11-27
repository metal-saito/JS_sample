import type { LifePlanYearResult } from '../../lib/simulation'
import { formatCurrency } from '../../lib/simulation'
import { Panel } from '../common/Panel'

interface TimelineTableProps {
  readonly entries: ReadonlyArray<LifePlanYearResult>
  readonly retirementAge: number
  readonly shortfallYear: number | null
}

export const TimelineTable = ({ entries, retirementAge, shortfallYear }: TimelineTableProps) => {
  if (entries.length === 0) {
    return null
  }

  const retirementIndex = entries.findIndex((entry) => entry.age === retirementAge)

  return (
    <Panel title="年次の資産推移">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>年齢</th>
              <th>西暦</th>
              <th>年間積立</th>
              <th>運用益</th>
              <th>年間引き出し</th>
              <th>年末残高</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const isRetirementRow = index === retirementIndex
              const isShortfallRow = shortfallYear === entry.year

              const rowClassName = [
                isRetirementRow ? 'table__row--retirement' : '',
                isShortfallRow ? 'table__row--shortfall' : '',
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <tr key={entry.year} className={rowClassName}>
                  <td>{entry.age}</td>
                  <td>{entry.year}</td>
                  <td>{formatCurrency(entry.contribution)}</td>
                  <td>{formatCurrency(entry.investmentGrowth)}</td>
                  <td>{formatCurrency(entry.withdrawal)}</td>
                  <td>{formatCurrency(entry.endBalance)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
