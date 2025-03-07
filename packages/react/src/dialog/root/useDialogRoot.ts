'use client';
import * as React from 'react';
import {
  FloatingRootContext,
  useClick,
  useDismiss,
  useFloatingRootContext,
  useInteractions,
  type OpenChangeReason as FloatingUIOpenChangeReason,
} from '@floating-ui/react';
import { useControlled } from '../../utils/useControlled';
import { useEventCallback } from '../../utils/useEventCallback';
import { useScrollLock } from '../../utils/useScrollLock';
import { useTransitionStatus, type TransitionStatus } from '../../utils/useTransitionStatus';
import { type InteractionType } from '../../utils/useEnhancedClickHandler';
import type { RequiredExcept, GenericHTMLProps } from '../../utils/types';
import { useOpenInteractionType } from '../../utils/useOpenInteractionType';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { useAfterExitAnimation } from '../../utils/useAfterExitAnimation';
import {
  type OpenChangeReason,
  translateOpenChangeReason,
} from '../../utils/translateOpenChangeReason';

export function useDialogRoot(params: useDialogRoot.Parameters): useDialogRoot.ReturnValue {
  const {
    defaultOpen,
    dismissible,
    modal,
    onNestedDialogClose,
    onNestedDialogOpen,
    onOpenChange: onOpenChangeParameter,
    open: openParam,
    onCloseComplete,
  } = params;

  const [open, setOpenUnwrapped] = useControlled({
    controlled: openParam,
    default: defaultOpen,
    name: 'DialogRoot',
    state: 'open',
  });

  const popupRef = React.useRef<HTMLElement>(null);

  const [titleElementId, setTitleElementId] = React.useState<string | undefined>(undefined);
  const [descriptionElementId, setDescriptionElementId] = React.useState<string | undefined>(
    undefined,
  );
  const [triggerElement, setTriggerElement] = React.useState<Element | null>(null);
  const [popupElement, setPopupElement] = React.useState<HTMLElement | null>(null);
  const [popupElementId, setPopupElementId] = React.useState<string | undefined>(undefined);

  const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);

  const setOpen = useEventCallback(
    (nextOpen: boolean, event: Event | undefined, reason: OpenChangeReason | undefined) => {
      onOpenChangeParameter?.(nextOpen, event, reason);
      setOpenUnwrapped(nextOpen);
    },
  );

  useAfterExitAnimation({
    open,
    animatedElementRef: popupRef,
    onFinished() {
      setMounted(false);
      onCloseComplete?.();
    },
  });

  useScrollLock(open && modal, popupElement);

  const handleFloatingUIOpenChange = (
    nextOpen: boolean,
    event: Event | undefined,
    reason: FloatingUIOpenChangeReason | undefined,
  ) => {
    setOpen(nextOpen, event, translateOpenChangeReason(reason));
  };

  const context = useFloatingRootContext({
    elements: { reference: triggerElement, floating: popupElement },
    open,
    onOpenChange: handleFloatingUIOpenChange,
  });
  const [ownNestedOpenDialogs, setOwnNestedOpenDialogs] = React.useState(0);
  const isTopmost = ownNestedOpenDialogs === 0;

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
    outsidePress: isTopmost && dismissible,
    escapeKey: isTopmost,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  React.useEffect(() => {
    if (onNestedDialogOpen && open) {
      onNestedDialogOpen(ownNestedOpenDialogs);
    }

    if (onNestedDialogClose && !open) {
      onNestedDialogClose();
    }

    return () => {
      if (onNestedDialogClose && open) {
        onNestedDialogClose();
      }
    };
  }, [open, onNestedDialogClose, onNestedDialogOpen, ownNestedOpenDialogs]);

  const handleNestedDialogOpen = React.useCallback((ownChildrenCount: number) => {
    setOwnNestedOpenDialogs(ownChildrenCount + 1);
  }, []);

  const handleNestedDialogClose = React.useCallback(() => {
    setOwnNestedOpenDialogs(0);
  }, []);

  const { openMethod, triggerProps } = useOpenInteractionType(open);

  return React.useMemo(() => {
    return {
      modal,
      setOpen,
      open,
      titleElementId,
      setTitleElementId,
      descriptionElementId,
      setDescriptionElementId,
      popupElementId,
      setPopupElementId,
      onNestedDialogOpen: handleNestedDialogOpen,
      onNestedDialogClose: handleNestedDialogClose,
      nestedOpenDialogCount: ownNestedOpenDialogs,
      openMethod,
      mounted,
      transitionStatus,
      getTriggerProps: (externalProps?: React.HTMLProps<Element>) =>
        getReferenceProps(mergeReactProps(externalProps, triggerProps)),
      getPopupProps: getFloatingProps,
      setTriggerElement,
      setPopupElement,
      popupRef,
      floatingRootContext: context,
    } satisfies useDialogRoot.ReturnValue;
  }, [
    modal,
    open,
    setOpen,
    titleElementId,
    descriptionElementId,
    popupElementId,
    handleNestedDialogClose,
    handleNestedDialogOpen,
    ownNestedOpenDialogs,
    openMethod,
    mounted,
    transitionStatus,
    getReferenceProps,
    getFloatingProps,
    setTriggerElement,
    setPopupElement,
    triggerProps,
    popupRef,
    context,
  ]);
}

export interface SharedParameters {
  /**
   * Whether the dialog is currently open.
   */
  open?: boolean;
  /**
   * Whether the dialog is initially open.
   *
   * To render a controlled dialog, use the `open` prop instead.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Whether the dialog should prevent outside clicks and lock page scroll when open.
   * @default true
   */
  modal?: boolean;
  /**
   * Event handler called when the dialog is opened or closed.
   */
  onOpenChange?: (
    open: boolean,
    event: Event | undefined,
    reason: OpenChangeReason | undefined,
  ) => void;
  /**
   * Event handler called after any exit animations finish when the dialog is closed.
   */
  onCloseComplete?: () => void;
  /**
   * Determines whether the dialog should close on outside clicks.
   * @default true
   */
  dismissible?: boolean;
}

export namespace useDialogRoot {
  export interface Parameters
    extends RequiredExcept<SharedParameters, 'open' | 'onOpenChange' | 'onCloseComplete'> {
    /**
     * Callback to invoke when a nested dialog is opened.
     */
    onNestedDialogOpen?: (ownChildrenCount: number) => void;
    /**
     * Callback to invoke when a nested dialog is closed.
     */
    onNestedDialogClose?: () => void;
  }

  export interface ReturnValue {
    /**
     * The id of the description element associated with the dialog.
     */
    descriptionElementId: string | undefined;
    /**
     * Whether the dialog should prevent outside clicks and lock page scroll when open.
     */
    modal: boolean;
    /**
     * Number of nested dialogs that are currently open.
     */
    nestedOpenDialogCount: number;
    /**
     * Callback to invoke when a nested dialog is closed.
     */
    onNestedDialogClose?: () => void;
    /**
     * Callback to invoke when a nested dialog is opened.
     */
    onNestedDialogOpen?: (ownChildrenCount: number) => void;
    /**
     * Event handler called when the dialog is opened or closed.
     */
    setOpen: (
      open: boolean,
      event: Event | undefined,
      reason: OpenChangeReason | undefined,
    ) => void;
    /**
     * Whether the dialog is currently open.
     */
    open: boolean;
    /**
     * Determines what triggered the dialog to open.
     */
    openMethod: InteractionType | null;
    /**
     * The id of the popup element.
     */
    popupElementId: string | undefined;
    /**
     * Callback to set the id of the description element associated with the dialog.
     */
    setDescriptionElementId: (elementId: string | undefined) => void;
    /**
     * Callback to set the id of the popup element.
     */
    setPopupElementId: (elementId: string | undefined) => void;
    /**
     * Callback to set the id of the title element.
     */
    setTitleElementId: (elementId: string | undefined) => void;
    /**
     * The id of the title element associated with the dialog.
     */
    titleElementId: string | undefined;
    /**
     * Determines if the dialog should be mounted.
     */
    mounted: boolean;
    /**
     * The transition status of the dialog.
     */
    transitionStatus: TransitionStatus;
    /**
     * Resolver for the Trigger element's props.
     */
    getTriggerProps: (externalProps?: GenericHTMLProps) => GenericHTMLProps;
    /**
     * Resolver for the Popup element's props.
     */
    getPopupProps: (externalProps?: GenericHTMLProps) => GenericHTMLProps;
    /**
     * Callback to register the Trigger element DOM node.
     */
    setTriggerElement: React.Dispatch<React.SetStateAction<Element | null>>;
    /**
     * Callback to register the Popup element DOM node.
     */
    setPopupElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    /**
     * The ref to the Popup element.
     */
    popupRef: React.RefObject<HTMLElement | null>;
    /**
     * The Floating UI root context.
     */
    floatingRootContext: FloatingRootContext;
  }
}
