import * as React from 'react';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import styles from './index.module.css';

export default function ExampleNavigationMenu() {
  return (
    <NavigationMenu.Root className={styles.Root}>
      <NavigationMenu.List className={styles.List}>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={styles.Trigger}>
            Product
            <NavigationMenu.Icon className={styles.Icon}>
              <ChevronDownIcon />
            </NavigationMenu.Icon>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className={`${styles.Content} ${styles.ProductContent}`}>
            <NavigationMenu.Root
              className={styles.SubmenuRoot}
              orientation="vertical"
              defaultValue="developers"
            >
              <div className={styles.SubmenuLayout}>
                <NavigationMenu.List className={styles.SubmenuList}>
                  {audienceMenus.map((menu) => (
                    <NavigationMenu.Item key={menu.value} value={menu.value}>
                      <NavigationMenu.Trigger className={styles.SubmenuTrigger}>
                        <span className={styles.SubmenuLabel}>{menu.label}</span>
                        <span className={styles.SubmenuHint}>{menu.hint}</span>
                      </NavigationMenu.Trigger>
                      <NavigationMenu.Content className={styles.SubmenuContent}>
                        <h4 className={styles.SubmenuTitle}>{menu.title}</h4>
                        <p className={styles.SubmenuDescription}>{menu.description}</p>
                        <ul className={styles.LinkList}>
                          {menu.links.map((link) => (
                            <li key={link.href}>
                              <Link className={styles.LinkCard} href={link.href}>
                                <h5 className={styles.LinkTitle}>{link.title}</h5>
                                <p className={styles.LinkDescription}>{link.description}</p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenu.Content>
                    </NavigationMenu.Item>
                  ))}
                </NavigationMenu.List>

                <NavigationMenu.Viewport className={styles.SubmenuViewport} />
              </div>
            </NavigationMenu.Root>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={styles.Trigger}>
            Learn
            <NavigationMenu.Icon className={styles.Icon}>
              <ChevronDownIcon />
            </NavigationMenu.Icon>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className={`${styles.Content} ${styles.GuidesContent}`}>
            <div className={styles.GuidesPanel}>
              <h4 className={styles.SubmenuTitle}>Ship with confidence</h4>
              <p className={styles.SubmenuDescription}>
                Learn the interaction patterns teams standardize first when adopting Base UI.
              </p>
              <ul className={styles.LinkList}>
                {guideLinks.map((link) => (
                  <li key={link.href}>
                    <Link className={styles.LinkCard} href={link.href}>
                      <h5 className={styles.LinkTitle}>{link.title}</h5>
                      <p className={styles.LinkDescription}>{link.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <Link className={styles.Trigger} href="/react/overview/releases">
            Releases
          </Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <Link className={styles.Trigger} href="https://github.com/mui/base-ui">
            GitHub
          </Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          className={styles.Positioner}
          sideOffset={10}
          collisionPadding={{ top: 5, bottom: 5, left: 20, right: 20 }}
          collisionAvoidance={{ side: 'none' }}
        >
          <NavigationMenu.Popup className={styles.Popup}>
            <NavigationMenu.Arrow className={styles.Arrow}>
              <ArrowSvg />
            </NavigationMenu.Arrow>
            <NavigationMenu.Viewport className={styles.Viewport} />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}

function Link(props: NavigationMenu.Link.Props) {
  return (
    <NavigationMenu.Link
      render={
        // Use the `render` prop to render your framework's Link component
        // for client-side routing.
        // e.g. `<NextLink href={props.href} />` instead of `<a />`.
        <a />
      }
      {...props}
    />
  );
}

function ChevronDownIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
      <path d="M1 3.5L5 7.5L9 3.5" stroke="currentcolor" strokeWidth="1.5" />
    </svg>
  );
}

function ArrowSvg(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className={styles.ArrowFill}
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        className={styles.ArrowOuterStroke}
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className={styles.ArrowInnerStroke}
      />
    </svg>
  );
}

const audienceMenus = [
  {
    value: 'developers',
    label: 'Developers',
    hint: 'Build and ship product features.',
    title: 'Composable primitives for app teams',
    description: 'Start with unstyled parts and keep full control over UI and interaction.',
    links: [
      {
        href: '/react/overview/quick-start',
        title: 'Get started',
        description: 'Install Base UI and ship your first component quickly.',
      },
      {
        href: '/react/handbook/composition',
        title: 'Composition',
        description: 'Combine parts to create app-specific interaction patterns.',
      },
    ],
  },
  {
    value: 'systems',
    label: 'Design Systems',
    hint: 'Standardize patterns for many teams.',
    title: 'Scale consistency across products',
    description: 'Document tokens, behavior, and accessibility expectations in one place.',
    links: [
      {
        href: '/react/handbook/styling',
        title: 'Styling',
        description: 'Connect your token system using CSS Modules or Tailwind.',
      },
      {
        href: '/react/overview/accessibility',
        title: 'Accessibility',
        description: 'Review keyboard navigation and ARIA support details.',
      },
      {
        href: '/react/components/tooltip',
        title: 'Tooltip',
        description: 'Validate hover, focus, and dismiss flows in component-level specs.',
      },
      {
        href: '/react/components/popover',
        title: 'Popover',
        description: 'Standardize complex anchored surfaces with predictable positioning rules.',
      },
    ],
  },
  {
    value: 'managers',
    label: 'Engineering Leads',
    hint: 'Coordinate shared patterns across squads.',
    title: 'Coordinate delivery with shared behavior contracts',
    description:
      'Align teams on interaction decisions while preserving room for product-level customizations.',
    links: [
      {
        href: '/react/overview/releases',
        title: 'Releases',
        description: 'Track updates and plan migrations with clear version notes.',
      },
    ],
  },
  {
    value: 'startups',
    label: 'Startups',
    hint: 'Move fast with a compact design system.',
    title: 'Ship a first-party UI kit with minimal overhead',
    description:
      'Adopt production-ready primitives incrementally while keeping implementation time low.',
    links: [
      {
        href: '/react/overview/quick-start',
        title: 'Quick start',
        description: 'Set up the package and render your first primitive in a few minutes.',
      },
      {
        href: '/react/components/menu',
        title: 'Menu',
        description: 'Add command-style actions with keyboard support out of the box.',
      },
      {
        href: '/react/components/select',
        title: 'Select',
        description: 'Build flexible option pickers using a headless combobox architecture.',
      },
    ],
  },
] as const;

const guideLinks = [
  {
    href: '/react/overview/accessibility',
    title: 'Accessibility handbook',
    description: 'Review patterns for focus management and semantic structure.',
  },
  {
    href: '/react/handbook/animation',
    title: 'Animation handbook',
    description: 'Coordinate easing and durations across popups and inline panels.',
  },
  {
    href: '/react/handbook/styling',
    title: 'Styling handbook',
    description: 'Wire design tokens with CSS Modules or Tailwind utilities.',
  },
] as const;
