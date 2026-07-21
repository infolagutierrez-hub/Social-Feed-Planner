import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Social Feed Planner',
  description: 'Visually plan and organize your social media feed before publishing.',
}

// Applied server-side — no flash of unstyled content
const ANIMATIONS_CSS = `
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes slot-pop{0%{transform:scale(1)}40%{transform:scale(1.06)}70%{transform:scale(.97)}100%{transform:scale(1)}}
.skeleton{background:linear-gradient(90deg,#ebebeb 25%,#d6d6d6 50%,#ebebeb 75%);background-size:200% 100%;animation:shimmer 1.6s ease-in-out infinite}
.dark .skeleton{background:linear-gradient(90deg,#2c2c2e 25%,#3a3a3c 50%,#2c2c2e 75%);background-size:200% 100%}
.slot-pop{animation:slot-pop .28s cubic-bezier(.34,1.56,.64,1)}
*,*::before,*::after{box-sizing:border-box}
body{font-family:var(--font-geist-sans,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif);-webkit-font-smoothing:antialiased}
`

// Inline script: reads localStorage and applies design tokens before first paint
const INIT_SCRIPT = `(function(){
  var L={'--bg':'#F2F2F7','--sidebar':'#fff','--card':'#fff','--card-hover':'#fafafa','--text-1':'#1c1c1e','--text-2':'#6c6c70','--text-3':'#aeaeb2','--border':'rgba(0,0,0,0.07)','--border-focus':'rgba(0,0,0,0.22)','--slot-empty':'#f3f4f6','--slot-hover':'#eef2ff','--input':'#f9fafb','--accent':'#4f46e5','--accent-soft':'#eef2ff'};
  var D={'--bg':'#0e0e10','--sidebar':'#1c1c1e','--card':'#2c2c2e','--card-hover':'#3a3a3c','--text-1':'#f5f5f7','--text-2':'#98989d','--text-3':'#636366','--border':'rgba(255,255,255,0.08)','--border-focus':'rgba(255,255,255,0.22)','--slot-empty':'#2c2c2e','--slot-hover':'#1e2035','--input':'#1c1c1e','--accent':'#818cf8','--accent-soft':'#1e1e35'};
  try{var s=JSON.parse(localStorage.getItem('feed-planner-ui')||'{}');var dark=s.state&&s.state.isDark;var t=dark?D:L;var r=document.documentElement;for(var k in t)r.style.setProperty(k,t[k]);if(dark)r.classList.add('dark')}catch(e){var r=document.documentElement;for(var k in L)r.style.setProperty(k,L[k])}
})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: ANIMATIONS_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />
      </head>
      <body className="h-full">{children}</body>
    </html>
  )
}
