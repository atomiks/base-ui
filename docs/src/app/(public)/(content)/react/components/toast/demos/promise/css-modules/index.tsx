'use client';
import * as React from 'react';
import { Toast } from '@base-ui-components/react/toast';
import styles from './index.module.css';

const position = 'top';

export default function PromiseToastExample() {
  return (
    <Toast.Provider>
      <PromiseDemo />
      <Toast.Viewport className={styles.Viewport} data-position={position}>
        <ToastList />
      </Toast.Viewport>
    </Toast.Provider>
  );
}

function PromiseDemo() {
  const toast = Toast.useToast();

  function runPromise() {
    toast.promise(
      // Simulate an API request with a promise that resolves after 2 seconds
      new Promise<string>((resolve, reject) => {
        const shouldSucceed = Math.random() > 0.3; // 70% success rate
        setTimeout(() => {
          if (shouldSucceed) {
            resolve('operation completed');
          } else {
            reject('operation failed');
          }
        }, 2000);
      }),
      {
        loading: 'Loading data...',
        success: {
          title: (data) => `Success: ${data}`,
        },
        error: {
          title: (err) => `Error: ${err}`,
        },
      },
    );
  }

  return (
    <button type="button" onClick={runPromise} className={styles.Button}>
      Run promise
    </button>
  );
}

function ToastList() {
  const { toasts } = Toast.useToast();

  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className={styles.Toast}
      data-type={toast.type}
      data-position={position}
      swipeDirection={position.startsWith('top') ? 'up' : 'down'}
    >
      <Toast.Content className={styles.Content}>
        {toast.title && (
          <Toast.Title className={styles.Title}>{toast.title}</Toast.Title>
        )}
        {toast.description && (
          <Toast.Description className={styles.Description}>
            {toast.description}
          </Toast.Description>
        )}
      </Toast.Content>
      <Toast.Close className={styles.Close} aria-label="Close">
        <XIcon className={styles.Icon} />
      </Toast.Close>
    </Toast.Root>
  ));
}

function XIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
