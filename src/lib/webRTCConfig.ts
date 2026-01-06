export const getMeteredICEServers = async () => {
  try {
    // Option 1: Sử dụng API key trực tiếp (đơn giản hơn)
    const response = await fetch(
      `https://jobpilot.metered.live/api/v1/turn/credentials?apiKey=${process.env.NEXT_PUBLIC_METERED_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to get TURN credentials');
    }
    
    const iceServers = await response.json();
    return iceServers;
    
  } catch (error) {
    console.error('Error fetching TURN servers:', error);
    
    // Fallback to public STUN servers
    return [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ];
  }
};