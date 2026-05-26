import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { 
  Tv, Sparkles, Folder, ListMusic, Calendar, Search, Plus, 
  MessageSquare, Heart, Shield, Lock, Globe, Users, AlertTriangle, 
  Check, Copy, ArrowRight, X, Play, Volume2, UserCheck, Crown
} from 'lucide-react';

function Dashboard() {
  const {
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
    floatingReactions,
    sendWatchReaction,
    notifications,
    markAllNotificationsSeen,
    getTasteMatchScore,
    isFirebaseConfigured,
    handleGoogleLogin,
    handleGoogleLogout
  } = useApp();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState('feed'); // feed, collections, queue, taste, recap, search
  
  // Search query & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  
  // Floating comment drawer state per video card
  const [openDrawerId, setOpenDrawerId] = useState(null);

  // New video form fields
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  // New collection form fields
  const [collName, setCollName] = useState('');
  const [collPerm, setCollPerm] = useState('public');

  // Reveal sensitive local session state
  const [revealedVideoIds, setRevealedVideoIds] = useState([]);

  // Room details
  const activeRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

  // Comment input state per video card
  const [commentInputs, setCommentInputs] = useState({});
  // Note input state per video card
  const [noteInputs, setNoteInputs] = useState({});
  const [noteTimestamps, setNoteTimestamps] = useState({});
  const [noteIsShared, setNoteIsShared] = useState({});

  // Active notification dropdown toggle
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Auto-fill clipboard helper
  const handleCopyInvite = () => {
    navigator.clipboard.writeText(activeRoom?.inviteCode || '');
    alert('Invite code copied! Send it to your group chat.');
  };

  const handleAddVideoSubmit = (e) => {
    e.preventDefault();
    if (!videoUrl) return;
    addVideo(activeRoomId, videoUrl, videoTitle);
    setVideoUrl('');
    setVideoTitle('');
    setShowAddModal(false);
  };

  const handleCreateCollectionSubmit = (e) => {
    e.preventDefault();
    if (!collName) return;
    createCollection(activeRoomId, collName, collPerm);
    setCollName('');
    setCollPerm('public');
    setShowCollectionModal(false);
  };

  const handleSendComment = (videoId) => {
    const text = commentInputs[videoId];
    if (!text?.trim()) return;
    addComment(activeRoomId, videoId, text);
    setCommentInputs(prev => ({ ...prev, [videoId]: '' }));
  };

  const handleSendNote = (videoId) => {
    const text = noteInputs[videoId];
    if (!text?.trim()) return;
    const stamp = noteTimestamps[videoId] ? parseInt(noteTimestamps[videoId], 10) : null;
    const shared = noteIsShared[videoId] ?? true;
    addNote(activeRoomId, videoId, text, stamp, shared);
    setNoteInputs(prev => ({ ...prev, [videoId]: '' }));
    setNoteTimestamps(prev => ({ ...prev, [videoId]: '' }));
  };

  const handleReveal = (videoId) => {
    setRevealedVideoIds(prev => [...prev, videoId]);
  };

  // Filter videos by collections, tags, or search query
  const getFilteredVideos = () => {
    let result = [...videos];

    // Filter by tag
    if (selectedTag) {
      result = result.filter(v => v.tags.includes(selectedTag));
    }

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.title.toLowerCase().includes(q) || 
        v.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  };

  const filteredVideos = getFilteredVideos();

  // Unique tags list for fast filtering
  const allRoomTags = Array.from(new Set(videos.flatMap(v => v.tags)));

  // Simulated player active states
  const [playingVideoId, setPlayingVideoId] = useState(null);

  return (
    <div className="app-container">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="desktop-sidebar">
        <div className="brand-section">
          <span style={{ fontSize: '24px' }}>🎬</span>
          <span className="brand-title">reelationship</span>
        </div>

        <nav className="nav-links">
          <button 
            className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => { setActiveTab('feed'); setSelectedTag(''); }}
          >
            <Tv size={18} />
            <span>rooms feed</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'collections' ? 'active' : ''}`}
            onClick={() => setActiveTab('collections')}
          >
            <Folder size={18} />
            <span>collections</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'queue' ? 'active' : ''}`}
            onClick={() => setActiveTab('queue')}
          >
            <ListMusic size={18} />
            <span>video queue</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'taste' ? 'active' : ''}`}
            onClick={() => setActiveTab('taste')}
          >
            <Sparkles size={18} />
            <span>taste match</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'recap' ? 'active' : ''}`}
            onClick={() => setActiveTab('recap')}
          >
            <Calendar size={18} />
            <span>weekly recap</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <Search size={18} />
            <span>smart search</span>
          </button>
        </nav>

        <div className="sidebar-divider"></div>

        <div className="rooms-list-container">
          <h3 className="rooms-header">your rooms</h3>
          {rooms.map(room => (
            <div 
              key={room.id}
              className={`room-sidebar-item ${room.id === activeRoomId ? 'active' : ''}`}
              onClick={() => {
                setActiveRoomId(room.id);
                setActiveTab('feed');
              }}
            >
              <div className="room-row">
                <span className="room-title">{room.name}</span>
                {room.unread && room.id !== activeRoomId && <div className="unread-dot"></div>}
              </div>
              <span className="room-meta">{room.members.length} members · {videos.length} videos</span>
            </div>
          ))}
          
          <button 
            className="nav-item"
            style={{ marginTop: '8px', border: '1px dashed var(--gray-100)' }}
            onClick={() => setShowInviteModal(true)}
          >
            <Plus size={16} />
            <span>join or create room</span>
          </button>
        </div>

        <div className="sidebar-divider"></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px' }}>
          <Shield size={14} className="text-muted" />
          <span className="font-small">v1.0 (free tier setup)</span>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="main-wrapper">
        
        {/* TOP HEADER */}
        <header className="top-header">
          <div className="header-left">
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>
              {activeRoom?.name}
            </h2>
            <div className="avatar-stack" style={{ marginLeft: '12px' }}>
              {activeRoom?.members.slice(0, 3).map(uid => (
                <img 
                  key={uid}
                  src={MOCK_USERS[uid]?.photoURL} 
                  alt={MOCK_USERS[uid]?.displayName}
                  className="avatar-stack-member" 
                  title={MOCK_USERS[uid]?.displayName}
                />
              ))}
              {activeRoom?.members.length > 3 && (
                <div className="avatar-stack-extra">+{activeRoom.members.length - 3}</div>
              )}
            </div>
          </div>

          <div className="header-right">
            <button className="add-video-btn" onClick={() => setShowAddModal(true)}>
              <Plus size={16} />
              <span>share video</span>
            </button>

            {/* Notification bell */}
            <div className="bell-icon-wrapper" onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              markAllNotificationsSeen();
            }}>
              <span>🔔</span>
              {notifications.filter(n => !n.seen).length > 0 && (
                <div className="notif-badge">{notifications.filter(n => !n.seen).length}</div>
              )}
            </div>

            {showNotifDropdown && (
              <div className="notif-dropdown animate-slide-up">
                <div className="notif-header">
                  <span className="font-heading-3">notifications</span>
                  <button onClick={() => setShowNotifDropdown(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--gray-400)' }}>
                    no new activity. your friends have abandoned you. Or they're just busy.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`notif-item ${!n.seen ? 'unseen' : ''}`}>
                      <img src={MOCK_USERS[n.fromUid]?.photoURL} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                      <div>
                        <p style={{ fontSize: '12px' }}>{n.message}</p>
                        <span className="font-small" style={{ fontSize: '10px' }}>just now</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {isFirebaseConfigured && (
              currentUser.isGoogle ? (
                <button 
                  className="btn-secondary" 
                  style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', borderRadius: '8px' }} 
                  onClick={handleGoogleLogout}
                >
                  <span>🚪</span>
                  <span>sign out</span>
                </button>
              ) : (
                <button 
                  className="btn-primary" 
                  style={{ 
                    padding: '6px 12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    fontSize: '12px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #4285F4, #ea4335)',
                    border: 'none',
                    color: '#fff'
                  }} 
                  onClick={handleGoogleLogin}
                >
                  <span style={{ fontWeight: '800' }}>G</span>
                  <span>google login</span>
                </button>
              )
            )}

            <div className="active-identity">
              <img src={currentUser.photoURL} alt={currentUser.displayName} />
              <span className="active-identity-name">@{currentUser.username}</span>
            </div>
          </div>
        </header>

        {/* FEED INNER VIEW */}
        <main className="feed-content animate-fade-in">
          
          {/* Watch Together session banner */}
          {watchSession.roomId === activeRoomId && watchSession.videoId && (
            <div className="watch-session-banner" onClick={() => setActiveTab('feed')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="theater-sync-pulse"></span>
                <span>▶️ watch together active — {activeRoom?.members.length} watching</span>
              </div>
              <button 
                className="btn-primary" 
                style={{ padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  startWatchTogether(activeRoomId, watchSession.videoId);
                }}
              >
                <span>join theater</span>
              </button>
            </div>
          )}

          {/* TAB 1: FEED OF ROOM VIDEOS */}
          {activeTab === 'feed' && (
            <div>
              {/* Tag filtering bar */}
              {allRoomTags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  <button 
                    className={`reaction-pill ${selectedTag === '' ? 'selected' : ''}`}
                    onClick={() => setSelectedTag('')}
                  >
                    all tags
                  </button>
                  {allRoomTags.map(tag => (
                    <button 
                      key={tag}
                      className={`reaction-pill ${selectedTag === tag ? 'selected' : ''}`}
                      onClick={() => setSelectedTag(tag)}
                    >
                      🏷️ {tag}
                    </button>
                  ))}
                </div>
              )}

              {filteredVideos.length === 0 ? (
                <div className="empty-state-card animate-slide-up">
                  <div className="empty-state-icon">🎬</div>
                  <h3 className="empty-state-title">no reels yet.</h3>
                  <p className="empty-state-text">someone has to go first. (it's you.) Paste a video link from YouTube, Instagram, TikTok, or X above!</p>
                  <button 
                    className="btn-primary" 
                    style={{ marginTop: '16px' }}
                    onClick={() => setShowAddModal(true)}
                  >
                    share a reel
                  </button>
                </div>
              ) : (
                <div className="video-grid">
                  {filteredVideos.map(video => {
                    const isSensitive = video.isSensitive || video.tags.includes('sensitive');
                    const isRevealed = revealedVideoIds.includes(video.id);
                    const isPlaying = playingVideoId === video.id;

                    return (
                      <div key={video.id} className="video-card animate-slide-up">
                        
                        {/* ASPECT RATIO THUMBNAIL BOX */}
                        <div className="thumbnail-wrapper">
                          
                          {/* SENSITIVE BLUR BLANKET */}
                          {isSensitive && !isRevealed && (
                            <div className="sensitive-overlay">
                              <span style={{ fontSize: '24px' }}>⚠️</span>
                              <h4 style={{ fontWeight: '600', margin: '4px 0' }}>sensitive content</h4>
                              <p className="font-small" style={{ color: '#ccc' }}>this video is flagged as sensitive by room permissions.</p>
                              <button className="reveal-btn" onClick={() => handleReveal(video.id)}>
                                reveal content
                              </button>
                            </div>
                          )}

                          {/* VIDEO PLAYER OR THUMBNAIL COVERS */}
                          {isPlaying ? (
                            <iframe 
                              src={`https://www.youtube.com/embed/${video.url.includes('v=') ? video.url.split('v=')[1]?.split('&')[0] : 'dQw4w9WgXcQ'}?autoplay=1&mute=1`}
                              title={video.title}
                              className="player-iframe"
                              allow="autoplay; encrypted-media"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <img 
                              src={video.thumbnail} 
                              alt={video.title} 
                              className="thumbnail-image" 
                              style={{ 
                                filter: isSensitive && !isRevealed ? 'blur(14px)' : 'none',
                                transition: 'filter 300ms ease'
                              }}
                            />
                          )}

                          {/* Platform pill */}
                          <div className={`platform-badge platform-${video.platform}`}>
                            {video.platform}
                          </div>

                          {!isPlaying && (!isSensitive || isRevealed) && (
                            <button 
                              className="play-overlay-btn"
                              onClick={() => setPlayingVideoId(video.id)}
                            >
                              <Play size={20} fill="#fff" />
                            </button>
                          )}

                          {(!isSensitive || isRevealed) && (
                            <button 
                              className="watch-together-overlay-btn"
                              onClick={() => startWatchTogether(activeRoomId, video.id)}
                            >
                              <Volume2 size={12} />
                              <span>watch together</span>
                            </button>
                          )}
                        </div>

                        {/* VIDEO INFO DETAIL BOX */}
                        <div className="video-card-body">
                          <h3 className="video-card-title" title={video.title}>
                            {video.title}
                          </h3>

                          <div className="video-card-meta">
                            <img src={MOCK_USERS[video.addedBy]?.photoURL} alt="" />
                            <span>
                              shared by <strong>@{MOCK_USERS[video.addedBy]?.username}</strong> · 2h ago
                            </span>
                          </div>

                          <div className="video-tags">
                            {video.tags.map(t => (
                              <span key={t} className={`tag-chip ${t === 'sensitive' ? 'sensitive' : ''}`}>
                                #{t}
                              </span>
                            ))}
                          </div>

                          {/* REACTION BAR PILLS (with selected wiggle!) */}
                          <div className="reactions-row">
                            {['❤️', '😂', '💀', '🔥'].map(emoji => {
                              const list = Object.entries(video.reactions).filter(([_, e]) => e === emoji);
                              const count = list.length;
                              const isSelected = video.reactions[currentUser.uid] === emoji;

                              return (
                                <button 
                                  key={emoji}
                                  className={`reaction-pill ${isSelected ? 'selected reaction-wiggle' : ''}`}
                                  onClick={() => toggleReaction(activeRoomId, video.id, emoji)}
                                >
                                  <span>{emoji}</span>
                                  {count > 0 && <span>{count}</span>}
                                </button>
                              );
                            })}

                            <button 
                              className="reaction-pill"
                              style={{ backgroundColor: 'transparent', border: '1px dashed var(--gray-100)' }}
                              onClick={() => addToQueue(activeRoomId, video.id, video.title)}
                            >
                              🗳️ queue
                            </button>
                          </div>

                          {/* EXPANDABLE COMMENTS & VIDEO NOTE ANNOTATIONS */}
                          <button 
                            className="collapsible-drawer-toggle"
                            onClick={() => setOpenDrawerId(openDrawerId === video.id ? null : video.id)}
                          >
                            <span>annotations & comments ({video.comments.length + (video.notes?.length || 0)})</span>
                            <span>{openDrawerId === video.id ? '▼' : '▶'}</span>
                          </button>

                          {openDrawerId === video.id && (
                            <div className="card-drawer-content animate-slide-up">
                              
                              {/* 1. VIDEO NOTES PINNED AT SECONDS */}
                              {video.notes && video.notes.length > 0 && (
                                <div className="notes-section">
                                  <h4 className="font-micro" style={{ textTransform: 'uppercase', color: 'var(--gray-400)' }}>pinned notes</h4>
                                  {video.notes.map(note => {
                                    const isAuthor = note.uid === currentUser.uid;
                                    // Private notes check
                                    if (!note.isShared && !isAuthor) return null;

                                    return (
                                      <div key={note.id} className={`note-card ${!note.isShared ? 'private-note' : ''}`}>
                                        <div className="note-header">
                                          <span style={{ fontSize: '11px' }}>📌 note from @{MOCK_USERS[note.uid]?.username}</span>
                                          {!note.isShared && <span className="badge perm-private">🔒 private</span>}
                                        </div>
                                        <p style={{ fontSize: '12px', marginTop: '4px' }}>
                                          {note.timestampSeconds !== null && (
                                            <span 
                                              className="timestamp-badge"
                                              onClick={() => {
                                                alert(`Seeking player to ${note.timestampSeconds}s!`);
                                                setPlayingVideoId(video.id);
                                              }}
                                            >
                                              ⏱️ {Math.floor(note.timestampSeconds / 60)}:{(note.timestampSeconds % 60).toString().padStart(2, '0')}
                                            </span>
                                          )}
                                          
                                          {/* Highlight @mentions in note body */}
                                          {note.text.split(' ').map((word, i) => {
                                            if (word.startsWith('@')) {
                                              return <span key={i} className="mention-highlight">{word} </span>;
                                            }
                                            return word + ' ';
                                          })}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Note Input */}
                              <div style={{ borderTop: '1px dashed var(--gray-100)', paddingTop: '10px' }}>
                                <span className="font-micro" style={{ display: 'block', marginBottom: '4px' }}>pin a note at timestamp</span>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                  <input 
                                    type="text" 
                                    placeholder="Watch this part! omg..." 
                                    value={noteInputs[video.id] || ''}
                                    onChange={(e) => setNoteInputs({ ...noteInputs, [video.id]: e.target.value })}
                                    style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--gray-100)' }}
                                  />
                                  <input 
                                    type="number" 
                                    placeholder="secs (e.g. 32)" 
                                    value={noteTimestamps[video.id] || ''}
                                    onChange={(e) => setNoteTimestamps({ ...noteTimestamps, [video.id]: e.target.value })}
                                    style={{ width: '80px', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--gray-100)' }}
                                  />
                                  <button 
                                    className="btn-primary"
                                    style={{ padding: '4px 10px', fontSize: '11px' }}
                                    onClick={() => handleSendNote(video.id)}
                                  >
                                    pin
                                  </button>
                                </div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--gray-400)' }}>
                                  <input 
                                    type="checkbox"
                                    checked={noteIsShared[video.id] ?? true}
                                    onChange={(e) => setNoteIsShared({ ...noteIsShared, [video.id]: e.target.checked })}
                                  />
                                  <span>share with room (uncheck for private🔒)</span>
                                </label>
                              </div>

                              {/* 2. CHAT COMMENTS LIST */}
                              <div className="comments-list">
                                <h4 className="font-micro" style={{ textTransform: 'uppercase', color: 'var(--gray-400)' }}>discussion</h4>
                                {video.comments.length === 0 ? (
                                  <p className="font-small" style={{ fontStyle: 'italic', padding: '8px 0' }}>no comments yet. start the chaos.</p>
                                ) : (
                                  video.comments.map(c => (
                                    <div key={c.id} className="comment-bubble">
                                      <img src={MOCK_USERS[c.uid]?.photoURL} alt="" />
                                      <div className="comment-info-box">
                                        <span className="comment-user">@{MOCK_USERS[c.uid]?.username}</span>
                                        <span className="comment-text">{c.text}</span>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>

                              {/* Comment input */}
                              <div className="comment-input-row">
                                <input 
                                  type="text" 
                                  placeholder="write a reply..." 
                                  value={commentInputs[video.id] || ''}
                                  onChange={(e) => setCommentInputs({ ...commentInputs, [video.id]: e.target.value })}
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendComment(video.id); }}
                                />
                                <button className="comment-send-btn" onClick={() => handleSendComment(video.id)}>
                                  send
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COLLECTIONS & ACCESS CONTROLLERS */}
          {activeTab === 'collections' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 className="font-heading-1">folders & collections</h2>
                  <p className="font-small">group files in bundles and set view permissions.</p>
                </div>
                <button className="add-video-btn" onClick={() => setShowCollectionModal(true)}>
                  <Plus size={16} />
                  <span>create collection</span>
                </button>
              </div>

              {collections.length === 0 ? (
                <div className="empty-state-card animate-slide-up">
                  <div className="empty-state-icon">📁</div>
                  <h3 className="empty-state-title">no collections yet.</h3>
                  <p className="empty-state-text">your chaos is still unstructured. Bundle videos together and set custom sharing filters!</p>
                </div>
              ) : (
                <div className="collections-grid">
                  {collections.map(coll => {
                    const isPrivate = coll.permission === 'private';
                    const isCreator = coll.createdBy === currentUser.uid;
                    const canSee = !isPrivate || isCreator;
                    
                    if (!canSee) return null;

                    return (
                      <div 
                        key={coll.id} 
                        className="collection-card animate-slide-up"
                        onClick={() => {
                          alert(`Filtering feed by tags inside collection: ${coll.name}`);
                          setActiveTab('feed');
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '32px' }}>📁</span>
                          <span className={`permission-badge perm-${coll.permission}`}>
                            {coll.permission}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '15px', fontWeight: '600', marginTop: '12px' }}>
                          {coll.name}
                        </h3>
                        <span className="font-small" style={{ color: 'var(--gray-400)' }}>
                          {coll.videoIds.length} videos · by @{MOCK_USERS[coll.createdBy]?.username}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VIDEO QUEUE & DEMOCRATIC UPVOTES */}
          {activeTab === 'queue' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 className="font-heading-1">video queue</h2>
                  <p className="font-small">upvote what plays next in the shared room room!</p>
                </div>
                {queue.length > 0 && activeRoom?.admins.includes(currentUser.uid) && (
                  <button 
                    className="btn-primary" 
                    onClick={() => {
                      const nextUp = [...queue].sort((a,b) => b.votes.length - a.votes.length)[0];
                      popQueue(activeRoomId);
                      alert(`Playing next video: "${nextUp.title}"`);
                      setPlayingVideoId(nextUp.videoId);
                      setActiveTab('feed');
                    }}
                  >
                    👑 Play Next Up
                  </button>
                )}
              </div>

              {queue.length === 0 ? (
                <div className="empty-state-card animate-slide-up">
                  <div className="empty-state-icon">🗳️</div>
                  <h3 className="empty-state-title">the queue is empty.</h3>
                  <p className="empty-state-text">democracy has failed. Go to the feed and click "queue" on any video to add it here!</p>
                </div>
              ) : (
                <div className="queue-container">
                  {[...queue]
                    .sort((a, b) => b.votes.length - a.votes.length || new Date(a.addedAt) - new Date(b.addedAt))
                    .map((item, idx) => {
                      const isVoted = item.votes.includes(currentUser.uid);

                      return (
                        <div key={item.id} className="queue-item animate-slide-up">
                          <div className="queue-item-left">
                            <span className="queue-rank">#{idx + 1}</span>
                            <div>
                              <h4 style={{ fontWeight: '600' }}>{item.title}</h4>
                              <p className="font-small" style={{ fontSize: '11px' }}>added by @{MOCK_USERS[item.addedBy]?.username}</p>
                            </div>
                          </div>
                          
                          <button 
                            className={`queue-votes-btn ${isVoted ? 'voted' : ''}`}
                            onClick={() => toggleQueueVote(activeRoomId, item.id)}
                          >
                            <span>👍</span>
                            <span>{item.votes.length} upvotes</span>
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AI TASTE MATCH SCORE */}
          {activeTab === 'taste' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 className="font-heading-1">taste match meter</h2>
                <p className="font-small">scientific calculations analyzing how similar your reel diet is to your friends.</p>
              </div>

              <div className="taste-match-container">
                {Object.keys(MOCK_USERS)
                  .filter(uid => uid !== currentUser.uid)
                  .map(uid => {
                    const score = getTasteMatchScore(uid);
                    
                    // Humorous reviews matching DESIGN.md
                    let label = "y'all are in different universes 🪐";
                    if (score >= 30 && score < 60) label = "some overlap, mostly chaos 🎲";
                    else if (score >= 60 && score < 85) label = "you get each other 🤝";
                    else if (score >= 85) label = "are you the same person? 👀";

                    return (
                      <TasteMeterCard 
                        key={uid}
                        score={score}
                        label={label}
                        username={MOCK_USERS[uid].username}
                        photoURL={MOCK_USERS[uid].photoURL}
                      />
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 5: WEEKLY RECAP OF ACTIVITY */}
          {activeTab === 'recap' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 className="font-heading-1">weekly recap</h2>
                <p className="font-small">unveiling the best clips shared this week.</p>
              </div>

              {videos.length === 0 ? (
                <div className="empty-state-card animate-slide-up">
                  <div className="empty-state-icon">📅</div>
                  <h3 className="empty-state-title">nothing happened this week.</h3>
                  <p className="empty-state-text">you were either on a detox or a vacation. Either way, good for you.</p>
                </div>
              ) : (
                <div className="weekly-recap-banner animate-slide-up">
                  <div className="weekly-recap-header">
                    <span className="font-micro" style={{ textTransform: 'uppercase', color: 'var(--purple-200)' }}>weekly statistics</span>
                    <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginTop: '4px' }}>
                      recap for {activeRoom?.name}
                    </h2>
                    <p style={{ color: 'var(--purple-50)', fontSize: '13px' }}>
                      Active members this week shared {videos.length} videos gathering {videos.reduce((sum, v) => sum + Object.keys(v.reactions).length, 0)} emoji reactions.
                    </p>
                  </div>

                  <div className="weekly-recap-list">
                    <h3 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>🔥 top media clips</h3>
                    {videos.slice(0, 3).map((v, i) => (
                      <div key={v.id} className="weekly-recap-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '20px', fontWeight: '700' }}>#{i+1}</span>
                          <img src={v.thumbnail} alt="" style={{ width: '40px', height: '30px', borderRadius: '4px', objectFit: 'cover' }} />
                          <div>
                            <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>{v.title}</h4>
                            <span className="font-small" style={{ fontSize: '11px', color: 'var(--purple-200)' }}>
                              shared by @{MOCK_USERS[v.addedBy]?.username}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {Object.values(v.reactions).slice(0, 3).map((emoji, idx) => (
                            <span key={idx}>{emoji}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    className="btn-primary"
                    style={{ marginTop: '24px', backgroundColor: '#fff', color: 'var(--purple-900)' }}
                    onClick={() => {
                      navigator.clipboard.writeText(`Weekly Recap for ${activeRoom?.name}!\nTotal clips: ${videos.length}\nMost popular: "${videos[0]?.title}"`);
                      alert('Recap summary copied to clipboard! Share it in your group chat.');
                    }}
                  >
                    <span>Share Recap Plain-text</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SMART SEARCH TAB */}
          {activeTab === 'search' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 className="font-heading-1">smart search filter</h2>
                <p className="font-small">search videos by tags or keyword descriptions.</p>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                <input 
                  type="text" 
                  placeholder="type keyword e.g. carbonara, memes..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-100)', fontSize: '14px', backgroundColor: 'var(--gray-50)', color: 'var(--gray-900)' }}
                />
              </div>

              {filteredVideos.length === 0 ? (
                <div className="empty-state-card animate-slide-up">
                  <div className="empty-state-icon">🔍</div>
                  <h3 className="empty-state-title">nothing found.</h3>
                  <p className="empty-state-text">either the tag doesn't exist or you misspelled it. Probably both.</p>
                </div>
              ) : (
                <div className="video-grid">
                  {filteredVideos.map(video => (
                    <div key={video.id} className="video-card" onClick={() => { setActiveTab('feed'); setPlayingVideoId(video.id); }}>
                      <div className="thumbnail-wrapper">
                        <img src={video.thumbnail} alt="" className="thumbnail-image" />
                        <div className={`platform-badge platform-${video.platform}`}>{video.platform}</div>
                      </div>
                      <div className="video-card-body">
                        <h3 className="video-card-title">{video.title}</h3>
                        <div className="video-tags" style={{ marginTop: '8px' }}>
                          {video.tags.map(t => <span key={t} className="tag-chip">#{t}</span>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="mobile-bottom-nav">
        <button className={`mobile-nav-item ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>
          <span>🏠</span>
          <span>rooms</span>
        </button>
        <button className={`mobile-nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
          <span>🔍</span>
          <span>search</span>
        </button>
        <button className="mobile-nav-center-plus" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
        </button>
        <button className={`mobile-nav-item ${activeTab === 'queue' ? 'active' : ''}`} onClick={() => setActiveTab('queue')}>
          <span>🗳️</span>
          <span>queue</span>
        </button>
        <button className={`mobile-nav-item ${activeTab === 'taste' ? 'active' : ''}`} onClick={() => setActiveTab('taste')}>
          <span>🎯</span>
          <span>taste</span>
        </button>
      </nav>

      {/* MODAL 1: ADD VIDEO LINK */}
      {showAddModal && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            <h2 className="modal-title font-heading-2">share a new video</h2>
            
            <form onSubmit={handleAddVideoSubmit}>
              <div className="form-group">
                <label>video link</label>
                <input 
                  type="url" 
                  placeholder="paste link (YouTube, Instagram, TikTok, X)" 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label>video title (optional)</label>
                <input 
                  type="text" 
                  placeholder="leave empty to auto-extract" 
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                />
              </div>

              <div className="btn-row">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>cancel</button>
                <button type="submit" className="btn-primary">share to room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INVITE OR CREATE ROOM */}
      {showInviteModal && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowInviteModal(false)}><X size={18} /></button>
            <h2 className="modal-title font-heading-2">join or create shared space</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Join Box */}
              <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--gray-100)' }}>
                <h3 className="font-heading-3">join with invite code</h3>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="e.g. LOVE-47-REELS" 
                    id="joinCodeInput"
                    style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--gray-100)', borderRadius: '6px' }}
                  />
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      const val = document.getElementById('joinCodeInput')?.value;
                      if (!val) return;
                      const joined = joinRoom(val);
                      if (joined) {
                        alert(`Successfully joined room: ${joined.name}!`);
                        setShowInviteModal(false);
                      } else {
                        alert("this invite link has expired. Poke whoever sent it to generate a new one.");
                      }
                    }}
                  >
                    join
                  </button>
                </div>
              </div>

              {/* Create Box */}
              <div>
                <h3 className="font-heading-3">create new room</h3>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="e.g. Cursed memes" 
                    id="createRoomInput"
                    style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--gray-100)', borderRadius: '6px' }}
                  />
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      const val = document.getElementById('createRoomInput')?.value;
                      if (!val) return;
                      createRoom(val, '🍿');
                      setShowInviteModal(false);
                      alert(`Room "${val}" created! Copy active invite code from Settings to invite friends.`);
                    }}
                  >
                    create
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE COLLECTION */}
      {showCollectionModal && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowCollectionModal(false)}>
          <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowCollectionModal(false)}><X size={18} /></button>
            <h2 className="modal-title font-heading-2">create collection</h2>
            
            <form onSubmit={handleCreateCollectionSubmit}>
              <div className="form-group">
                <label>collection name</label>
                <input 
                  type="text" 
                  placeholder="e.g. late night panic 🍕" 
                  value={collName}
                  onChange={(e) => setCollName(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label>sharing permissions</label>
                <select 
                  value={collPerm}
                  onChange={(e) => setCollPerm(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="public">🌍 Public (all room members)</option>
                  <option value="members">👥 Members only (allowed list)</option>
                  <option value="private">🔒 Private (only you)</option>
                  <option value="sensitive">⚠️ Sensitive (blurred by default)</option>
                </select>
              </div>

              <div className="btn-row">
                <button type="button" className="btn-secondary" onClick={() => setShowCollectionModal(false)}>cancel</button>
                <button type="submit" className="btn-primary">create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. WATCH TOGETHER OVERLAY WINDOW (REALTIME CINEMATIC SHIFT) */}
      {watchSession.roomId === activeRoomId && watchSession.videoId && (
        <div className="watch-together-overlay animate-fade-in">
          
          <div className="theater-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="brand-title" style={{ fontSize: '18px', color: '#fff' }}>🎬 watch session</span>
              <div className="avatar-stack">
                <img src={MOCK_USERS[watchSession.hostUid]?.photoURL} alt="" style={{ border: '2px solid var(--purple-500)' }} className="avatar-stack-member" />
                <Crown size={14} style={{ color: 'gold', marginLeft: '4px' }} title="Host" />
              </div>
            </div>
            
            <div className="theater-sync-status">
              <span className="theater-sync-pulse"></span>
              <span>following @{MOCK_USERS[watchSession.hostUid]?.username}</span>
            </div>

            <button 
              onClick={endWatchTogether}
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
            >
              close theater
            </button>
          </div>

          <div className="theater-body">
            
            {/* FLOATING EPHEMERAL REACTIONS (floats up and fades out) */}
            <div className="floating-emojis-container">
              {floatingReactions.map(r => (
                <span 
                  key={r.id} 
                  className="floating-emoji"
                  style={{ left: `${r.xOffset}%` }}
                >
                  {r.emoji}
                </span>
              ))}
            </div>

            <div className="theater-player-box">
              {/* Simulated Theater player with progress controls */}
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&mute=1" 
                title="watch"
                style={{ width: '100%', height: '100%', border: 'none' }}
              ></iframe>
            </div>

          </div>

          <div className="theater-footer">
            <p className="font-small" style={{ color: '#aaa', marginBottom: '8px' }}>send reaction to active watch room</p>
            <div className="theater-emoji-pallet">
              {['🍿', '🔥', '😂', '💀', '❤️', '😱', '👍', '🤡'].map(emoji => (
                <button 
                  key={emoji} 
                  className="theater-emoji-btn"
                  onClick={() => sendWatchReaction(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* FLOATING MULTI-USER SIMULATOR SWITCHER */}
      <div className="simulator-widget animate-slide-up">
        <div className="widget-title">
          <span>👥 Multi-User Simulator</span>
          <span style={{ fontSize: '9px', backgroundColor: 'var(--purple-500)', padding: '2px 4px', borderRadius: '3px' }}>TEST MODE</span>
        </div>
        <p className="font-small" style={{ color: '#ccc', fontSize: '11px' }}>
          Click users to switch identities. Recalculate Taste Matches, verify Private Notes, and trigger active crowns instantly!
        </p>
        <div className="user-chips">
          {Object.keys(MOCK_USERS).map(uid => (
            <button 
              key={uid} 
              className={`user-chip ${currentUser.uid === uid ? 'active' : ''}`}
              onClick={() => switchUser(uid)}
            >
              <img src={MOCK_USERS[uid].photoURL} alt="" />
              <span>@{MOCK_USERS[uid].username}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

// 800MS LERP PERCENTAGE COUNT-UP COMPONENT (DESIGN.md Taste match anim!)
function TasteMeterCard({ score, label, username, photoURL }) {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800; // 800ms lerp
    const stepTime = Math.abs(Math.floor(duration / score));
    
    const timer = setInterval(() => {
      start += 1;
      setCurrentScore(start);
      if (start >= score) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Dash calculations for SVG circular progress
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="taste-match-card animate-slide-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src={photoURL} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
        <span style={{ fontWeight: '600' }}>You & @{username}</span>
      </div>

      <div className="taste-circle-wrapper">
        <svg className="taste-circle-svg">
          <circle cx="60" cy="60" r={radius} className="taste-circle-bg" />
          <circle 
            cx="60" 
            cy="60" 
            r={radius} 
            className="taste-circle-val" 
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="taste-circle-text">
          {currentScore}%
        </div>
      </div>

      <div style={{ marginTop: '8px' }}>
        <span className="font-micro" style={{ textTransform: 'uppercase', color: 'var(--purple-500)', fontWeight: '700' }}>Taste Match 🎯</span>
        <h4 className="taste-verbal-grade">{label}</h4>
      </div>
    </div>
  );
}

// ONBOARDING INJECTOR SYSTEM (First-time load wizard)
function AppContent() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('rr_onboarded');
  });

  const [onboardingStep, setOnboardingStep] = useState(1);
  const [newRoomName, setNewRoomName] = useState('');

  const handleFinishOnboarding = () => {
    localStorage.setItem('rr_onboarded', 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return (
      <div className="onboarding-overlay animate-fade-in">
        <div className="onboarding-card animate-slide-up">
          
          {onboardingStep === 1 && (
            <>
              <div className="onboarding-illustration">🍿</div>
              <h2 className="font-heading-1">what is this thing?</h2>
              <p className="font-body" style={{ color: 'var(--gray-700)' }}>
                Share reels, shorts, and videos with your people. All in one place.
              </p>
              <div className="onboarding-dots">
                <div className="onboarding-dot active"></div>
                <div className="onboarding-dot"></div>
                <div className="onboarding-dot"></div>
              </div>
              <button className="btn-primary" onClick={() => setOnboardingStep(2)}>
                <span>continue</span>
                <ArrowRight size={14} style={{ marginLeft: '4px' }} />
              </button>
            </>
          )}

          {onboardingStep === 2 && (
            <>
              <div className="onboarding-illustration">🎬</div>
              <h2 className="font-heading-1">make your first room</h2>
              <p className="font-body" style={{ color: 'var(--gray-700)' }}>
                Name it. Rooms can have an emoji prefix. Encourage chaos.
              </p>
              <input 
                type="text" 
                placeholder="e.g. Cursed memes folder" 
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--gray-100)', width: '100%', textAlign: 'center', margin: '8px 0' }}
              />
              <div className="onboarding-dots">
                <div className="onboarding-dot"></div>
                <div className="onboarding-dot active"></div>
                <div className="onboarding-dot"></div>
              </div>
              <button 
                className="btn-primary" 
                onClick={() => setOnboardingStep(3)}
                disabled={!newRoomName}
              >
                <span>create room</span>
                <ArrowRight size={14} style={{ marginLeft: '4px' }} />
              </button>
            </>
          )}

          {onboardingStep === 3 && (
            <>
              <div className="onboarding-illustration">👥</div>
              <h2 className="font-heading-1">invite someone</h2>
              <p className="font-body" style={{ color: 'var(--gray-700)' }}>
                Copy invite link. If they don't join within 10 minutes, that's between them and their conscience.
              </p>
              
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '10px 14px', 
                  borderRadius: '8px', 
                  backgroundColor: 'var(--purple-50)', 
                  border: '1px solid var(--purple-200)',
                  width: '100%',
                  margin: '8px 0'
                }}
              >
                <span className="font-micro" style={{ color: 'var(--purple-700)' }}>reelationship.app/join/LOVE-47-REELS</span>
                <Copy 
                  size={14} 
                  style={{ color: 'var(--purple-500)', cursor: 'pointer' }}
                  onClick={() => {
                    navigator.clipboard.writeText('reelationship.app/join/LOVE-47-REELS');
                    alert('Invite link copied!');
                  }}
                />
              </div>

              <div className="onboarding-dots">
                <div className="onboarding-dot"></div>
                <div className="onboarding-dot"></div>
                <div className="onboarding-dot active"></div>
              </div>
              <button className="btn-primary" onClick={handleFinishOnboarding}>
                <span>start watching</span>
              </button>
            </>
          )}

        </div>
      </div>
    );
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
