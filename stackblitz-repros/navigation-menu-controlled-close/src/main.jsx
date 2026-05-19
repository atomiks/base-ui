import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import './styles.css';

const overviewLinks = [
  ['Quick Start', 'Install and assemble your first component.'],
  ['Accessibility', 'Learn how Base UI components handle interactions.'],
  ['Releases', 'See what changed in recent Base UI versions.'],
  ['Composition', 'Replace and compose parts with existing components.'],
];

const handbookLinks = [
  ['Styling', 'Style components with CSS, CSS Modules, or Tailwind CSS.'],
  ['Animation', 'Animate with CSS transitions, CSS animations, or JavaScript.'],
  ['Form controls', 'Build accessible fields around headless primitives.'],
];

function App() {
  const [value, setValue] = React.useState('overview');
  const menuOpen = value != null;

  return (
    <main className="App">
      <div className="Controls">
        <label className="Checkbox">
          <input
            type="checkbox"
            checked={menuOpen}
            onChange={(event) => {
              setValue(event.currentTarget.checked ? 'overview' : null);
            }}
          />
          Menu open
        </label>
        <button type="button" onClick={() => setValue('overview')}>
          Open overview
        </button>
        <button type="button" onClick={() => setValue(null)}>
          Close externally
        </button>
      </div>

      <NavigationMenu.Root className="Root" value={value} onValueChange={setValue}>
        <NavigationMenu.List className="List">
          <NavigationMenu.Item value="overview">
            <NavigationMenu.Trigger className="Trigger">
              Overview
              <NavigationMenu.Icon className="Icon">⌄</NavigationMenu.Icon>
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="Content">
              <LinkGrid items={overviewLinks} />
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item value="handbook">
            <NavigationMenu.Trigger className="Trigger">
              Handbook
              <NavigationMenu.Icon className="Icon">⌄</NavigationMenu.Icon>
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="Content ContentNarrow">
              <LinkGrid items={handbookLinks} />
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>

        <NavigationMenu.Portal>
          <NavigationMenu.Positioner className="Positioner" sideOffset={12}>
            <NavigationMenu.Popup className="Popup">
              <NavigationMenu.Viewport className="Viewport" />
            </NavigationMenu.Popup>
          </NavigationMenu.Positioner>
        </NavigationMenu.Portal>
      </NavigationMenu.Root>
    </main>
  );
}

function LinkGrid({ items }) {
  return (
    <ul className="Grid">
      {items.map(([title, description]) => (
        <li key={title}>
          <a className="Card" href="/">
            <strong>{title}</strong>
            <span>{description}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

createRoot(document.getElementById('root')).render(<App />);
