import { SpineController } from '../micro/SpineController';
import { SpineData } from '../micro/SpineRenderer/types';

export function Spine({ spine }: { spine: SpineData }) {
  return <SpineController spine={spine} />;
}

export default Spine;
