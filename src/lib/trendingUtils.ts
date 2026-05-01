// Utility functions for trending topics and community stats

export interface TrendingTopic {
  tag: string;
  count: number;
}

// Extract hashtags from post content and count them
export function extractHashtags(content: string): string[] {
  const regex = /#\w+/g;
  const matches = content.match(regex) || [];
  return matches.map(tag => tag.toLowerCase());
}

// Calculate trending topics from posts
export function calculateTrendingTopics(posts: any[], limit: number = 5): TrendingTopic[] {
  const hashtagMap = new Map<string, number>();

  posts.forEach(post => {
    const tags = extractHashtags(post.content);
    tags.forEach(tag => {
      hashtagMap.set(tag, (hashtagMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(hashtagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Format large numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}
