import preview from '#storybook/preview';

import { Tab } from '../Tab';
import { Typography } from '../Typography';
import { Tabs } from '.';

function Component() {
  return (
    <Tabs>
      <Tab tabId="tab1" title="Tab 1">
        <Typography>Tab 1 content</Typography>
      </Tab>

      <Tab tabId="tab2" title="Tab 2">
        <Typography>Tab 2 content</Typography>
      </Tab>

      <Tab tabId="tab3" title="Tab 3">
        <Typography>Tab 3 content</Typography>
      </Tab>
    </Tabs>
  );
}

const meta = preview.meta({ component: Component });

export const Primary = meta.story({});
