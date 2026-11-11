import type { Metadata } from 'next';

export const metadata: Metadata = {title:'Get started | The Ready Consult',robots:{index:false,follow:true}};

// Keep old /contact links useful while the only public form lives on the homepage.
export default function ContactRedirect(){return <main><meta httpEquiv="refresh" content="0;url=/#signup"/><p><a href="/#signup">Continue to the signup form</a></p></main>}
