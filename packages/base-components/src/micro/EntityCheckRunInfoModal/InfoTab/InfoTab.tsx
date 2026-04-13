import { ClientEntityCheckRunWithId } from '@game-cms/base-core';
import {
  DateTimeUTC,
  IconLinkButton,
  Labeled,
  OpenInNewIcon,
  Typography,
} from '@game-cms/ui';

import styles from './InfoTab.module.scss';

export interface InfoTabProps {
  run: ClientEntityCheckRunWithId;
}

export function InfoTab({ run }: InfoTabProps) {
  const { status, checkId, entityId, documentId, createdAt, finishedAt } = run;

  return (
    <div className={styles.root}>
      <Labeled title="Status">
        <Typography>{status}</Typography>
      </Labeled>

      <Labeled title="Check">
        <Typography>{checkId}</Typography>
      </Labeled>

      <Labeled title="Entity">
        <Typography>{entityId}</Typography>
      </Labeled>

      <Labeled title="Document">
        <div className={styles['item-document']}>
          <Typography>{documentId}</Typography>

          <IconLinkButton
            title="View entity"
            to={`/entities/${entityId}/edit/${documentId}`}
          >
            <OpenInNewIcon />
          </IconLinkButton>
        </div>
      </Labeled>

      <Labeled title="Created at">
        <DateTimeUTC input={createdAt} />
      </Labeled>

      <Labeled title="Finished at">
        <DateTimeUTC input={finishedAt} />
      </Labeled>
    </div>
  );
}
