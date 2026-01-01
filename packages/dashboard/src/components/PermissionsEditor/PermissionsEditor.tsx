import { getPermissions } from '@game-cms/client';
import { useApiQuery } from '@game-cms/component-api';
import { classNames, DataLoader } from '@game-cms/ui';

import {
  BasePermissionsEditor,
  type BasePermissionsEditorProps,
} from '../BasePermissionsEditor';
import styles from './PermissionsEditor.module.scss';

export interface PermissionsEditorProps extends Omit<
  BasePermissionsEditorProps,
  'permissions'
> {
  className?: string;
}

export function PermissionsEditor({
  className,
  readOnly,
  selectedPermissions,
  onPermissionsSelected,
}: PermissionsEditorProps) {
  const [permissionsResult] = useApiQuery(getPermissions);

  return (
    <DataLoader
      className={classNames(styles.root, className)}
      result={permissionsResult}
    >
      {({ permissions }) => (
        <BasePermissionsEditor
          permissions={permissions}
          readOnly={readOnly}
          selectedPermissions={selectedPermissions}
          onPermissionsSelected={onPermissionsSelected}
        />
      )}
    </DataLoader>
  );
}
