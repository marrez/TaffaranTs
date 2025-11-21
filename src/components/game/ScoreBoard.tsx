import { Player } from '@/types/game';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ScoreBoardProps {
  players: Player[];
  currentRound: number;
  totalRounds: number;
}

export const ScoreBoard = ({ players, currentRound, totalRounds }: ScoreBoardProps) => {
  const minScore = Math.min(...players.map(p => p.score));
  return (
    <Card className="p-4 bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Scoreboard</h3>
        <span className="text-sm text-muted-foreground">
          Round {currentRound} / {totalRounds}
        </span>
      </div>

      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg',
              'bg-secondary/50 transition-all duration-300',
              player.isDeclarer && 'bg-primary/20 border-2 border-primary'
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn(
                'font-semibold',
                player.isDeclarer && 'text-primary'
              )}>
                {player.name}
              </span>
              {player.isDeclarer && (
                <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full">
                  Declarer
                </span>
              )}
              {player.score === minScore && minScore !== 0 && (
                <span className="text-lg">🐑</span>
              )}
            </div>
            <span className={cn(
              'text-lg font-bold',
              player.score > 0 && 'text-accent',
              player.score < 0 && 'text-destructive',
              player.score === 0 && 'text-muted-foreground'
            )}>
              {player.score > 0 ? '+' : ''}{player.score}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
