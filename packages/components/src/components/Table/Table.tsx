import type { ReactNode, TableHTMLAttributes } from 'react';
import { classNames } from '../../internal/classNames';

export interface TableCell {
  /** Content of the cell. */
  children?: ReactNode;
  /** Format modifier; `numeric` right-aligns the cell and uses tabular numbers. */
  format?: 'numeric';
  /** How many columns the cell extends. */
  colSpan?: number;
  /** How many rows the cell extends. */
  rowSpan?: number;
  /** Extra classes for the cell. */
  className?: string;
}

export interface TableProps extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> {
  /** A caption describing the table's content. */
  caption?: ReactNode;
  /** Size modifier for the caption, matching the GOV.UK heading scale. */
  captionSize?: 'm' | 'l' | 'xl';
  /** Header row cells. */
  head?: TableCell[];
  /** Body rows, each an array of cells. */
  rows: TableCell[][];
  /** Render the first cell of each row as a `<th scope="row">` row header. */
  firstCellIsHeader?: boolean;
  /** Use smaller text until tablet width, for tables with lots of data. */
  smallTextUntilTablet?: boolean;
}

/**
 * GOV.UK Table, for making information easier to compare and scan.
 *
 * @see https://design-system.service.gov.uk/components/table/
 */
export function Table({
  caption,
  captionSize,
  head,
  rows,
  firstCellIsHeader,
  smallTextUntilTablet,
  className,
  ...rest
}: TableProps) {
  return (
    <table
      {...rest}
      className={classNames(
        'govuk-table',
        smallTextUntilTablet && 'govuk-table--small-text-until-tablet',
        className,
      )}
    >
      {caption != null && (
        <caption
          className={classNames(
            'govuk-table__caption',
            captionSize != null && `govuk-table__caption--${captionSize}`,
          )}
        >
          {caption}
        </caption>
      )}
      {head != null && (
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            {head.map((cell, index) => (
              <th
                key={index}
                scope="col"
                className={classNames(
                  'govuk-table__header',
                  cell.format != null && `govuk-table__header--${cell.format}`,
                  cell.className,
                )}
                colSpan={cell.colSpan}
                rowSpan={cell.rowSpan}
              >
                {cell.children}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody className="govuk-table__body">
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="govuk-table__row">
            {row.map((cell, cellIndex) =>
              cellIndex === 0 && firstCellIsHeader ? (
                <th
                  key={cellIndex}
                  scope="row"
                  className={classNames('govuk-table__header', cell.className)}
                  colSpan={cell.colSpan}
                  rowSpan={cell.rowSpan}
                >
                  {cell.children}
                </th>
              ) : (
                <td
                  key={cellIndex}
                  className={classNames(
                    'govuk-table__cell',
                    cell.format != null && `govuk-table__cell--${cell.format}`,
                    cell.className,
                  )}
                  colSpan={cell.colSpan}
                  rowSpan={cell.rowSpan}
                >
                  {cell.children}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
