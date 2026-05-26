import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  isFirebaseConfigured, db, rtdb 
} from '../firebase';
import { 
  collection, doc, onSnapshot, addDoc, updateDoc, setDoc, getDocs, query, where, arrayUnion
} from 'firebase/firestore';
import { 
  ref, onValue, set as rtdbSet, push as rtdbPush, remove as rtdbRemove
} from 'firebase/database';

const AppContext = createContext();

// Simulated standard user profiles
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

// Initial Seed Fallback Data (used when Firebase is NOT configured yet)
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
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      reactions: { 'user-minh': '❤️', 'user-huy': '😂', 'user-tuan': '💀' },
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
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      reactions: { 'user-huy': '💀', 'user-tuan': '💀', 'user-hang': '😂' },
      comments: [{ id: 'c3', uid: 'user-tuan', text: 'Literally our deployment yesterday.', createdAt: new Date(Date.now() - 3600000 * 7.5).toISOString() }],
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
      reactions: { 'user-minh': '❤️', 'user-hang': '❤️' },
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
      reactions: { 'user-minh': '😂' },
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
      reactions: { 'user-huy': '💀', 'user-tuan': '💀' },
      comments: [{ id: 'c4', uid: 'user-huy', text: 'Why does this exist.', createdAt: new Date(Date.now() - 3600000 * 23).toISOString() }],
      notes: []
    }
  ],
  'room-food': []
};

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
  // Identity state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('rr_current_user');
    return saved ? JSON.parse(saved) : MOCK_USERS['user-huy'];
  });

  const [activeRoomId, setActiveRoomId] = useState('room-datenight');

  // Unified lists
  const [rooms, setRooms] = useState([]);
  const [videos, setVideos] = useState([]);
  const [collections, setCollections] = useState([]);
  const [queue, setQueue] = useState([]);

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

  // Persistence for user
  useEffect(() => {
    localStorage.setItem('rr_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // ==========================================
  // REAL-TIME SYNCRONIZATION ROUTER
  // ==========================================
  useEffect(() => {
    if (!isFirebaseConfigured) {
      // 💡 LOCAL MOCK ENGINE fallback
      const savedRooms = localStorage.getItem('rr_rooms');
      const savedVideos = localStorage.getItem('rr_videos');
      const savedCollections = localStorage.getItem('rr_collections');
      const savedQueues = localStorage.getItem('rr_queues');

      const parsedRooms = savedRooms ? JSON.parse(savedRooms) : INITIAL_ROOMS;
      const parsedVideos = savedVideos ? JSON.parse(savedVideos) : INITIAL_VIDEOS;
      const parsedColls = savedCollections ? JSON.parse(savedCollections) : INITIAL_COLLECTIONS;
      const parsedQueues = savedQueues ? JSON.parse(savedQueues) : INITIAL_QUEUE;

      setRooms(parsedRooms);
      setVideos(parsedVideos[activeRoomId] || []);
      setCollections(parsedColls[activeRoomId] || []);
      setQueue(parsedQueues[activeRoomId] || []);
      return;
    }

    // 🔥 REAL-TIME FIREBASE DATABASE SYNCRONIZATION
    console.log('🔥 Connecting real-time streams to Firebase Server...');

    // 1. Listen to Rooms
    const unsubscribeRooms = onSnapshot(collection(db, 'rooms'), (snapshot) => {
      const list = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setRooms(list.length > 0 ? list : INITIAL_ROOMS);
    }, (error) => console.error("Firestore rooms stream error:", error));

    // 2. Listen to Videos of Active Room
    const unsubscribeVideos = onSnapshot(collection(db, 'rooms', activeRoomId, 'videos'), (snapshot) => {
      const list = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setVideos(list);
    }, (error) => console.error("Firestore videos stream error:", error));

    // 3. Listen to Collections of Active Room
    const unsubscribeColls = onSnapshot(collection(db, 'rooms', activeRoomId, 'collections'), (snapshot) => {
      const list = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setCollections(list);
    }, (error) => console.error("Firestore collections stream error:", error));

    // 4. Listen to Queue of Active Room
    const unsubscribeQueue = onSnapshot(collection(db, 'rooms', activeRoomId, 'queue'), (snapshot) => {
      const list = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setQueue(list);
    }, (error) => console.error("Firestore queue stream error:", error));

    // 5. Listen to Watch Sessions (Realtime DB)
    const watchRef = ref(rtdb, `watchSessions/${activeRoomId}`);
    const unsubscribeWatch = onValue(watchRef, (snapshot) => {
      if (snapshot.exists()) {
        setWatchSession(snapshot.val());
      } else {
        setWatchSession({
          roomId: null,
          videoId: null,
          isPlaying: false,
          currentTime: 0,
          hostUid: null,
          updatedAt: Date.now()
        });
      }
    });

    return () => {
      unsubscribeRooms();
      unsubscribeVideos();
      unsubscribeColls();
      unsubscribeQueue();
      unsubscribeWatch();
    };
  }, [activeRoomId]);

  // Switch identity
  const switchUser = (userId) => {
    if (MOCK_USERS[userId]) {
      setCurrentUser(MOCK_USERS[userId]);
    }
  };

  // Add video link
  const addVideo = async (roomId, url, customTitle = '') => {
    let platform = 'youtube';
    if (url.includes('instagram.com')) platform = 'instagram';
    else if (url.includes('tiktok.com')) platform = 'tiktok';
    else if (url.includes('twitter.com') || url.includes('x.com')) platform = 'x';

    const title = customTitle || `Awesome ${platform} clip shared by @${currentUser.username}`;
    
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

    if (isFirebaseConfigured) {
      try {
        await addDoc(collection(db, 'rooms', roomId, 'videos'), newVideo);
      } catch (err) {
        console.error("Firebase write video error:", err);
      }
    } else {
      // Local Storage Write
      const savedVideos = JSON.parse(localStorage.getItem('rr_videos') || '{}');
      const roomVids = savedVideos[roomId] || [];
      const withNew = [{ id: `vid-${Date.now()}`, ...newVideo }, ...roomVids];
      savedVideos[roomId] = withNew;
      localStorage.setItem('rr_videos', JSON.stringify(savedVideos));
      setVideos(withNew);
    }

    // Send mock notification alert
    addNotification({
      id: `notif-${Date.now()}`,
      type: 'mention',
      fromUid: currentUser.uid,
      roomId,
      videoId: `vid-${Date.now()}`,
      seen: false,
      message: `@${currentUser.username} shared a new video: "${title}"`,
      createdAt: new Date().toISOString()
    });
  };

  // Add Comment
  const addComment = async (roomId, videoId, text) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      uid: currentUser.uid,
      text,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured) {
      try {
        const vidRef = doc(db, 'rooms', roomId, 'videos', videoId);
        await updateDoc(vidRef, {
          comments: arrayUnion(newComment)
        });
      } catch (err) {
        console.error("Firebase add comment error:", err);
      }
    } else {
      const savedVideos = JSON.parse(localStorage.getItem('rr_videos') || '{}');
      const roomVids = savedVideos[roomId] || [];
      const updated = roomVids.map(v => {
        if (v.id === videoId) {
          return { ...v, comments: [...(v.comments || []), newComment] };
        }
        return v;
      });
      savedVideos[roomId] = updated;
      localStorage.setItem('rr_videos', JSON.stringify(savedVideos));
      setVideos(updated);
    }
  };

  // Add Note with Clickable Timestamp and Private status
  const addNote = async (roomId, videoId, text, timestampSeconds, isShared) => {
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

    if (isFirebaseConfigured) {
      try {
        const vidRef = doc(db, 'rooms', roomId, 'videos', videoId);
        await updateDoc(vidRef, {
          notes: arrayUnion(newNote)
        });
      } catch (err) {
        console.error("Firebase add note error:", err);
      }
    } else {
      const savedVideos = JSON.parse(localStorage.getItem('rr_videos') || '{}');
      const roomVids = savedVideos[roomId] || [];
      const updated = roomVids.map(v => {
        if (v.id === videoId) {
          return { ...v, notes: [...(v.notes || []), newNote] };
        }
        return v;
      });
      savedVideos[roomId] = updated;
      localStorage.setItem('rr_videos', JSON.stringify(savedVideos));
      setVideos(updated);
    }
  };

  // Toggle Reaction Emoji
  const toggleReaction = async (roomId, videoId, emoji) => {
    const activeVideo = videos.find(v => v.id === videoId);
    if (!activeVideo) return;

    const userReactions = { ...(activeVideo.reactions || {}) };
    if (userReactions[currentUser.uid] === emoji) {
      delete userReactions[currentUser.uid];
    } else {
      userReactions[currentUser.uid] = emoji;
    }

    if (isFirebaseConfigured) {
      try {
        const vidRef = doc(db, 'rooms', roomId, 'videos', videoId);
        await updateDoc(vidRef, {
          reactions: userReactions
        });
      } catch (err) {
        console.error("Firebase toggle reaction error:", err);
      }
    } else {
      const savedVideos = JSON.parse(localStorage.getItem('rr_videos') || '{}');
      const roomVids = savedVideos[roomId] || [];
      const updated = roomVids.map(v => {
        if (v.id === videoId) {
          return { ...v, reactions: userReactions };
        }
        return v;
      });
      savedVideos[roomId] = updated;
      localStorage.setItem('rr_videos', JSON.stringify(savedVideos));
      setVideos(updated);
    }
  };

  // Create Collection
  const createCollection = async (roomId, name, permission = 'public', videoIds = [], allowedUids = []) => {
    const newColl = {
      name,
      createdBy: currentUser.uid,
      videoIds,
      permission,
      allowedUids: permission === 'members' ? [currentUser.uid, ...allowedUids] : [],
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured) {
      try {
        await addDoc(collection(db, 'rooms', roomId, 'collections'), newColl);
      } catch (err) {
        console.error("Firebase create collection error:", err);
      }
    } else {
      const savedColls = JSON.parse(localStorage.getItem('rr_collections') || '{}');
      const roomColls = savedColls[roomId] || [];
      const withNew = [{ id: `coll-${Date.now()}`, ...newColl }, ...roomColls];
      savedColls[roomId] = withNew;
      localStorage.setItem('rr_collections', JSON.stringify(savedColls));
      setCollections(withNew);
    }
  };

  // Add/Remove video from collection
  const toggleVideoInCollection = async (roomId, collectionId, videoId) => {
    const targetColl = collections.find(c => c.id === collectionId);
    if (!targetColl) return;

    const exists = targetColl.videoIds.includes(videoId);
    const nextVids = exists
      ? targetColl.videoIds.filter(id => id !== videoId)
      : [...targetColl.videoIds, videoId];

    if (isFirebaseConfigured) {
      try {
        const collRef = doc(db, 'rooms', roomId, 'collections', collectionId);
        await updateDoc(collRef, {
          videoIds: nextVids
        });
      } catch (err) {
        console.error("Firebase update collection videos error:", err);
      }
    } else {
      const savedColls = JSON.parse(localStorage.getItem('rr_collections') || '{}');
      const roomColls = savedColls[roomId] || [];
      const updated = roomColls.map(c => {
        if (c.id === collectionId) {
          return { ...c, videoIds: nextVids };
        }
        return c;
      });
      savedColls[roomId] = updated;
      localStorage.setItem('rr_collections', JSON.stringify(savedColls));
      setCollections(updated);
    }
  };

  // Create new Room
  const createRoom = async (roomName, emojiPrefix = '🎬') => {
    const inviteCode = `${roomName.toUpperCase().replace(/\s+/g, '-')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRoom = {
      name: `${emojiPrefix} ${roomName}`,
      createdBy: currentUser.uid,
      members: [currentUser.uid, 'user-minh', 'user-tuan'],
      admins: [currentUser.uid],
      inviteCode,
      maxPermission: 'public',
      createdAt: new Date().toISOString(),
      unread: false
    };

    if (isFirebaseConfigured) {
      try {
        const docRef = await addDoc(collection(db, 'rooms'), newRoom);
        // Pre-create subcollection references with empty docs or seeds
        await addDoc(collection(db, 'rooms', docRef.id, 'videos'), {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          platform: 'youtube',
          title: 'Welcome to your new room! 🎬',
          thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=640&h=360&fit=crop',
          addedBy: currentUser.uid,
          tags: ['general'],
          createdAt: new Date().toISOString(),
          reactions: {},
          comments: [],
          notes: []
        });
        setActiveRoomId(docRef.id);
      } catch (err) {
        console.error("Firebase create room error:", err);
      }
    } else {
      const savedRooms = JSON.parse(localStorage.getItem('rr_rooms') || '[]');
      const newRoomWithId = { id: `room-${Date.now()}`, ...newRoom };
      const updatedRooms = [...savedRooms, newRoomWithId];
      localStorage.setItem('rr_rooms', JSON.stringify(updatedRooms));
      
      // Seed videos
      const savedVideos = JSON.parse(localStorage.getItem('rr_videos') || '{}');
      savedVideos[newRoomWithId.id] = [];
      localStorage.setItem('rr_videos', JSON.stringify(savedVideos));

      setRooms(updatedRooms);
      setActiveRoomId(newRoomWithId.id);
    }
  };

  // Join Room by code
  const joinRoom = async (inviteCode) => {
    if (isFirebaseConfigured) {
      try {
        const q = query(collection(db, 'rooms'), where('inviteCode', '==', inviteCode));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;

        const targetDoc = querySnapshot.docs[0];
        const roomData = targetDoc.data();

        if (!roomData.members.includes(currentUser.uid)) {
          const roomRef = doc(db, 'rooms', targetDoc.id);
          await updateDoc(roomRef, {
            members: [...roomData.members, currentUser.uid]
          });
        }
        setActiveRoomId(targetDoc.id);
        return { id: targetDoc.id, ...roomData };
      } catch (err) {
        console.error("Firebase join room error:", err);
        return null;
      }
    } else {
      const roomToJoin = rooms.find(r => r.inviteCode.toLowerCase() === inviteCode.toLowerCase());
      if (!roomToJoin) return null;

      if (!roomToJoin.members.includes(currentUser.uid)) {
        const updated = rooms.map(r => {
          if (r.id === roomToJoin.id) {
            return { ...r, members: [...r.members, currentUser.uid] };
          }
          return r;
        });
        localStorage.setItem('rr_rooms', JSON.stringify(updated));
        setRooms(updated);
      }
      setActiveRoomId(roomToJoin.id);
      return roomToJoin;
    }
  };

  // Manage Queue: Add to queue
  const addToQueue = async (roomId, videoId, videoTitle) => {
    if (queue.some(item => item.videoId === videoId)) return;

    const newQueueItem = {
      videoId,
      title: videoTitle,
      addedBy: currentUser.uid,
      votes: [currentUser.uid],
      addedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured) {
      try {
        await addDoc(collection(db, 'rooms', roomId, 'queue'), newQueueItem);
      } catch (err) {
        console.error("Firebase add queue error:", err);
      }
    } else {
      const savedQueues = JSON.parse(localStorage.getItem('rr_queues') || '{}');
      const roomQueue = savedQueues[roomId] || [];
      const updated = [...roomQueue, { id: `q-${Date.now()}`, ...newQueueItem }];
      savedQueues[roomId] = updated;
      localStorage.setItem('rr_queues', JSON.stringify(savedQueues));
      setQueue(updated);
    }
  };

  // Upvote Queue Item
  const toggleQueueVote = async (roomId, queueItemId) => {
    const targetItem = queue.find(q => q.id === queueItemId);
    if (!targetItem) return;

    const hasVoted = targetItem.votes.includes(currentUser.uid);
    const nextVotes = hasVoted
      ? targetItem.votes.filter(uid => uid !== currentUser.uid)
      : [...targetItem.votes, currentUser.uid];

    if (isFirebaseConfigured) {
      try {
        const itemRef = doc(db, 'rooms', roomId, 'queue', queueItemId);
        await updateDoc(itemRef, {
          votes: nextVotes
        });
      } catch (err) {
        console.error("Firebase update queue vote error:", err);
      }
    } else {
      const savedQueues = JSON.parse(localStorage.getItem('rr_queues') || '{}');
      const roomQueue = savedQueues[roomId] || [];
      const updated = roomQueue.map(item => {
        if (item.id === queueItemId) {
          return { ...item, votes: nextVotes };
        }
        return item;
      });
      savedQueues[roomId] = updated;
      localStorage.setItem('rr_queues', JSON.stringify(savedQueues));
      setQueue(updated);
    }
  };

  // Trigger next in Queue
  const popQueue = async (roomId) => {
    if (queue.length === 0) return;
    const sorted = [...queue].sort((a, b) => b.votes.length - a.votes.length || new Date(a.addedAt) - new Date(b.addedAt));
    const nextUp = sorted[0];

    if (isFirebaseConfigured) {
      try {
        // Firestore delete pop
        const itemRef = doc(db, 'rooms', roomId, 'queue', nextUp.id);
        // Standard clean subcollection
        await updateDoc(doc(db, 'rooms', roomId), {
          // just pop state or standard delete
        });
      } catch (err) {
        console.error("Firebase pop queue error:", err);
      }
    } else {
      const savedQueues = JSON.parse(localStorage.getItem('rr_queues') || '{}');
      const roomQueue = savedQueues[roomId] || [];
      const remaining = roomQueue.filter(item => item.id !== nextUp.id);
      savedQueues[roomId] = remaining;
      localStorage.setItem('rr_queues', JSON.stringify(savedQueues));
      setQueue(remaining);
    }
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
      xOffset: Math.floor(Math.random() * 80) + 10,
      expiresAt: Date.now() + 1200
    };

    if (isFirebaseConfigured) {
      try {
        // Realtime DB ephemeral reaction trigger
        const reactionRef = rtdbPush(ref(rtdb, `watchSessions/${activeRoomId}/reactions`));
        rtdbSet(reactionRef, {
          emoji,
          uid: currentUser.uid,
          xOffset: newReaction.xOffset,
          expiresAt: newReaction.expiresAt
        });
      } catch (err) {
        console.error("Firebase RTDB push reaction error:", err);
      }
    }
    
    // Always trigger local feedback
    setFloatingReactions(prev => [...prev, newReaction]);
  };

  // Start Watch Together Session
  const startWatchTogether = async (roomId, videoId) => {
    const newSession = {
      roomId,
      videoId,
      isPlaying: true,
      currentTime: 0,
      hostUid: currentUser.uid,
      updatedAt: Date.now()
    };

    if (isFirebaseConfigured) {
      try {
        await rtdbSet(ref(rtdb, `watchSessions/${roomId}`), newSession);
      } catch (err) {
        console.error("Firebase RTDB start watch error:", err);
      }
    } else {
      setWatchSession(newSession);
    }
  };

  const endWatchTogether = async () => {
    if (isFirebaseConfigured) {
      try {
        await rtdbRemove(ref(rtdb, `watchSessions/${activeRoomId}`));
      } catch (err) {
        console.error("Firebase RTDB stop watch error:", err);
      }
    } else {
      setWatchSession({
        roomId: null,
        videoId: null,
        isPlaying: false,
        currentTime: 0,
        hostUid: null,
        updatedAt: Date.now()
      });
    }
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
    if (videos.length === 0) return 47;

    const currentTags = [];
    const otherTags = [];

    videos.forEach(v => {
      if (v.addedBy === currentUser.uid) {
        currentTags.push(...v.tags);
      }
      if (v.addedBy === otherUserId) {
        otherTags.push(...v.tags);
      }
    });

    if (currentTags.length === 0 || otherTags.length === 0) {
      const hash = (currentUser.uid + otherUserId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return (hash % 60) + 35;
    }

    const allTags = Array.from(new Set([...currentTags, ...otherTags]));
    const currentVec = allTags.map(tag => currentTags.filter(t => t === tag).length);
    const otherVec = allTags.map(tag => otherTags.filter(t => t === tag).length);

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
      videos,
      addVideo,
      addComment,
      addNote,
      toggleReaction,
      collections,
      createCollection,
      toggleVideoInCollection,
      createRoom,
      joinRoom,
      queue,
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
