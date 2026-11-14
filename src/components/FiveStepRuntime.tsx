'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef } from 'react';

declare global {
  interface Window {
    trcHomeRuntimeVersion?: string;
    trcMountHome?: () => void;
    trcUnmountHome?: () => void;
  }
}

// next/script caches execution across client navigation. onReady and the mount
// effect restore listeners when the homepage DOM is recreated by Back/Forward.
export default function FiveStepRuntime({ source, version }: { source: string; version: string }) {
  const active = useRef(false);
  const mount = useCallback(() => {
    if (active.current && window.trcHomeRuntimeVersion === version) window.trcMountHome?.();
  }, [version]);

  useEffect(() => {
    active.current = true;
    mount();
    return () => {
      active.current = false;
      window.trcUnmountHome?.();
    };
  }, [mount]);

  return <Script id={`trc-five-step-home-${version}`} strategy="afterInteractive" onReady={mount} dangerouslySetInnerHTML={{ __html: source }} />;
}
