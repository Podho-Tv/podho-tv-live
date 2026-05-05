import axios from 'axios';

export interface Channel {
  id: string;
  name: string;
  logo: string;
  url: string;
  category: string;
}

export async function fetchM3U(url: string): Promise<Channel[]> {
  try {
    const response = await axios.get(url);
    const content = response.data;
    return parseM3U(content);
  } catch (error) {
    console.error('Error fetching M3U:', error);
    return [];
  }
}

function parseM3U(content: string): Channel[] {
  const lines = content.split('\n');
  const channels: Channel[] = [];
  let currentChannel: Partial<Channel> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      // Parse metadata
      const nameMatch = line.match(/,(.*)$/);
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      const groupMatch = line.match(/group-title="([^"]*)"/);
      
      currentChannel.name = nameMatch ? nameMatch[1].trim() : 'Unknown Channel';
      currentChannel.logo = logoMatch ? logoMatch[1] : '';
      currentChannel.category = groupMatch ? groupMatch[1] : 'General';
      currentChannel.id = `${currentChannel.name}-${i}`;
    } else if (line.startsWith('http')) {
      // Parse URL
      currentChannel.url = line;
      if (currentChannel.name && currentChannel.url) {
        channels.push(currentChannel as Channel);
      }
      currentChannel = {};
    }
  }

  return channels;
}
