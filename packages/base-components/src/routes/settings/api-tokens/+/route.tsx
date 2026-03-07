import { createApiToken } from '@game-cms/base-api/client';
import type { ApiRouteId } from '@game-cms/core/api';
import {
  parseTimeSpec,
  type RelativeTime,
  type TimeSpec,
} from '@game-cms/shared/chrono';
import {
  Button,
  ErrorBoard,
  isValidItem,
  Labeled,
  testValidationResult,
  TextInput,
  TimeSelect,
  useModal,
  useNotification,
  usePreventLeaving,
  useValidation,
} from '@game-cms/ui';
import { useCallback, useState } from 'react';

import { useApiAction } from '../../../../hooks/useApiAction.js';
import { DisplayApiTokenDialog } from '../../../../micro/DisplayApiTokenDialog/index.js';
import { PermissionsEditor } from '../../../../micro/PermissionsEditor/index.js';
import styles from './route.module.scss';

const EXPIRATION_TIME_SUGGESTIONS: RelativeTime[] = ['30d', '60d', '90d'];

export default function Page() {
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<ApiRouteId[]>(
    []
  );
  const [expirationTime, setExpirationTime] = useState<TimeSpec>(
    EXPIRATION_TIME_SUGGESTIONS[0]
  );

  const doCreateApiToken = useApiAction(createApiToken);
  const notification = useNotification();
  const showModal = useModal();

  usePreventLeaving();

  const validation = useValidation({
    emptyName: [name.length > 0, 'Name cannot be empty'],
    emptyPermissions: [
      selectedPermissions.length > 0,
      'Permissions cannot be empty',
    ],
  });

  const isValidInput = testValidationResult(validation);

  const onCreate = useCallback(() => {
    doCreateApiToken({
      name,
      expirationTime: parseTimeSpec(expirationTime),
      permissions: selectedPermissions,
    })
      .then(({ token }) => {
        void showModal(DisplayApiTokenDialog, { token });
      })
      .catch(() => {
        notification.error('Failed to create token');
      });
  }, [
    doCreateApiToken,
    showModal,
    expirationTime,
    name,
    notification,
    selectedPermissions,
  ]);

  return (
    <div className={styles.root}>
      <Labeled title="Name">
        <TextInput
          error={!isValidItem(validation, 'emptyName')}
          value={name}
          onTextChanged={setName}
        />
      </Labeled>

      <TimeSelect
        suggestions={EXPIRATION_TIME_SUGGESTIONS}
        selectedItem={expirationTime}
        onItemSelected={setExpirationTime}
      />

      <PermissionsEditor
        selectedPermissions={selectedPermissions}
        onPermissionsSelected={setSelectedPermissions}
      />

      <ErrorBoard items={validation} />

      <Button
        disabled={!isValidInput}
        buttonVariant="solid"
        className={styles.create}
        onClick={onCreate}
      >
        Create
      </Button>
    </div>
  );
}
