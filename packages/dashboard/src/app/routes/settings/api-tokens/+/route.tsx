import { createApiToken } from '@game-cms/client';
import type { ApiRouteId } from '@game-cms/types';
import {
  Button,
  ErrorBoard,
  isValidItem,
  Labeled,
  testValidationResult,
  TextInput,
  usePreventLeaving,
  useValidation,
} from '@game-cms/ui';
import { useCallback, useState } from 'react';

import { PermissionsEditor } from '@/components/PermissionsEditor';
import { useApiAction } from '@/hooks/useApiAction';

import styles from './route.module.scss';

export default function Page() {
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<ApiRouteId[]>(
    []
  );

  const doCreateApiToken = useApiAction(createApiToken);

  const validation = useValidation({
    emptyName: [name.length > 0, 'Name cannot be empty'],
    emptyPermissions: [
      selectedPermissions.length > 0,
      'Permissions cannot be empty',
    ],
  });

  const isValidInput = testValidationResult(validation);

  const onCreate = useCallback(() => {
    doCreateApiToken({});
  }, [doCreateApiToken]);

  usePreventLeaving();

  return (
    <div className={styles.root}>
      <Labeled title="Name">
        <TextInput
          error={!isValidItem(validation, 'emptyName')}
          value={name}
          onTextChanged={setName}
        />
      </Labeled>

      <PermissionsEditor
        selectedPermissions={selectedPermissions}
        onPermissionsSelected={setSelectedPermissions}
      />

      <ErrorBoard items={validation} />

      <Button
        disabled={!isValidInput}
        buttonVariant="solid"
        className={styles.create}
      >
        Create
      </Button>
    </div>
  );
}
