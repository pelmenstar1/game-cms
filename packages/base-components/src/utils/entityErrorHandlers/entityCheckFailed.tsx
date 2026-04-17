import { isApiErrorOfCode } from '@game-cms/core/api';

import { EntityActionErrorHandler } from '../../hooks/internal/useAccessEntity.js';
import { EntityCheckFailedAddon } from '../../micro/EntityCheck/EntityCheckFailedAddon/index.js';

export const entityCheckFailed: EntityActionErrorHandler = (error) => {
  if (isApiErrorOfCode(error, 'base::entityCheck/fail')) {
    const failedRunIds = error.details?.failedRunIds;

    return {
      message: 'One or more of the entity checks failed.',
      addon: failedRunIds && (
        <EntityCheckFailedAddon failedRunIds={failedRunIds} />
      ),
    };
  }
};
