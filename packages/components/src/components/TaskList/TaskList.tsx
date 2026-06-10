import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../internal/classNames';
import { useOptionalId } from '../../internal/useId';
import { Tag } from '../Tag';
import type { TagProps } from '../Tag';

export interface TaskListItemStatus {
  /**
   * Render the status as a `Tag`, e.g. `{ colour: 'blue', children: 'In progress' }`
   * — used for tasks that are in progress or not started.
   */
  tag?: TagProps;
  /** Plain text status, e.g. "Completed" or "Cannot start yet". */
  text?: ReactNode;
  /** Grey out the status text for tasks the user cannot start yet. */
  cannotStartYet?: boolean;
  /** Extra classes for the status column. */
  className?: string;
}

export interface TaskListItem {
  /** The name of the task. */
  title: ReactNode;
  /** Link to the task. Items without a link are not clickable. */
  href?: string;
  /** Hint text shown below the task name. */
  hint?: ReactNode;
  /** The status of the task: a `tag` or plain `text`. */
  status: TaskListItemStatus;
  /** Extra classes for the list item. */
  className?: string;
}

export interface TaskListProps extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
  /** The tasks in the list. */
  items: TaskListItem[];
  /** Prefix for the hint and status ids referenced by `aria-describedby`. */
  idPrefix?: string;
}

/**
 * GOV.UK Task list, showing users the tasks involved in completing a service
 * and whether each one is complete. Each linked task is described by its hint
 * and status through `aria-describedby`; tasks that cannot be started yet get
 * a greyed-out status.
 *
 * @see https://design-system.service.gov.uk/components/task-list/
 */
export function TaskList({ items, idPrefix, className, ...rest }: TaskListProps) {
  const prefix = useOptionalId(idPrefix, 'task-list');

  return (
    <ul {...rest} className={classNames('govuk-task-list', className)}>
      {items.map((item, index) => {
        const hintId = `${prefix}-${index + 1}-hint`;
        const statusId = `${prefix}-${index + 1}-status`;
        return (
          <li
            key={index}
            className={classNames(
              'govuk-task-list__item',
              item.href != null && 'govuk-task-list__item--with-link',
              item.className,
            )}
          >
            <div className="govuk-task-list__name-and-hint">
              {item.href != null ? (
                <a
                  className="govuk-link govuk-task-list__link"
                  href={item.href}
                  aria-describedby={classNames(item.hint != null && hintId, statusId)}
                >
                  {item.title}
                </a>
              ) : (
                <div>{item.title}</div>
              )}
              {item.hint != null && (
                <div id={hintId} className="govuk-task-list__hint">
                  {item.hint}
                </div>
              )}
            </div>
            <div
              id={statusId}
              className={classNames(
                'govuk-task-list__status',
                item.status.cannotStartYet && 'govuk-task-list__status--cannot-start-yet',
                item.status.className,
              )}
            >
              {item.status.tag != null ? <Tag {...item.status.tag} /> : item.status.text}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
