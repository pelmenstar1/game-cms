import { ComponentDataCustomValidator } from '@game-cms/core';
import { filePortal } from '@game-cms/shared/node';

export function remoteCustomValidator(
  validator: Pick<ComponentDataCustomValidator, 'check'>
): ComponentDataCustomValidator {
  return {
    clientConnector: filePortal(import.meta, 'customValidator.client.js'),
    ...validator,
  };
}
