export interface EfpStats {
    followers_count: string;
    following_count: string;
  }
  
  export async function getEfpStats(addressOrEns: string): Promise<EfpStats | null> {
    try {
      const response = await fetch(
        `https://api.ethfollow.xyz/api/v1/users/${addressOrEns}/stats`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          next: { revalidate: 300 }
        }
      );

      if (!response.ok) {
        return null;
      }

      const stats: EfpStats = await response.json();
      return stats;

    } catch {
      return null;
    }
  }