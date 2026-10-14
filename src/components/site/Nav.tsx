import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuIcon, XIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { BracketButton, Logo, ProtocolNavLink, StatusBar } from '@/components/ds';
import { profile } from '@/data/profile';
import { RoleLink, useRole } from '@/lib/role';
import { cn } from '@/lib/cn';
import { RoleMenu } from './RoleMenu';
import { RoleSwitcher } from './RoleSwitcher';

export const NAV_ITEMS = [
  { index: 1, label: 'Work', to: '/work', header: true },
  { index: 2, label: 'Experience', to: '/#experience', header: false },
  { index: 3, label: 'Playground', to: '/playground', header: true },
  { index: 4, label: 'Blog', to: '/blog', header: false },
  { index: 5, label: 'About', to: '/about', header: true },
];

const HEADER_ITEMS = NAV_ITEMS.filter((item) => item.header);

export function Nav() {
  const { pathname, hash } = useLocation();
  const { withRole } = useRole();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (to: string) => {
    if (to.startsWith('/#')) return pathname === '/' && hash === to.slice(1);
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  return (
    <header className="sticky top-0 z-40">
      <StatusBar
        status={profile.availability.status}
        statusLabel={profile.availability.label}
        showLatency={false}
        location={profile.locationShort}
        timeZone={profile.timeZone}
        timeZoneLabel={profile.timeZoneLabel}
      />
      <div
        className={cn(
          'border-b transition-all duration-300',
          scrolled ? 'border-border bg-background/85 backdrop-blur-md' : 'border-transparent bg-transparent',
        )}
      >
        <div className="container-site flex h-16 items-center justify-between gap-8">
          <Logo to={withRole('/')} compact />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {HEADER_ITEMS.map((item) => (
                <li key={item.to}>
                  <ProtocolNavLink
                    index={item.index}
                    label={item.label}
                    to={withRole(item.to)}
                    active={isActive(item.to)}
                    size="sm"
                    plain
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <RoleMenu />
            <BracketButton as={RoleLink} to="/contact" size="sm" variant="primary">
              Contact
            </BracketButton>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center border border-border text-ink-2 transition-colors hover:border-border-strong hover:text-ink lg:hidden"
          >
            {open ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full h-[calc(100dvh-6rem)] overflow-y-auto border-b border-border bg-background/95 backdrop-blur-lg lg:hidden"
          >
            <div className="container-site flex flex-col gap-8 py-8">
              <ul className="flex flex-col gap-3">
                {NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <ProtocolNavLink index={item.index} label={item.label} to={withRole(item.to)} active={isActive(item.to)} size="lg" />
                  </li>
                ))}
              </ul>
              <RoleSwitcher size="md" showHint />
              <BracketButton as={RoleLink} to="/contact" fullWidth>
                Contact
              </BracketButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
