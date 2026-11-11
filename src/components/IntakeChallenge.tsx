'use client';
import Script from 'next/script';
import { useEffect, useRef } from 'react';
type Turnstile = {render:(node:HTMLElement, options:Record<string,unknown>)=>string;remove:(id:string)=>void};
declare global { interface Window {turnstile?:Turnstile} }
export default function IntakeChallenge({siteKey,onToken,onError,attempt}:{siteKey:string;onToken:(value:string)=>void;onError:()=>void;attempt:number}) {
  const node = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const callbacks = useRef({onToken,onError});
  useEffect(() => { callbacks.current = {onToken,onError}; });
  function render() {
    if (!node.current || !window.turnstile || widget.current !== null) return;
    widget.current = window.turnstile.render(node.current,{sitekey:siteKey,action:'intake',callback:(token:string)=>callbacks.current.onToken(token),'expired-callback':()=>callbacks.current.onToken(''),'error-callback':()=>{callbacks.current.onToken('');callbacks.current.onError();}});
  }
  useEffect(() => {
    render();
    return () => { if (widget.current !== null) window.turnstile?.remove(widget.current); widget.current = null; };
  // Recreate after every attempted request because tokens are single-use.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[attempt,siteKey]);
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={render} onError={onError}/><div ref={node}/></>;
}
