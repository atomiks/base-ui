import * as React from 'react';
import { NavigationMenu } from '@base-ui-components/react/navigation-menu';
import styles from './index.module.css';

export default function ExampleNavigationMenu() {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List style={{ display: 'flex' }}>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>About</NavigationMenu.Trigger>
          <NavigationMenu.Content>Content 1</NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Contact</NavigationMenu.Trigger>
          <NavigationMenu.Content>Content 2</NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner sideOffset={5}>
          <NavigationMenu.Popup className={styles.Popup} />
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}
