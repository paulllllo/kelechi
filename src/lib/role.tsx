import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { Link, type LinkProps, useLocation, useSearchParams } from 'react-router-dom';
import { ROLES, resolveRole, type RoleKey, type RoleProfile } from '@/data/roles';

interface RoleContextValue {
  role: RoleKey;
  profile: RoleProfile;
  /** Whether the role came from the URL (vs default). */
  explicit: boolean;
  setRole: (role: RoleKey) => void;
  /** Append the current ?type to an internal path so it survives navigation. */
  withRole: (to: string) => string;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [params, setParams] = useSearchParams();
  const raw = params.get('type');
  const role = resolveRole(raw);
  const explicit = raw !== null;

  const setRole = useCallback(
    (next: RoleKey) => {
      const nextParams = new URLSearchParams(params);
      if (next === 'fullstack') nextParams.delete('type');
      else nextParams.set('type', next);
      setParams(nextParams, { replace: true });
    },
    [params, setParams],
  );

  const withRole = useCallback(
    (to: string) => {
      if (role === 'fullstack') return to;
      const [path, hash] = to.split('#');
      const sep = path.includes('?') ? '&' : '?';
      return `${path}${sep}type=${role}${hash ? `#${hash}` : ''}`;
    },
    [role],
  );

  // Keep the document title in sync with the role.
  useEffect(() => {
    document.title = `Kelechi Odigbo — ${ROLES[role].title}`;
  }, [role]);

  const value = useMemo<RoleContextValue>(
    () => ({ role, profile: ROLES[role], explicit, setRole, withRole }),
    [role, explicit, setRole, withRole],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}

/** `<Link>` that preserves the active `?type=` across internal navigation. */
export const RoleLink = React.forwardRef<HTMLAnchorElement, LinkProps>(function RoleLink({ to, ...rest }, ref) {
  const { withRole } = useRole();
  const target = typeof to === 'string' ? withRole(to) : to;
  return <Link ref={ref} to={target} {...rest} />;
});

/** Scroll to top on route change (but not on hash / query-only changes). */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}
