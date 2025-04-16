import * as React from 'react';
import { NavigationMenu } from '@base-ui-components/react/navigation-menu';
import styles from './index.module.css';
import Link from 'next/link';

export default function ExampleNavigationMenu() {
  return (
    <NavigationMenu.Root className={styles.Root}>
      <NavigationMenu.List style={{ display: 'flex' }}>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={styles.Trigger}>
            Overview
            <ChevronDownIcon className={styles.Icon} />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className={styles.Content}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '125px 1fr',
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
          <NavigationMenu.Trigger className={styles.Trigger}>
            Handbook
            <ChevronDownIcon className={styles.Icon} />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className={styles.Content}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 125px',
                gap: 20,
                padding: 20,
              }}
            >
              <div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <li>
                    <a href="/react/overview/quick-start">Styling</a>
                  </li>
                  <li>
                    <a href="/react/overview/accessibility">Animation</a>
                  </li>
                  <li>
                    <a href="/react/overview/about">Composition</a>
                  </li>
                </ul>
              </div>
              <img
                alt=""
                src="https://i.pinimg.com/736x/c6/13/1e/c6131e0206d37d4f4146d53c6e3d16f3.jpg"
                width={125}
                height={125}
                style={{ borderRadius: 6 }}
              />
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link
            className={styles.Trigger}
            render={<Link href="/careers/design-engineer" />}
          >
            Careers
          </NavigationMenu.Link>
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

function ChevronDownIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
      <path d="M1 3.5L5 7.5L9 3.5" stroke="currentcolor" strokeWidth="1.5" />
    </svg>
  );
}
