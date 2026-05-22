import { Avatar } from './Avatar';

interface StackMember {
  userId: number;
  displayName: string;
  profilePhoto?: string | null;
}

type StackSize = 'xs' | 'sm';

interface AvatarStackProps {
  members: StackMember[];
  max?: number;
  size?: StackSize;
  className?: string;
}

const overflowSize: Record<StackSize, string> = {
  xs: 'w-6 h-6 text-[9px]',
  sm: 'w-8 h-8 text-xs',
};

export function AvatarStack({ members, max = 4, size = 'xs', className = '' }: AvatarStackProps) {
  const visible = members.slice(0, max);
  const overflow = members.length - visible.length;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visible.map((member) => (
        <Avatar
          key={member.userId}
          displayName={member.displayName}
          profilePhoto={member.profilePhoto}
          size={size}
          title={member.displayName}
          className="border-2 border-white"
        />
      ))}
      {overflow > 0 && (
        <div
          className={`${overflowSize[size]} rounded-full border-2 border-white bg-warmGray-200 flex items-center justify-center font-bold text-warmGray-600 shrink-0`}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
