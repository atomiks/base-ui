import * as React from 'react';
import { NavigationMenu } from '@base-ui-components/react/navigation-menu';
import styles from './index.module.css';

export default function ExampleNavigationMenu() {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List style={{ display: 'flex' }}>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Overview</NavigationMenu.Trigger>
          <NavigationMenu.Content className={styles.Content} style={{ width: 350 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 10rem',
                gap: 20,
                padding: 20,
              }}
            >
              <img
                alt=""
                src="https://pbs.twimg.com/profile_images/1863598700473335808/YVP32qSQ_400x400.jpg"
                width={125}
                height={125}
                style={{ borderRadius: 6 }}
              />
              <div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <li>
                    <a href="/react/overview/quick-start">Quick Start</a>
                  </li>
                  <li>
                    <a href="/react/overview/accessibility">Accessibility</a>
                  </li>
                  <li>
                    <a href="/react/overview/releases">Releases</a>
                  </li>
                  <li>
                    <a href="/react/overview/about">About</a>
                  </li>
                </ul>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Links</NavigationMenu.Trigger>
          <NavigationMenu.Content className={styles.Content}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '6rem 1fr',
                gap: 20,
                padding: 20,
              }}
            >
              <div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <li>
                    <a href="/react/overview/quick-start">X/Twitter</a>
                  </li>
                  <li>
                    <a href="/react/overview/accessibility">BlueSky</a>
                  </li>
                  <li>
                    <a href="/react/overview/releases">GitHub</a>
                  </li>
                  <li>
                    <a href="/react/overview/about">npm</a>
                  </li>
                </ul>
              </div>
              <img
                alt=""
                src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png"
                width={125}
                height={125}
                style={{ borderRadius: 6 }}
              />
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>Hello</NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner className={styles.Positioner} sideOffset={5}>
          <NavigationMenu.Popup className={styles.Popup}>Hello</NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}
