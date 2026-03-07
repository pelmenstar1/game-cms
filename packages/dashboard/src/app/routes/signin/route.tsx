import { signUserIn } from '@game-cms/base-api/client';
import { useApiAction, useSelfSession } from '@game-cms/base-components/micro';
import { emailRegex } from '@game-cms/shared/string';
import {
  Button,
  classNames,
  Labeled,
  PasswordInput,
  TextInput,
  Typography,
  useNotification,
  useTestRegex,
  useTypedNavigate,
} from '@game-cms/ui';
import { useCallback, useState } from 'react';

import styles from './route.module.scss';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValidEmail = useTestRegex(email, emailRegex);
  const isValidPassword = password.length > 0;

  const doSignIn = useApiAction(signUserIn, { redirectOnUnauthorized: false });

  const { refresh: refreshPermissions } = useSelfSession();

  const redirect = useTypedNavigate();
  const notification = useNotification();

  const signIn = useCallback(() => {
    void doSignIn({ email, password })
      .then(() => {
        refreshPermissions();

        return redirect('/');
      })
      .catch(() => {
        notification.error('Invalid email or password');
      });
  }, [email, notification, password, redirect, doSignIn, refreshPermissions]);

  return (
    <div className={styles.root}>
      <div className={styles.block}>
        <Typography variant="h3">Game CMS</Typography>

        <div className={styles.form}>
          <Labeled title="Email">
            <TextInput
              value={email}
              type="email"
              onTextChanged={setEmail}
              className={classNames(styles.input, styles.email)}
            />
          </Labeled>

          <Labeled title="Password">
            <PasswordInput
              value={password}
              autoComplete="current-password"
              onTextChanged={setPassword}
              className={classNames(styles.input, styles.password)}
            />
          </Labeled>

          <Button
            buttonVariant="solid"
            disabled={!isValidEmail || !isValidPassword}
            onClick={signIn}
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
}
