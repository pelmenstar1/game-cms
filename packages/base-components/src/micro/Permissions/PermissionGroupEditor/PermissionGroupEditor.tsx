import type { ApiRouteId } from '@game-cms/core/api';
import { Checkbox, classNames, Labeled, List } from '@game-cms/ui';

import {
  formatPermissionName,
  PermissionGroup,
} from '../../../utils/permissions/index.js';
import styles from './PermissionGroupEditor.module.scss';

export interface PermissionGroupEditorProps {
  className?: string;
  readOnly?: boolean;
  group: PermissionGroup;
  groupName: string;
  selectedPermissions?: ApiRouteId[];
  onPermissionsSelected?: (value: ApiRouteId[]) => void;
}

export function PermissionGroupEditor({
  className,
  readOnly = false,
  group,
  groupName,
  selectedPermissions = [],
  onPermissionsSelected,
}: PermissionGroupEditorProps) {
  const { actions, children } = group;
  const childrenArray = Object.entries(children);

  return (
    <div className={classNames(styles.root, className)}>
      {actions.length > 0 && (
        <Labeled title="Actions">
          <div className={styles.actions}>
            {actions.map((action) => {
              const permission = `${groupName}$${action}` as const;

              const onCheckedChanged = (state: boolean) => {
                if (!readOnly) {
                  const newPermissions = state
                    ? [...selectedPermissions, permission]
                    : selectedPermissions.filter((name) => name !== permission);

                  onPermissionsSelected?.(newPermissions);
                }
              };

              return (
                <Checkbox
                  key={action}
                  checked={selectedPermissions.includes(permission)}
                  onCheckedChanged={onCheckedChanged}
                >
                  {action}
                </Checkbox>
              );
            })}
          </div>
        </Labeled>
      )}

      {childrenArray.length > 0 && (
        <List className={styles['child-group-list']}>
          {childrenArray.map(([key, value]) => (
            <Labeled key={key} title={formatPermissionName(key)}>
              <PermissionGroupEditor
                group={value}
                readOnly={readOnly}
                groupName={`${groupName}/${key}`}
                selectedPermissions={selectedPermissions}
                onPermissionsSelected={onPermissionsSelected}
              />
            </Labeled>
          ))}
        </List>
      )}
    </div>
  );
}
