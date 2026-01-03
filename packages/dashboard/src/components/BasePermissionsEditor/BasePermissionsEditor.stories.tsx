import type { ApiRouteId } from '@game-cms/core';
import { useState } from 'react';

import preview from '#storybook/preview';

import {
  BasePermissionsEditor,
  type BasePermissionsEditorProps,
} from './BasePermissionsEditor';

function Component(props: Pick<BasePermissionsEditorProps, 'permissions'>) {
  const [selectedPermissions, setSelectedPermissions] = useState<ApiRouteId[]>(
    []
  );

  return (
    <BasePermissionsEditor
      {...props}
      selectedPermissions={selectedPermissions}
      onPermissionsSelected={setSelectedPermissions}
    />
  );
}

const meta = preview.meta({ component: Component });

export const Primary = meta.story({
  args: {
    permissions: [
      'auth/token$create',
      'auth/token$delete',
      'storage/file$upload',
      'storage/folder$create',
      'storage/folder$create1',
      'storage/folder$create2',
      'storage/folder$create3',
      'storage/folder$create4',
      'storage/folder$create5',
    ],
  },
});
