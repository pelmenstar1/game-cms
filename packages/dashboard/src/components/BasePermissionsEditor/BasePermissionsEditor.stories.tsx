import type { ApiRouteId } from '@game-cms/types';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import {
  BasePermissionsEditor,
  type BasePermissionsEditorProps,
} from './BasePermissionsEditor';

function Component(props: BasePermissionsEditorProps) {
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

export default {
  component: Component,
} satisfies Meta;

type Story = StoryObj<typeof Component>;

export const Primary: Story = {
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
};
