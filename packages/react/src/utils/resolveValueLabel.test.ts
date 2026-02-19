import { expect } from 'chai';
import { hasNullItemLabel } from './resolveValueLabel';

describe('resolveValueLabel', () => {
  describe('hasNullItemLabel', () => {
    it('returns false for record items when null key is missing', () => {
      const items = {
        a: 'A',
      };

      expect(hasNullItemLabel(items)).to.equal(false);
    });

    it('returns true for record items when null key has a label', () => {
      const items = {
        null: 'Select',
        a: 'A',
      };

      expect(hasNullItemLabel(items)).to.equal(true);
    });

    it('returns false for record items when null key has no label', () => {
      const items = {
        null: null,
        a: 'A',
      };

      expect(hasNullItemLabel(items)).to.equal(false);
    });

    it('returns true when grouped items contain a null-valued item with a label', () => {
      const items = [
        {
          value: 'group-1',
          items: [
            { value: 'a', label: 'A' },
            { value: null, label: 'Select' },
          ],
        },
      ];

      expect(hasNullItemLabel(items)).to.equal(true);
    });

    it('returns false when grouped items contain a null-valued item without a label', () => {
      const items = [
        {
          value: 'group-1',
          items: [
            { value: null, label: null },
            { value: 'a', label: 'A' },
          ],
        },
      ];

      expect(hasNullItemLabel(items)).to.equal(false);
    });

    it('returns false when grouped items do not contain a null-valued item', () => {
      const items = [
        {
          value: 'group-1',
          items: [{ value: 'a', label: 'A' }],
        },
      ];

      expect(hasNullItemLabel(items)).to.equal(false);
    });
  });
});
