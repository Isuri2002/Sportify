import { getData, saveData } from '../utils/storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Fallback logic for accessing extra configuration
const extra = Constants.manifest?.extra || Constants.expoConfig?.extra || {};
const { sportsApi: SPORTS_API, dummyApi: DUMMY_API } = extra;

console.log('SPORTS_API:', SPORTS_API);

const USERS_KEY = 'REGISTERED_USERS';

export const loginUser = async (username, password) => {
  const users = (await getData(USERS_KEY)) || [];
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return { username: user.username, email: user.email, firstName: user.username };
  }
  throw new Error('Invalid credentials');
};

export const registerUser = async (username, email, password) => {
  try {
    let users = (await getData(USERS_KEY)) || [];
    if (users.find(u => u.username === username)) {
      throw new Error('Username already exists');
    }
    users.push({ username, email, password });
    await saveData(USERS_KEY, users);
    return { username, email, name: username };
  } catch (e) {
    console.error('RegisterUser error:', e);
    throw e;
  }
};

export const fetchItems = async () => {
  try {
    const res = await fetch(`${DUMMY_API}/products?limit=10`);
    const data = await res.json();
    // Map to your UI format if needed
    return (data.products || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.thumbnail,
      status: item.category || 'Active',
    }));
  } catch (e) {
    console.error('fetchItems error:', e);
    return [];
  }
};

export const fetchTeamDetails = async (teamId) => {
  try {
    const res = await fetch(`${SPORTS_API}/lookupteam.php?id=${teamId}`);
    const data = await res.json();
    return data.teams ? data.teams[0] : null;
  } catch (e) {
    console.error('fetchTeamDetails error:', e);
    return null;
  }
};

export const fetchPlayersByTeam = async (teamName) => {
  try {
    const res = await fetch(`${SPORTS_API}/searchplayers.php?t=${encodeURIComponent(teamName)}`);
    const data = await res.json();
    return data.player || [];
  } catch (e) {
    console.error('fetchPlayersByTeam error:', e);
    return [];
  }
};

export const fetchLeagueDetails = async (leagueId) => {
  try {
    const res = await fetch(`${SPORTS_API}/lookupleague.php?id=${leagueId}`);
    const data = await res.json();
    return {
      league: data.leagues ? data.leagues[0] : null,
      teams: [], // You can fetch teams separately if needed
    };
  } catch (e) {
    console.error('fetchLeagueDetails error:', e);
    return { league: null, teams: [] };
  }
};

export const searchTeams = async (teamName) => {
  try {
    const url = `${SPORTS_API}/searchteams.php?t=${encodeURIComponent(teamName)}`;
    console.log('searchTeams:', url);
    const res = await fetch(url);
    const data = await res.json();
    return data.teams || [];
  } catch (e) {
    console.error('searchTeams error:', e);
    return [];
  }
};

export const lookupPlayer = async (playerId) => {
  try {
    const url = `${SPORTS_API}/lookupplayer.php?id=${playerId}`;
    console.log('lookupPlayer:', url);
    const res = await fetch(url);
    const data = await res.json();
    return data.players ? data.players[0] : null;
  } catch (e) {
    console.error('lookupPlayer error:', e);
    return null;
  }
};

export const searchEvents = async (query) => {
  try {
    // Use the free API key and searchevents.php endpoint
    const url = `${SPORTS_API}/searchevents.php?e=${encodeURIComponent(query)}`;
    console.log('searchEvents:', url);
    const res = await fetch(url);
    const data = await res.json();
    return data.event || [];
  } catch (e) {
    console.error('searchEvents error:', e);
    return [];
  }
};
export const fetchAllEvents = async (leagueId) => {
  try {
    if (!SPORTS_API) {
      console.error('SPORTS_API is not defined. Check your .env configuration.');
      return [];
    }

    // First, get league details to get current season
    let seasonId = null;
    try {
      const leagueRes = await fetch(`${SPORTS_API}/lookupleague.php?id=${leagueId}`);
      const leagueContentType = leagueRes.headers.get('content-type');
      if (leagueContentType && leagueContentType.includes('application/json')) {
        const leagueData = await leagueRes.json();
        const league = leagueData.leagues ? leagueData.leagues[0] : null;
        if (league && league.strCurrentSeason) {
          seasonId = league.strCurrentSeason;
        }
      }
    } catch (leagueError) {
      console.error('fetchAllEvents error: Failed to fetch league data:', leagueError);
    }

    if (seasonId) {
      const url = `${SPORTS_API}/eventsseason.php?id=${seasonId}`;
      console.log('fetchAllEvents: seasonId =', seasonId, 'URL =', url);

      try {
        const res = await fetch(url);
        const contentType = res.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          console.log('API response data:', data); // Debug log
          let events = data.events;
          if (Array.isArray(events) && events.length > 0) {
            // Sort events by date
            events.sort((a, b) => new Date(a.dateEvent) - new Date(b.dateEvent));
            return events;
          }
        }
      } catch (seasonError) {
        console.error('fetchAllEvents error: Failed to fetch season events:', seasonError);
      }
    }

    // Fallback: fetch next and past events
    console.log('Falling back to next and past events');
    try {
      const [nextRes, pastRes] = await Promise.all([
        fetch(`${SPORTS_API}/eventsnextleague.php?id=${leagueId}`),
        fetch(`${SPORTS_API}/eventspastleague.php?id=${leagueId}`)
      ]);
      let nextEvents = [];
      let pastEvents = [];
      try {
        const nextData = await nextRes.json();
        nextEvents = Array.isArray(nextData.events) ? nextData.events : [];
      } catch (nextError) {
        console.error('fetchAllEvents error: Failed to parse next events JSON:', nextError);
      }
      try {
        const pastData = await pastRes.json();
        pastEvents = Array.isArray(pastData.events) ? pastData.events : [];
      } catch (pastError) {
        console.error('fetchAllEvents error: Failed to parse past events JSON:', pastError);
      }
      const events = [...pastEvents, ...nextEvents];
      // Sort events by date
      events.sort((a, b) => new Date(a.dateEvent) - new Date(b.dateEvent));
      return events;
    } catch (fallbackError) {
      console.error('fetchAllEvents error: Fallback network failed:', fallbackError);
      return [];
    }
  } catch (e) {
    console.error('fetchAllEvents error:', e);
    return [];
  }
};
