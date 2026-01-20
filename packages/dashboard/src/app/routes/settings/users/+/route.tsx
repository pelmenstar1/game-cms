import { createUser } from '@game-cms/client';
import { useApiAction } from '@game-cms/component-api';
import type { ApiRouteId } from '@game-cms/core/api';
import { emailRegex } from '@game-cms/shared/string';
import {
  Button,
  ErrorBoard,
  isValidItem,
  Labeled,
  testValidationResult,
  TextInput,
  useNotification,
  usePreventLeaving,
  useTestRegex,
  useValidation,
} from '@game-cms/ui';
import { useCallback, useState } from 'react';

import { PermissionsEditor } from '@/components/PermissionsEditor';
import { useCheckPermissions } from '@/hooks/useCheckPermissions';

import styles from './route.module.scss';

export default function Page() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<ApiRouteId[]>(
    []
  );
  const isEmailValid = useTestRegex(email, emailRegex);

  const doCreateUser = useApiAction(createUser);
  const notification = useNotification();

  useCheckPermissions('user$create');

  usePreventLeaving();

  const validation = useValidation({
    emptyName: [displayName.length > 0, 'Name cannot be empty'],
    email: [isEmailValid, 'Invalid email'],
    password: [
      password.length > 8,
      'Password must be at least 8 characters long',
    ],
    unmatchedPasswords: [password !== passwordRepeat, 'Passwords do not match'],
    emptyPermissions: [
      selectedPermissions.length > 0,
      'Permissions cannot be empty',
    ],
  });

  const isValidInput = testValidationResult(validation);

  const onCreate = useCallback(() => {
    doCreateUser({
      displayName,
      email,
      password,
      permissions: selectedPermissions,
    }).catch(() => {
      notification.error('Failed to create token');
    });
  }, [
    doCreateUser,
    displayName,
    email,
    password,
    selectedPermissions,
    notification,
  ]);

  return (
    <div className={styles.root}>
      <Labeled title="Display name">
        <TextInput
          error={!isValidItem(validation, 'emptyName')}
          value={displayName}
          onTextChanged={setDisplayName}
        />
      </Labeled>

      <Labeled title="Email">
        <TextInput
          error={!isValidItem(validation, 'email')}
          value={email}
          onTextChanged={setEmail}
        />
      </Labeled>

      <Labeled title="Password">
        <TextInput
          error={!isValidItem(validation, 'password')}
          value={password}
          onTextChanged={setPassword}
        />
      </Labeled>

      <Labeled title="Repeat password">
        <TextInput
          error={!isValidItem(validation, 'unmatchedPasswords')}
          value={passwordRepeat}
          onTextChanged={setPasswordRepeat}
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
        onClick={onCreate}
      >
        Create
      </Button>
    </div>
  );
}
