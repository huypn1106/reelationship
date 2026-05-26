import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Mock Users
const MOCK_USERS = {
  'user-huy': {
    uid: 'user-huy',
    username: 'huy',
    displayName: 'Huy (You)',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face',
    createdAt: new Date().toISOString()
  },
  'user-minh': {
    uid: 'user-minh',
    username: 'minh',
    displayName: 'Minh',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    createdAt: new Date().toISOString()
  },
  'user-tuan': {
    uid: 'user-tuan',
    username: 'tuan',
    displayName: 'Tuan',
    photoURL: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=face',
    createdAt: new Date().toISOString()
  },
  'user-hang': {
    uid: 'user-hang',
    username: 'hang',
    displayName: 'Hang',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    createdAt: new Date().toISOString()
  }
};

// Initial Mock Videos
const INITIAL_VIDEOS = {
  'room-datenight': [
    {
      id: 'vid-cooking-1',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'youtube',
      title: 'How to make the ultimate 2AM Carbonara (No cream allowed!) 🍝',
      thumbnail: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=640&h=360&fit=crop',
      addedBy: 'user-minh',
      tags: ['cooking', 'pasta', 'chaos'],
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2h ago
      reactions: {
        'user-minh': '❤️',
        'user-huy': '😂',
        'user-tuan': '💀'
      },
      comments: [
        { id: 'c1', uid: 'user-minh', text: 'we should make this next Friday!', createdAt: new Date(Date.now() - 3600000 * 1.8).toISOString() },
        { id: 'c2', uid: 'user-huy', text: 'bro we both know we will order McDonald\'s at 2am instead', createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString() }
      ],
      notes: [
        { id: 'n1', uid: 'user-minh', text: 'watch @huy at 0:32 for the cheese flip fail! 😂', timestampSeconds: 32, isShared: true, mentions: ['user-huy'], createdAt: new Date(Date.now() - 3600000 * 1.7).toISOString() }
      ]
    },
    {
      id: 'vid-meme-1',
      url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      platform: 'instagram',
      title: 'POV: You are pushing a small UI fix to production on a Friday afternoon 🫠',
      thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=640&h=360&fit=crop',
      addedBy: 'user-tuan',
      tags: ['memes', 'programming', 'chaos'],
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(), // 8h ago
      reactions: {
        'user-huy': '💀',
        'user-tuan': '💀',
        'user-hang': '😂'
      },
      comments: [
        { id: 'c3', uid: 'user-tuan', text: 'Literally our deployment yesterday.', createdAt: new Date(Date.now() - 3600000 * 7.5).toISOString() }
      ],
      notes: []
    },
    {
      id: 'vid-travel-1',
      url: 'https://www.youtube.com/watch?v=F-eMt3GrOEs',
      platform: 'tiktok',
      title: 'Cottages in Switzerland that don\'t feel real 🇨🇭🏔️',
      thumbnail: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=640&h=360&fit=crop',
      addedBy: 'user-hang',
      tags: ['travel', 'relaxing', 'nature'],
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      reactions: {
        'user-minh': '❤️',
        'user-hang': '❤️'
      },
      comments: [],
      notes: []
    },
    {
      id: 'vid-sensitive-1',
      url: 'https://www.youtube.com/watch?v=28hYUZ1L-v4',
      platform: 'x',
      title: '⚠️ EXTREME SPICY RAMEN CHALLENGE — EATING 10x GHOST PEPPER NOODLES',
      thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=640&h=360&fit=crop',
      addedBy: 'user-tuan',
      tags: ['food', 'ramen', 'challenge', 'sensitive'],
      createdAt: new Date(Date.now() - 3600000 * 32).toISOString(),
      reactions: {
        'user-minh': '😂'
      },
      comments: [],
      notes: [],
      isSensitive: true
    }
  ],
  'room-cursed': [
    {
      id: 'vid-cursed-1',
      url: 'https://www.youtube.com/watch?v=tPEE9ZwTmy0',
      platform: 'youtube',
      title: 'Deep fried water tutorial... yes, you read that right.',
      thumbnail: 'https://images.unsplash.com/photo-1547928710-19a45145777b?w=640&h=360&fit=crop',
      addedBy: 'user-tuan',
      tags: ['cursed', 'cooking', 'memes'],
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      reactions: {
        'user-huy': '💀',
        'user-tuan': '💀'
      },
      comments: [
        { id: 'c4', uid: 'user-huy', text: 'Why does this exist.', createdAt: new Date(Date.now() - 3600000 * 23).toISOString() }
      ],
      notes: []
    }
  ],
  'room-food': []
};

// Initial Mock Collections
const INITIAL_COLLECTIONS = {
  'room-datenight': [
    {
      id: 'coll-cravings',
      name: 'Midnight Cravings 🍕',
      createdBy: 'user-minh',
      videoIds: ['vid-cooking-1', 'vid-sensitive-1'],
      permission: 'public',
      allowedUids: [],
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
    },
    {
      id: 'coll-programming',
      name: 'Code-induced Panic 💻',
      createdBy: 'user-tuan',
      videoIds: ['vid-meme-1'],
      permission: 'members',
      allowedUids: ['user-huy', 'user-tuan', 'user-minh'],
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'coll-private-huy',
      name: 'Huy\'s Secret Stash 🤫',
      createdBy: 'user-huy',
      videoIds: ['vid-cooking-1'],
      permission: 'private',
      allowedUids: [],
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ]
};

// Initial Mock Queues
const INITIAL_QUEUE = {
  'room-datenight': [
    {
      id: 'q-item-1',
      videoId: 'vid-cooking-1',
      title: 'Ultimate Carbonara recipe',
      addedBy: 'user-minh',
      votes: ['user-minh', 'user-huy'],
      addedAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'q-item-2',
      videoId: 'vid-travel-1',
      title: 'Switzerland Cottages Tour',
      addedBy: 'user-hang',
      votes: ['user-hang'],
      addedAt: new Date(Date.now() - 1800000).toISOString()
    }
  ]
};

// Initial Mock Rooms
const INITIAL_ROOMS = [
  {
    id: 'room-datenight',
    name: 'Date Night Dumps 🎬',
    createdBy: 'user-huy',
    members: ['user-huy', 'user-minh', 'user-tuan', 'user-hang'],
    admins: ['user-huy', 'user-minh'],
    inviteCode: 'LOVE-47-REELS',
    maxPermission: 'public',
    createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    unread: true
  },
  {
    id: 'room-cursed',
    name: 'Cursed Content 💀',
    createdBy: 'user-tuan',
    members: ['user-huy', 'user-tuan', 'user-hang'],
    admins: ['user-tuan'],
    inviteCode: 'CURSED-VOID',
    maxPermission: 'sensitive',
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    unread: false
  },
  {
    id: 'room-food',
    name: 'Food Gang 🍕',
    createdBy: 'user-minh',
    members: ['user-huy', 'user-minh', 'user-tuan'],
    admins: ['user-minh'],
    inviteCode: 'CHEESE-PULL',
    maxPermission: 'public',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    unread: false
  }
];

export const AppProvider = ({ children }) => {
  // Load state from local storage or fall back to mock
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('rr_current_user');
    return saved ? JSON.parse(saved) : MOCK_USERS['user-huy'];
  });

  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('rr_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('rr_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [collections, setCollections] = useState(() => {
    const saved = localStorage.getItem('rr_collections');
    return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
  });

  const [queues, setQueues] = useState(() => {
    const saved = localStorage.getItem('rr_queues');
    return saved ? JSON.parse(saved) : INITIAL_QUEUE;
  });

  const [activeRoomId, setActiveRoomId] = useState('room-datenight');

  // Watch Together Sync Session state
  const [watchSession, setWatchSession] = useState({
    roomId: null,
    videoId: null,
    isPlaying: false,
    currentTime: 0,
    hostUid: null,
    updatedAt: Date.now()
  });

  const [floatingReactions, setFloatingReactions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Save states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('rr_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('rr_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('rr_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('rr_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('rr_queues', JSON.stringify(queues));
  }, [queues]);

  // Switch identity
  const switchUser = (userId) => {
    if (MOCK_USERS[userId]) {
      setCurrentUser(MOCK_USERS[userId]);
    }
  };

  // Add video link
  const addVideo = (roomId, url, customTitle = '') => {
    let platform = 'youtube';
    if (url.includes('instagram.com')) platform = 'instagram';
    else if (url.includes('tiktok.com')) platform = 'tiktok';
    else if (url.includes('twitter.com') || url.includes('x.com')) platform = 'x';

    // Simple parser for video preview details
    const parsedId = url.split('v=')[1]?.split('&')[0] || Math.random().toString(36).substring(7);
    const title = customTitle || `Awesome ${platform} clip shared by @${currentUser.username}`;
    
    // Extracted tags
    const tags = ['chaos'];
    if (title.toLowerCase().includes('cook') || title.toLowerCase().includes('food') || title.toLowerCase().includes('carbonara')) {
      tags.push('cooking');
    }
    if (title.toLowerCase().includes('meme') || title.toLowerCase().includes('code') || title.toLowerCase().includes('friday')) {
      tags.push('memes');
    }
    if (title.toLowerCase().includes('travel') || title.toLowerCase().includes('swiss')) {
      tags.push('travel');
    }
    if (url.includes('sensitive') || title.toLowerCase().includes('sensitive') || title.toLowerCase().includes('spicy')) {
      tags.push('sensitive');
    }

    const newVideo = {
      id: `vid-${Date.now()}`,
      url,
      platform,
      title,
      thumbnail: `https://images.unsplash.com/photo-${1600000000000 + Math.floor(Math.random() * 500000)}?w=640&h=360&fit=crop`,
      addedBy: currentUser.uid,
      tags,
      createdAt: new Date().toISOString(),
      reactions: {},
      comments: [],
      notes: [],
      isSensitive: tags.includes('sensitive')
    };

    setVideos(prev => {
      const roomVids = prev[roomId] || [];
      const updated = {
        ...prev,
        [roomId]: [newVideo, ...roomVids]
      };
      return updated;
    });

    // Add notification to others in the room
    const currentRoom = rooms.find(r => r.id === roomId);
    if (currentRoom) {
      currentRoom.members.forEach(memberId => {
        if (memberId !== currentUser.uid) {
          addNotification({
            id: `notif-${Date.now()}-${memberId}`,
            type: 'mention',
            fromUid: currentUser.uid,
            roomId,
            videoId: newVideo.id,
            seen: false,
            message: `@${currentUser.username} shared a new video: "${title}"`,
            createdAt: new Date().toISOString()
          });
        }
      });
    }

    return newVideo;
  };

  // Add Comment
  const addComment = (roomId, videoId, text) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      uid: currentUser.uid,
      text,
      createdAt: new Date().toISOString()
    };

    setVideos(prev => {
      const roomVids = prev[roomId] || [];
      const updatedVids = roomVids.map(vid => {
        if (vid.id === videoId) {
          return {
            ...vid,
            comments: [...vid.comments, newComment]
          };
        }
        return vid;
      });
      return { ...prev, [roomId]: updatedVids };
    });
  };

  // Add Note with Clickable Timestamp and Private status
  const addNote = (roomId, videoId, text, timestampSeconds, isShared) => {
    // Parse @mentions
    const mentions = [];
    Object.keys(MOCK_USERS).forEach(uid => {
      const username = MOCK_USERS[uid].username;
      if (text.includes(`@${username}`)) {
        mentions.push(uid);
      }
    });

    const newNote = {
      id: `note-${Date.now()}`,
      uid: currentUser.uid,
      text,
      timestampSeconds: timestampSeconds || null,
      isShared: isShared ?? true,
      mentions,
      createdAt: new Date().toISOString()
    };

    setVideos(prev => {
      const roomVids = prev[roomId] || [];
      const updatedVids = roomVids.map(vid => {
        if (vid.id === videoId) {
          return {
            ...vid,
            notes: [...(vid.notes || []), newNote]
          };
        }
        return vid;
      });
      return { ...prev, [roomId]: updatedVids };
    });
  };

  // Toggle Reaction Emoji (pills wiggle on select)
  const toggleReaction = (roomId, videoId, emoji) => {
    setVideos(prev => {
      const roomVids = prev[roomId] || [];
      const updatedVids = roomVids.map(vid => {
        if (vid.id === videoId) {
          const userReactions = { ...vid.reactions };
          if (userReactions[currentUser.uid] === emoji) {
            delete userReactions[currentUser.uid];
          } else {
            userReactions[currentUser.uid] = emoji;
          }
          return { ...vid, reactions: userReactions };
        }
        return vid;
      });
      return { ...prev, [roomId]: updatedVids };
    });
  };

  // Create Collection
  const createCollection = (roomId, name, permission = 'public', videoIds = [], allowedUids = []) => {
    const newColl = {
      id: `coll-${Date.now()}`,
      name,
      createdBy: currentUser.uid,
      videoIds,
      permission,
      allowedUids: permission === 'members' ? [currentUser.uid, ...allowedUids] : [],
      createdAt: new Date().toISOString()
    };

    setCollections(prev => {
      const roomColls = prev[roomId] || [];
      return {
        ...prev,
        [roomId]: [...roomColls, newColl]
      };
    });
    return newColl;
  };

  // Add/Remove video from collection
  const toggleVideoInCollection = (roomId, collectionId, videoId) => {
    setCollections(prev => {
      const roomColls = prev[roomId] || [];
      const updated = roomColls.map(coll => {
        if (coll.id === collectionId) {
          const exists = coll.videoIds.includes(videoId);
          const nextVids = exists
            ? coll.videoIds.filter(id => id !== videoId)
            : [...coll.videoIds, videoId];
          return { ...coll, videoIds: nextVids };
        }
        return coll;
      });
      return { ...prev, [roomId]: updated };
    });
  };

  // Create new Room
  const createRoom = (roomName, emojiPrefix = '🎬') => {
    const inviteCode = `${roomName.toUpperCase().replace(/\s+/g, '-')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRoom = {
      id: `room-${Date.now()}`,
      name: `${emojiPrefix} ${roomName}`,
      createdBy: currentUser.uid,
      members: [currentUser.uid, 'user-minh', 'user-tuan'], // Auto add standard chaos members for visual fun
      admins: [currentUser.uid],
      inviteCode,
      maxPermission: 'public',
      createdAt: new Date().toISOString(),
      unread: false
    };

    setRooms(prev => [...prev, newRoom]);
    setVideos(prev => ({ ...prev, [newRoom.id]: [] }));
    setCollections(prev => ({ ...prev, [newRoom.id]: [] }));
    setQueues(prev => ({ ...prev, [newRoom.id]: [] }));
    setActiveRoomId(newRoom.id);
    return newRoom;
  };

  // Join Room by code
  const joinRoom = (inviteCode) => {
    const roomToJoin = rooms.find(r => r.inviteCode === inviteCode || r.inviteCode.toLowerCase() === inviteCode.toLowerCase());
    if (!roomToJoin) return null;

    if (roomToJoin.members.includes(currentUser.uid)) {
      setActiveRoomId(roomToJoin.id);
      return roomToJoin;
    }

    setRooms(prev => prev.map(r => {
      if (r.id === roomToJoin.id) {
        return {
          ...r,
          members: [...r.members, currentUser.uid]
        };
      }
      return r;
    }));

    setActiveRoomId(roomToJoin.id);
    return roomToJoin;
  };

  // Manage Queue: Add to queue
  const addToQueue = (roomId, videoId, videoTitle) => {
    const newQueueItem = {
      id: `q-item-${Date.now()}`,
      videoId,
      title: videoTitle,
      addedBy: currentUser.uid,
      votes: [currentUser.uid],
      addedAt: new Date().toISOString()
    };

    setQueues(prev => {
      const roomQueue = prev[roomId] || [];
      if (roomQueue.some(item => item.videoId === videoId)) return prev;
      return {
        ...prev,
        [roomId]: [...roomQueue, newQueueItem]
      };
    });
  };

  // Upvote Queue Item
  const toggleQueueVote = (roomId, queueItemId) => {
    setQueues(prev => {
      const roomQueue = prev[roomId] || [];
      const updated = roomQueue.map(item => {
        if (item.id === queueItemId) {
          const hasVoted = item.votes.includes(currentUser.uid);
          const nextVotes = hasVoted
            ? item.votes.filter(uid => uid !== currentUser.uid)
            : [...item.votes, currentUser.uid];
          return { ...item, votes: nextVotes };
        }
        return item;
      });
      return { ...prev, [roomId]: updated };
    });
  };

  // Trigger next in Queue
  const popQueue = (roomId) => {
    setQueues(prev => {
      const roomQueue = prev[roomId] || [];
      if (roomQueue.length === 0) return prev;
      // Sort: highest votes first
      const sorted = [...roomQueue].sort((a, b) => b.votes.length - a.votes.length || new Date(a.addedAt) - new Date(b.addedAt));
      const nextUp = sorted[0];
      const remaining = roomQueue.filter(item => item.id !== nextUp.id);
      return {
        ...prev,
        [roomId]: remaining
      };
    });
  };

  // Floating reactions TTL cleaner for Watch Together overlay
  useEffect(() => {
    if (floatingReactions.length === 0) return;
    const interval = setInterval(() => {
      setFloatingReactions(prev => prev.filter(r => r.expiresAt > Date.now()));
    }, 100);
    return () => clearInterval(interval);
  }, [floatingReactions]);

  // Send Floating Reaction (Watch Together)
  const sendWatchReaction = (emoji) => {
    const newReaction = {
      id: `float-${Math.random()}`,
      emoji,
      xOffset: Math.floor(Math.random() * 80) + 10, // 10% to 90% wide
      expiresAt: Date.now() + 1200 // 1.2s TTL
    };
    setFloatingReactions(prev => [...prev, newReaction]);
  };

  // Start Watch Together Session
  const startWatchTogether = (roomId, videoId) => {
    setWatchSession({
      roomId,
      videoId,
      isPlaying: true,
      currentTime: 0,
      hostUid: currentUser.uid,
      updatedAt: Date.now()
    });

    // Simulate other users sending emoji pulses on session start
    setTimeout(() => {
      sendWatchReaction('🍿');
    }, 300);
    setTimeout(() => {
      sendWatchReaction('👋');
    }, 600);
  };

  const endWatchTogether = () => {
    setWatchSession({
      roomId: null,
      videoId: null,
      isPlaying: false,
      currentTime: 0,
      hostUid: null,
      updatedAt: Date.now()
    });
  };

  // Notifications
  const addNotification = (notif) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const markAllNotificationsSeen = () => {
    setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
  };

  // AI Taste Match Calculator
  const getTasteMatchScore = (otherUserId) => {
    const roomVids = videos[activeRoomId] || [];
    if (roomVids.length === 0) return 47; // Default fun number

    // Collect tags shared by current user vs other user
    const currentTags = [];
    const otherTags = [];

    roomVids.forEach(v => {
      if (v.addedBy === currentUser.uid) {
        currentTags.push(...v.tags);
      }
      if (v.addedBy === otherUserId) {
        otherTags.push(...v.tags);
      }
    });

    if (currentTags.length === 0 || otherTags.length === 0) {
      // Deterministic fun scores based on names if no shared videos yet
      const hash = (currentUser.uid + otherUserId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return (hash % 60) + 35; // 35% to 95%
    }

    // Vector mapping
    const allTags = Array.from(new Set([...currentTags, ...otherTags]));
    const currentVec = allTags.map(tag => currentTags.filter(t => t === tag).length);
    const otherVec = allTags.map(tag => otherTags.filter(t => t === tag).length);

    // Cosine similarity
    const dotProduct = currentVec.reduce((sum, val, idx) => sum + val * otherVec[idx], 0);
    const magnitude1 = Math.sqrt(currentVec.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(otherVec.reduce((sum, val) => sum + val * val, 0));

    if (magnitude1 === 0 || magnitude2 === 0) return 50;
    const score = Math.round((dotProduct / (magnitude1 * magnitude2)) * 100);
    return Math.max(10, Math.min(100, score));
  };

  return (
    <AppContext.Provider value={{
      MOCK_USERS,
      currentUser,
      switchUser,
      rooms,
      activeRoomId,
      setActiveRoomId,
      videos: videos[activeRoomId] || [],
      allVideosState: videos, // raw videos
      addVideo,
      addComment,
      addNote,
      toggleReaction,
      collections: collections[activeRoomId] || [],
      createCollection,
      toggleVideoInCollection,
      createRoom,
      joinRoom,
      queue: queues[activeRoomId] || [],
      addToQueue,
      toggleQueueVote,
      popQueue,
      watchSession,
      startWatchTogether,
      endWatchTogether,
      setWatchSession,
      floatingReactions,
      sendWatchReaction,
      notifications,
      markAllNotificationsSeen,
      getTasteMatchScore
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
