import type { RelativeTime, TimeSpec } from '@game-cms/shared/chrono';
import { useCallback, useMemo } from 'react';

import { useModal } from '../../hooks';
import { formatTimeSpec } from '../../utils/timeFormatter';
import { Select } from '../Select';
import type { SelectItem } from '../SelectBase';
import { TimeSelectCustomDialog } from '../TimeSelectCustomDialog';

const CUSTOM_ITEM = '$c';

export interface TimeSelectProps {
  className?: string;
  suggestions?: RelativeTime[];
  selectedItem: TimeSpec;
  onItemSelected: (value: TimeSpec) => void;
}

export function TimeSelect({
  className,
  suggestions = [],
  selectedItem,
  onItemSelected,
}: TimeSelectProps) {
  const showModal = useModal();

  const [items, isCustomItem] = useMemo(() => {
    const suggestionItems = suggestions.map((value): SelectItem => ({
      key: value,
      title: formatTimeSpec(value) ?? '',
    }));

    const isCustomItem = suggestionItems.every(
      ({ key }) => key !== selectedItem
    );

    return [
      [
        ...suggestionItems,
        {
          key: CUSTOM_ITEM,
          title: isCustomItem
            ? `Custom (${formatTimeSpec(selectedItem)})`
            : 'Custom',
        },
      ],
      isCustomItem,
    ] as const;
  }, [selectedItem, suggestions]);

  const onBaseItemSelected = useCallback(
    (key: string) => {
      if (key === CUSTOM_ITEM) {
        void showModal(TimeSelectCustomDialog, {}).then((spec) => {
          if (spec !== undefined) {
            onItemSelected(spec);
          }
        });
      } else {
        onItemSelected(key);
      }
    },
    [onItemSelected, showModal]
  );

  return (
    <Select
      className={className}
      items={items}
      selectedItem={isCustomItem ? CUSTOM_ITEM : selectedItem}
      onItemSelected={onBaseItemSelected}
      placeholder=""
    />
  );
}
