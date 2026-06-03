import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import axios from 'axios';
import "../../../css/story.css";
import "../../../css/home.css";
import "../../../css/form.css";
import "../../../css/gift.css";
import "../../../css/recordings-page.css";
import profilecover from "./../../../img/profile-cover.jpg";
import ProfileImg from "./../../../img/profile.jpg";

// ── Individual recording card (portrait phone-card style) ─────────────────────
function RecordingCard({ recording }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted]     = useState(false);

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const formatDuration = (s) => {
        if (!s || isNaN(s)) return '0:00';
        return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    };

    const togglePlay = (e) => {
        e.stopPropagation();
        const a = audioRef.current;
        if (!a) return;
        if (isPlaying) { a.pause(); setIsPlaying(false); }
        else { a.play().then(() => setIsPlaying(true)).catch(() => {}); }
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        const a = audioRef.current;
        if (!a) return;
        a.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const bars = [20, 36, 54, 70, 54, 36, 20];
    const gradients = [
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    ];
    const gradientIndex = Number(recording?.id || 0) % gradients.length;
    const cardGradient = gradients[gradientIndex];

    return (
        <div className="os-carousel__item video-wrapper" style={{ cursor: 'pointer', flexShrink: 0 }}>
            <audio ref={audioRef} src={recording.url} onEnded={() => setIsPlaying(false)} preload="none" />

            {/* Gradient background */}
            <div style={{
                position: 'absolute', inset: 0,
                background: cardGradient,
            }} />

            {/* Animated waveform bars */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
                {bars.map((h, i) => (
                    <div
                        key={i}
                        className={isPlaying ? 'rec-bar rec-bar--playing' : 'rec-bar'}
                        style={{ animationDelay: `${i * 0.12}s`, height: h }}
                    />
                ))}
            </div>

            {/* Ghost mic icon */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none',
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"
                    fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                </svg>
            </div>

            {/* Story-card overlay */}
            <div className="os-story-card__content" style={{ position: 'absolute', inset: 0, zIndex: 10 }}>

                {/* Mute / unmute — top-right (always visible) */}
                <div className="os-story-card__sound" style={{ opacity: 1 }} onClick={toggleMute}>
                    {isMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" viewBox="0 0 24 24">
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" viewBox="0 0 24 24">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                    )}
                </div>

                {/* Play / pause — always centred */}
                <div className="os-story-card__play" style={{ opacity: 1 }} onClick={togglePlay}>
                    {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="white">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="white">
                            <path d="m8 5 11 7-11 7V5z"/>
                        </svg>
                    )}
                </div>

                {/* Date / duration / badge at bottom */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)',
                    padding: '32px 12px 12px',
                    color: 'white',
                    zIndex: 20,
                }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{formatDate(recording.created_at)}</div>
                    <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>{formatDuration(recording.duration)}</div>
                    <span style={{
                        display: 'inline-block', marginTop: 5,
                        fontSize: 9, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em',
                        padding: '2px 6px', borderRadius: 4,
                        background: recording.publish_type === 'public'
                            ? 'rgba(22,163,74,0.8)' : 'rgba(161,98,7,0.8)',
                    }}>
                        {recording.publish_type}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RecordingsIndex() {
    const {
        recordings: initialRecordings,
        currentPage: initialPage,
        lastPage,
        total,
        userProfile,
    } = usePage().props;

    const [recordings, setRecordings] = useState(initialRecordings || []);
    const [page, setPage]             = useState(initialPage || 1);
    const [hasMore, setHasMore]       = useState((initialPage || 1) < (lastPage || 1));
    const [loading, setLoading]       = useState(false);
    const loaderRef = useRef(null);
    const observerRef = useRef(null);

    const coverPhoto = userProfile?.cover_photo || profilecover;
    const avatar     = userProfile?.avatar      || ProfileImg;

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const nextPage = page + 1;
            const response = await axios.get(route('user.recordings.more'), { params: { page: nextPage } });
            const { recordings: more, currentPage: cp, lastPage: lp } = response.data;
            setRecordings(prev => [...prev, ...more]);
            setPage(cp);
            setHasMore(cp < lp);
        } catch (e) {
            console.error('Error loading more recordings:', e);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page]);

    useEffect(() => {
        const el = loaderRef.current;
        if (!el) return;
        observerRef.current = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) loadMore(); },
            { threshold: 0.1 }
        );
        observerRef.current.observe(el);
        return () => { if (observerRef.current) observerRef.current.disconnect(); };
    }, [loadMore]);

    return (
        <GuestLayout addContainer={false}>
            <Head title="My Recordings" />

            {/* ── Profile header — identical to UserMySpace ── */}
            <div className="user-profile">
                <div className="card hovercard text-center">
                    <div className="cardMainheader">
                        <div className="cardheader" style={{ backgroundImage: `url(${coverPhoto})` }} />
                        {userProfile?.world_message ? (
                            <p className="cardheader-title" style={{ visibility: 'hidden' }}>{userProfile.world_message}</p>
                        ) : (
                            <p className="cardheader-title" style={{ visibility: 'hidden' }}>
                                {userProfile?.name}
                            </p>
                        )}
                    </div>

                    <div className="user-image">
                        <div className="avatar">
                            <img alt="" src={avatar} />
                        </div>
                    </div>

                    <div className="info">
                        <div className="row">
                            <div className="col-sm-12 col-lg-4 order-sm-0 order-xl-1">
                                <div className="col-md-6x mx-auto">
                                    <div className="user-designation">
                                        <div className="title"><a>{userProfile?.name}</a></div>
                                        <div className="desc">@{userProfile?.username}</div>
                                    </div>
                                    {/* <div className="profile-card">
                                        <div className="stats">
                                            <div className="stat">
                                                <h5>{userProfile?.following ?? 0}</h5>
                                                <small>Following</small>
                                            </div>
                                            <div className="stat">
                                                <h5>{userProfile?.followers ?? 0}</h5>
                                                <small>Followers</small>
                                            </div>
                                            <div className="stat border-0">
                                                <h5>{total ?? 0}</h5>
                                                <small>Recordings</small>
                                            </div>
                                        </div>
                                        {userProfile?.story && <p>{userProfile.story}</p>}
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Recordings grid ── */}
            {recordings.length === 0 ? (
                <div className="os-container" style={{ textAlign: 'center', padding: '5rem 1rem', color: '#9ca3af' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none"
                        viewBox="0 0 24 24" stroke="#d1d5db" strokeWidth="1.5"
                        style={{ margin: '0 auto 1rem', display: 'block' }}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                        <line strokeLinecap="round" x1="12" y1="19" x2="12" y2="22"/>
                    </svg>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>
                        No recordings yet
                    </p>
                    <p style={{ fontSize: '0.875rem' }}>Your audio recordings will appear here.</p>
                </div>
            ) : (
                <div className="os-container">
                    <div className="story-title">
                        <h2>My Recordings</h2>
                    </div>
                    <div className="os-profile__stories-grid os-profile__stories-grid--all-stories recordings-cards-size">
                        {recordings.map(r => (
                            <RecordingCard key={r.id} recording={r} />
                        ))}
                    </div>
                </div>
            )}

            {/* Infinite-scroll sentinel */}
            <div ref={loaderRef} style={{ height: 1 }} />
            {loading && (
                <div className="recordings-loader">
                    <div className="recordings-loader__spinner" />
                    <span>Loading more…</span>
                </div>
            )}
            {!hasMore && recordings.length > 0 && !loading && (
                <div className="recordings-loader">
                    {/* <span>All recordings loaded</span> */}
                </div>
            )}
        </GuestLayout>
    );
}
