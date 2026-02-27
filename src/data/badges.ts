export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    tier: 'bronze' | 'silver' | 'gold';
    unlocked: boolean;
    unlockedAt?: string;
    requirement: string;
}

export interface LeaderboardEntry {
    rank: number;
    name: string;
    avatar: string;
    xp: number;
    level: number;
    streak: number;
    badges: number;
    isCurrentUser?: boolean;
}

export const badges: Badge[] = [
    { id: 'b1', name: 'First Steps', description: 'Complete your first lesson', icon: 'footprints', tier: 'bronze', unlocked: true, unlockedAt: '2026-02-20', requirement: '1 lesson completed' },
    { id: 'b2', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: 'flame', tier: 'bronze', unlocked: true, unlockedAt: '2026-02-25', requirement: '7-day streak' },
    { id: 'b3', name: 'Quick Learner', description: 'Complete 10 lessons', icon: 'zap', tier: 'silver', unlocked: true, unlockedAt: '2026-02-26', requirement: '10 lessons completed' },
    { id: 'b4', name: 'Course Champion', description: 'Complete your first course', icon: 'trophy', tier: 'gold', unlocked: false, requirement: '1 course completed' },
    { id: 'b5', name: 'Knowledge Seeker', description: 'Complete 50 lessons', icon: 'book-open', tier: 'silver', unlocked: false, requirement: '50 lessons completed' },
    { id: 'b6', name: 'Quiz Master', description: 'Score 100% on 5 quizzes', icon: 'target', tier: 'gold', unlocked: false, requirement: '5 perfect quizzes' },
    { id: 'b7', name: 'Accessibility Advocate', description: 'Try all 8 accessibility themes', icon: 'accessibility', tier: 'silver', unlocked: true, unlockedAt: '2026-02-27', requirement: 'Try all themes' },
    { id: 'b8', name: 'Voice Pioneer', description: 'Use 10 voice commands', icon: 'mic', tier: 'bronze', unlocked: false, requirement: '10 voice commands' },
    { id: 'b9', name: 'Unstoppable', description: 'Maintain a 30-day streak', icon: 'gem', tier: 'gold', unlocked: false, requirement: '30-day streak' },
    { id: 'b10', name: 'Century Club', description: 'Earn 10,000 XP', icon: 'star', tier: 'gold', unlocked: false, requirement: '10,000 XP' },
];

export const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, name: 'Ananya Sharma', avatar: 'user', xp: 15240, level: 24, streak: 45, badges: 8 },
    { rank: 2, name: 'Carlos Mendez', avatar: 'graduation-cap', xp: 14100, level: 22, streak: 38, badges: 7 },
    { rank: 3, name: 'Yuki Tanaka', avatar: 'flask', xp: 12800, level: 20, streak: 33, badges: 7 },
    { rank: 4, name: 'Fatima Al-Rashid', avatar: 'book-open', xp: 11500, level: 18, streak: 28, badges: 6 },
    { rank: 5, name: 'David Okoye', avatar: 'briefcase', xp: 10200, level: 16, streak: 25, badges: 5 },
    { rank: 6, name: 'Harshith Kumar', avatar: 'user', xp: 8750, level: 14, streak: 12, badges: 4, isCurrentUser: true },
    { rank: 7, name: 'Emma Wilson', avatar: 'palette', xp: 7900, level: 13, streak: 19, badges: 4 },
    { rank: 8, name: 'Ravi Patel', avatar: 'wrench', xp: 6800, level: 11, streak: 15, badges: 3 },
    { rank: 9, name: 'Sophie Laurent', avatar: 'stethoscope', xp: 5600, level: 9, streak: 10, badges: 3 },
    { rank: 10, name: 'Jin Wei', avatar: 'graduation-cap', xp: 4200, level: 7, streak: 8, badges: 2 },
];

export function getLevelFromXP(xp: number): { level: number; currentXP: number; nextLevelXP: number } {
    const level = Math.floor(xp / 500) + 1;
    const currentXP = xp % 500;
    const nextLevelXP = 500;
    return { level, currentXP, nextLevelXP };
}
