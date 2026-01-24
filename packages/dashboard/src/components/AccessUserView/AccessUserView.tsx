import type { CreateUserPayload, NoPasswordUser } from '@game-cms/base-core';
import { emailRegex } from '@game-cms/shared/string';
import {
  Button,
  classNames,
  ErrorBoard,
  isValidItem,
  Labeled,
  PasswordInput,
  testValidationResult,
  TextInput,
  useTestRegex,
  useValidation,
} from '@game-cms/ui';
import { useCallback, useState } from 'react';

import { PermissionsEditor } from '../PermissionsEditor';
import styles from './AccessUserView.module.scss';

export interface AccessUserViewProps {
  className?: string;
  initialValue?: NoPasswordUser;
  onAction?: (payload: CreateUserPayload) => void;
  readOnly?: boolean;
}

export function AccessUserView({
  className,
  initialValue,
  readOnly,
  onAction,
}: AccessUserViewProps) {
  const [displayName, setDisplayName] = useState(
    initialValue?.displayName ?? ''
  );
  const [email, setEmail] = useState(initialValue?.email ?? '');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState(
    initialValue?.permissions ?? []
  );
  const isEmailValid = useTestRegex(email, emailRegex);

  const allowNoPassword = initialValue !== undefined && password.length === 0;

  const validation = useValidation({
    emptyName: [displayName.length > 0, 'Name cannot be empty'],
    email: [isEmailValid, 'Invalid email'],
    password: [
      allowNoPassword || password.length > 8,
      'Password must be at least 8 characters long',
    ],
    unmatchedPasswords: [
      allowNoPassword || password === passwordRepeat,
      'Passwords do not match',
    ],
    emptyPermissions: [
      selectedPermissions.length > 0,
      'Permissions cannot be empty',
    ],
  });

  const isValidInput = testValidationResult(validation);

  const handleOnAction = useCallback(() => {
    onAction?.({
      displayName,
      email,
      password,
      permissions: selectedPermissions,
    });
  }, [displayName, email, password, selectedPermissions, onAction]);

  return (
    <div className={classNames(styles.root, className)}>
      <Labeled title="Display name">
        <TextInput
          error={!isValidItem(validation, 'emptyName')}
          value={displayName}
          onTextChanged={setDisplayName}
          readOnly={readOnly}
        />
      </Labeled>

      <Labeled title="Email">
        <TextInput
          error={!isValidItem(validation, 'email')}
          value={email}
          onTextChanged={setEmail}
          readOnly={readOnly}
        />
      </Labeled>

      <Labeled title="Password">
        <PasswordInput
          error={!isValidItem(validation, 'password')}
          value={password}
          onTextChanged={setPassword}
          autoComplete="new-password"
          readOnly={readOnly}
        />
      </Labeled>

      <Labeled title="Repeat password">
        <PasswordInput
          error={!isValidItem(validation, 'unmatchedPasswords')}
          value={passwordRepeat}
          onTextChanged={setPasswordRepeat}
          autoComplete="new-password"
          readOnly={readOnly}
        />
      </Labeled>

      <Labeled title="Permissions">
        <PermissionsEditor
          selectedPermissions={selectedPermissions}
          onPermissionsSelected={setSelectedPermissions}
          className={styles['permissions']}
          readOnly={readOnly}
        />
      </Labeled>

      <ErrorBoard items={validation} />

      <Button
        disabled={!isValidInput || readOnly}
        buttonVariant="solid"
        className={styles.create}
        onClick={handleOnAction}
      >
        {initialValue ? 'Save' : 'Create'}
      </Button>
    </div>
  );
}
