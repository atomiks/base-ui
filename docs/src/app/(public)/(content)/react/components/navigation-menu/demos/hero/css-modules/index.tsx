import * as React from 'react';
import { NavigationMenu } from '@base-ui-components/react/navigation-menu';
import styles from './index.module.css';

export default function ExampleNavigationMenu() {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List style={{ display: 'flex' }}>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Link A</NavigationMenu.Trigger>
          <NavigationMenu.Content>Content A</NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Link B</NavigationMenu.Trigger>
          <NavigationMenu.Content>Content B</NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Link C</NavigationMenu.Trigger>
          <NavigationMenu.Content style={{ width: 500 }}>
            {`Content C `.repeat(20)}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner className={styles.Positioner} sideOffset={5}>
          <NavigationMenu.Popup className={styles.Popup} />
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}
