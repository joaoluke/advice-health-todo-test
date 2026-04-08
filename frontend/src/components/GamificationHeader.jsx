import React from 'react';
import { Trophy, Star } from 'lucide-react';

const GamificationHeader = ({ profile }) => {
  if (!profile) return null;

  const xpRequiredForNextLevel = profile.level * 100;
  const currentLevelXp = profile.xp % 100;
  const progressPercent = Math.min(((profile.xp % 100) / 100) * 100, 100);

  return (
    <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 px-4 py-2 border border-purple-500/20">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
          <Trophy size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Lvl {profile.level}
          </span>
          <span className="text-sm font-medium text-foreground">
            XP: {profile.xp}
          </span>
        </div>
      </div>

      <div className="flex w-32 flex-col gap-1 md:w-48">
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{profile.xp} XP</span>
          <span>Next Level</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default GamificationHeader;
