import { SegmentedToggle, Tooltip } from '@/components/ds';
import { ROLE_OPTIONS, type RoleKey } from '@/data/roles';
import { useRole } from '@/lib/role';
import { cn } from '@/lib/cn';

interface RoleSwitcherProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showHint?: boolean;
}

/**
 * Lets a visitor re-weight the portfolio toward a discipline.
 * Mirrors the `?type=` query parameter so the URL stays shareable.
 */
export function RoleSwitcher({ size = 'sm', className, showHint = false }: RoleSwitcherProps) {
  const { role, setRole } = useRole();
  return (
    <div className={cn('flex flex-col items-start gap-2', className)}>
      {showHint && (
        <span className="label-mono flex items-center gap-2">
          <span className="text-ember">◆</span> Lens
          <Tooltip content="Re-weights copy, bullets and projects. Shareable via ?type=" side="top" preserveCase>
            <button type="button" className="rounded-sm border border-border px-1 font-mono text-[9px] text-ink-3 hover:text-ink">
              ?
            </button>
          </Tooltip>
        </span>
      )}
      <SegmentedToggle<RoleKey> options={ROLE_OPTIONS} value={role} onChange={setRole} size={size} aria-label="Portfolio lens" showIcons={false} />
    </div>
  );
}
