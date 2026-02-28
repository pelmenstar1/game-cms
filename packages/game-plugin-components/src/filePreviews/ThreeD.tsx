import { FilePreviewRenderer } from '@game-cms/base-core';

import { ThreeDModelController } from '../micro/ThreeDModelController';

const ThreeD: FilePreviewRenderer = ({ url }) => {
  return <ThreeDModelController source={url} />;
};

export default ThreeD;
