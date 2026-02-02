import { getPermissions } from '@game-cms/base-api/client';
import { useApiQuery } from '@game-cms/component-api';
import { DataLoader } from '@game-cms/ui';

import {
  BasePermissionsEditor,
  type BasePermissionsEditorProps,
} from '../BasePermissionsEditor';

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
    <DataLoader className={className} result={permissionsResult}>
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
