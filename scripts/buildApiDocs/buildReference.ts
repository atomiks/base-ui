/* eslint-disable guard-for-in */
import { globSync } from 'fast-glob';
import { basename, join } from 'path';
import { existsSync, rmSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { PropDef, ComponentDef } from 'docs/src/components/reference/types';
import { ComponentApiContent, PropsTranslations } from '@mui/monorepo/packages/api-docs-builder';

const TEMP_DIR = join(process.cwd(), 'docs/reference/temp');
const TEMP_PROP_DEFS_GLOB = join(process.cwd(), 'docs/reference/temp/components/*.json');
const TEMP_DESCRIPTIONS_GLOB = join(process.cwd(), 'docs/reference/temp/translations/**/*.json');
const COMMON_OVERRIDES_JSON = join(process.cwd(), 'docs/reference/overrides/common.json');
const OVERRIDES_GLOB = join(process.cwd(), 'docs/reference/overrides/*.json');
const FINAL_DIR = join(process.cwd(), 'docs/reference/generated');

interface CommonOverrides {
  props: Record<string, PropDef>;
  types: Record<string, string>;
}

export async function buildReference() {
  if (existsSync(FINAL_DIR)) {
    rmSync(FINAL_DIR, { recursive: true });
  }

  mkdirSync(FINAL_DIR);

  const commonOverrides: CommonOverrides = JSON.parse(readFileSync(COMMON_OVERRIDES_JSON, 'utf-8'));
  const overrides: ComponentDef[] = globSync(OVERRIDES_GLOB).map((pathname) =>
    JSON.parse(readFileSync(pathname, 'utf-8')),
  );

  const descriptionPaths = globSync(TEMP_DESCRIPTIONS_GLOB);
  for (const pathname of globSync(TEMP_PROP_DEFS_GLOB)) {
    const jsonContents = readFileSync(pathname, 'utf-8');
    const componentData: ComponentApiContent = JSON.parse(jsonContents);
    const fileName = basename(pathname);

    const props: Record<string, PropDef> = {};
    const componentOverrides = overrides.find((override) => override.name === componentData.name);

    for (const prop in componentData.props) {
      const propDef = componentData.props[prop];
      const type = propDef.signature?.type ?? propDef.type.description ?? propDef.type.name;

      props[prop] = {
        type: commonOverrides.props?.[prop]?.type ?? commonOverrides.types[type] ?? type,
        default: propDef.default,
        required: propDef.required,
      };
    }

    if (componentOverrides) {
      componentOverrides.props ??= {};
      for (const prop in componentOverrides.props) {
        props[prop] ??= {};
        const propObj = props[prop] as Record<string, unknown>;
        const overrideObj = componentOverrides.props[prop] as Record<string, unknown>;
        for (const key in overrideObj) {
          propObj[key] = overrideObj[key];
        }
      }
    }

    const descriptionPathname = descriptionPaths.find((item) => basename(item) === fileName);
    if (!descriptionPathname) {
      throw new Error(`Expected to find descriptions for "${componentData.name}"`);
    }

    const descriptionJsonContents = readFileSync(descriptionPathname, 'utf-8');
    const descriptionData: PropsTranslations = JSON.parse(descriptionJsonContents);

    for (const prop in props) {
      props[prop].description = descriptionData.propDescriptions[prop]?.description;

      if (!descriptionData.propDescriptions[prop]?.description) {
        console.warn(`Missing prop description: ${componentData.name} / ${prop}`);
      }
    }

    if (!descriptionData.componentDescription) {
      console.warn(`Missing component description: ${componentData.name}`);
    }

    const attributes = componentOverrides?.attributes;
    const cssVariables = componentOverrides?.cssVariables;

    const json: ComponentDef = {
      name: componentData.name,
      description: descriptionData.componentDescription,
      props,
      attributes,
      cssVariables,
    };

    const newPathname = join(FINAL_DIR, fileName);
    const jsonString = JSON.stringify(json, null, 2);
    writeFileSync(newPathname, `${jsonString}\n`);
  }

  rmSync(TEMP_DIR, { recursive: true });
}
