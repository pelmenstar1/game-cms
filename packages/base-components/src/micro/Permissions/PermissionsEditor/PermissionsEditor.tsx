import { getPermissions } from '@game-cms/base-api/client';
import { DataLoader } from '@game-cms/ui';

import { useApiQuery } from '../../../hooks/useApiQuery.js';
import {
  BasePermissionsEditor,
  type BasePermissionsEditorProps,
} from '../BasePermissionsEditor/index.js';

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
