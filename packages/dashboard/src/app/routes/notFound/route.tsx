import { LinkButton, Typography } from '@game-cms/ui';

import styles from './route.module.scss';

export default function Page() {
  return (
    <div className={styles.root}>
      <Typography variant="h1">404</Typography>
      <Typography variant="bodyLarge">
        Seems like this page doesn&apos;t exist
      </Typography>
      <LinkButton
        to="/"
        buttonVariant="solid"
        className={styles['main-page-button']}
      >
        Go to main page
      </LinkButton>
    </div>
  );
}
