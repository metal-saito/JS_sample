import { ReactNode } from 'react'

export interface DataTableColumn<TRow> {
  readonly key: string
  readonly header: string
  readonly align?: 'left' | 'center' | 'right'
  readonly renderCell: (row: TRow, index: number) => ReactNode
}

export interface DataTableProps<TRow> {
  readonly rows: ReadonlyArray<TRow>
  readonly columns: ReadonlyArray<DataTableColumn<TRow>>
  readonly getRowKey: (row: TRow, index: number) => string | number
  readonly getRowClassName?: (row: TRow, index: number) => string | undefined
}

export const DataTable = <TRow,>({ rows, columns, getRowKey, getRowClassName }: DataTableProps<TRow>) => {
  if (rows.length === 0) {
    return null
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={{ textAlign: column.align ?? 'left' }}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={getRowKey(row, rowIndex)} className={getRowClassName?.(row, rowIndex)}>
              {columns.map((column) => (
                <td key={column.key} style={{ textAlign: column.align ?? 'left' }}>
                  {column.renderCell(row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
