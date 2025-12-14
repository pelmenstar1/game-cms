import { LinkButton, PlusIcon } from '@game-cms/ui';

import styles from './route.module.scss';

export default function Page() {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <LinkButton
          to="/settings/api-tokens/+"
          className={styles['new-token-button']}
          buttonVariant="outlined"
          icon
        >
          <PlusIcon />
          Create token
        </LinkButton>
      </div>
    </div>
  );
}
