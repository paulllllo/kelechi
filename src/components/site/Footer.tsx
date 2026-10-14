import { ArrowUpRightIcon } from 'lucide-react';
import { CoordinateTag, Divider, Logo, RulerEdge, StatusDot } from '@/components/ds';
import { profile } from '@/data/profile';
import { RoleLink, useRole } from '@/lib/role';
import { NAV_ITEMS } from './Nav';

export function Footer() {
  const { profile: roleProfile, withRole } = useRole();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-border bg-surface-sunken/60">
      <RulerEdge side="top" spacing={10} majorEvery={10} size={14} tone="muted" baseline={false} className="absolute inset-x-0 top-0" />
      <div className="container-site py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo to={withRole('/')} descriptor={roleProfile.descriptor} size="md" />
            <p className="mt-6 flex items-center gap-2 text-sm text-ink-2">
              <StatusDot status="online" size="sm" label={null} />
              {profile.availability.label}
              <span className="text-border-strong">·</span>
              {profile.location}
            </p>
            <div className="mt-6">
              <CoordinateTag showIcon label="LOC" coordinates={profile.coordinates} precision={4} />
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="label-mono mb-4">Index</h3>
            <ul className="flex flex-col gap-2.5 font-mono text-xs uppercase tracking-wider">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <RoleLink to={item.to} className="text-ink-2 transition-colors hover:text-ember">
                    {item.label}
                  </RoleLink>
                </li>
              ))}
              <li>
                <RoleLink to="/contact" className="text-ink-2 transition-colors hover:text-ember">
                  Contact
                </RoleLink>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="label-mono mb-4">Channels</h3>
            <ul className="flex flex-col gap-2.5 font-mono text-xs">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-ink-2 transition-colors hover:text-ember"
                  >
                    <span className="uppercase tracking-wider text-ink-3 group-hover:text-ember/70">{s.label}</span>
                    <span>{s.handle}</span>
                    <ArrowUpRightIcon className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
              <li>
                <a href={profile.resumeUrl} download className="group inline-flex items-center gap-2 text-ink-2 transition-colors hover:text-ember">
                  <span className="uppercase tracking-wider text-ink-3 group-hover:text-ember/70">Résumé</span>
                  <span>PDF · 1 page</span>
                  <ArrowUpRightIcon className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Divider className="my-10" tick tickPosition="center" />

        <div className="flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {profile.fullName}
          </span>
          <span className="flex items-center gap-3">
            <span>v1.0.0</span>
            <span aria-hidden="true">/</span>
            <span>
              Lens: <span className="text-ember">{roleProfile.label}</span>
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
