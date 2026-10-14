import { BlueprintGrid, BracketButton, TerminalWindow } from '@/components/ds';
import { PageShell } from '@/components/site/PageShell';
import { RoleLink } from '@/lib/role';

export default function NotFound() {
  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <BlueprintGrid cellSize={28} color="var(--error)" minorOpacity={0.05} majorOpacity={0.1} fade="radial" />
        <div className="container-site relative grid min-h-[60vh] items-center gap-12 py-24 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="label-mono mb-5">
              <span className="text-error">ERR</span> <span className="text-ink-3">//</span> Route not found
            </p>
            <h1 className="font-heading text-7xl font-semibold leading-none tracking-tight text-ink md:text-9xl">
              4<span className="serif-accent text-ember">0</span>4
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">
              This path does not resolve. Either the link is stale or you were testing the router. Respect either way.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BracketButton as={RoleLink} to="/">
                Back to index
              </BracketButton>
              <BracketButton as={RoleLink} to="/playground" variant="ghost">
                Visit the playground
              </BracketButton>
            </div>
          </div>
          <div className="lg:col-span-6">
            <TerminalWindow
              title="zsh — router"
              startInView={false}
              lines={[
                { type: 'command', content: `curl -I ${typeof window !== 'undefined' ? window.location.pathname : '/unknown'}` },
                { type: 'output', content: 'HTTP/1.1 404 Not Found' },
                { type: 'output', content: 'x-reason: nobody has built this yet' },
                { type: 'command', content: 'ls /' },
                { type: 'output', content: 'work/  blog/  playground/  about/  contact/' },
              ]}
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
