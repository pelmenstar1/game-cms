import type { ApiRouteId } from '@game-cms/types';
import { classNames, Labeled, List } from '@game-cms/ui';
import { useMemo } from 'react';

import { formatPermissionName, groupPermissions } from '@/utils/permissions';

import { PermissionGroupEditor } from '../PermissionGroupEditor';
import styles from './BasePermissionsEditor.module.scss';

export interface BasePermissionsEditorProps {
  className?: string;
  readOnly?: boolean;
  permissions: ApiRouteId[];
  selectedPermissions?: ApiRouteId[];
  onPermissionsSelected?: (value: ApiRouteId[]) => void;
}

export function BasePermissionsEditor({
  className,
  readOnly,
  permissions,
  selectedPermissions,
  onPermissionsSelected,
}: BasePermissionsEditorProps) {
  const groups = useMemo(() => groupPermissions(permissions), [permissions]);

  return (
    <List className={classNames(styles.root, className)}>
      {Object.entries(groups).map(([key, group]) => (
        <Labeled key={key} title={formatPermissionName(key)}>
          <PermissionGroupEditor
            key={key}
            group={group}
            groupName={key}
            readOnly={readOnly}
            selectedPermissions={selectedPermissions}
            onPermissionsSelected={onPermissionsSelected}
          />
        </Labeled>
      ))}
    </List>
  );
}
