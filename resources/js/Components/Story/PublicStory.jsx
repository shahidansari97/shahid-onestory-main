import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import Profilecard from './../../../img/profile-card.jpg';
import { usePage, Link, router } from "@inertiajs/react";
import { Modal } from "@mui/material";
import { default as NewModal } from '@/Components/Modal';
import CommentModal from "../Modals/CommentModal";
import { Trash } from 'lucide-react';
import Button from "@/Components/UI/Button.jsx";
import {useForm} from '@inertiajs/react';
// Memoized PublicStory component
const PublicStory = memo(function PublicStory({
    item,
    onOpenGiftModal,
    onOpenVideoModal,
    displayGift,
    onOpenShareModal,
    onOpenDeleteModal,
    showDelete = false,
}) {
    const { auth } = usePage().props;
    const { flash } = usePage().props;
    // console.log("Story",item);
    // console.log("auth",auth);
    const src = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    const thumbnail = item?.thumbnail ? item?.thumbnail: Profilecard
    const hiddenVideoRef = useRef(null);
    const canvasRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const [confirmingStoryDeletion, setConfirmStoryDeletion] = useState(false);

    const handleGiftClick = useCallback(() => {
        if (auth.user && displayGift) {
            onOpenGiftModal();
        } else {
            router.visit(route("login"));
        }
    }, [auth.user, displayGift, onOpenGiftModal]);
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const {
        delete: destroy,
        processing,
    } = useForm({});
    const confirmStoryDeletion = () => {
        console.log('confirmStoryDeletion');
        setConfirmStoryDeletion(true);
    };
    const deleteStory = (e) => {
        e.preventDefault();

        destroy(route('story.destroy', item.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };
    const handleOpen = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => setOpen(false), []);
    const closeModal = useCallback(() => {
        setConfirmStoryDeletion(false);
    }, []);
    return (
        <>
            {flash?.success && (
                <div className="alert alert-success">
                    {flash.success}
                </div>
            )}
            <div className="os-carousel__item">
                <img
                    src={thumbnail}
                    alt="story thumbnail"
                    className="os-story-card__img"
                />

                <p className="os-story-card__shareicon" onClick={() => onOpenShareModal(item)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </p>
                {auth?.user?.id === item?.author?.id ? (
                    <p className="os-story-card__doticon" onClick={() => setShowMenu(!showMenu)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="5" r="1.5"></circle>
                            <circle cx="12" cy="12" r="1.5"></circle>
                            <circle cx="12" cy="19" r="1.5"></circle>
                        </svg>
                        {showMenu && showDelete && (
                            <div
                                ref={menuRef}
                                style={{
                                    position: 'absolute',
                                    top: '30px',
                                    right: 0,
                                    background: '#fff',
                                    color: 'red',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                    zIndex: 999,
                                    minWidth: '100px'
                                }}
                            >
                                <div
                                    onClick={confirmStoryDeletion}
                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <Trash size={16} /> Delete
                                </div>
                            </div>
                        )}
                    </p>
                ): (
                    <p className="os-story-card__doticon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="5" r="1.5"></circle>
                            <circle cx="12" cy="12" r="1.5"></circle>
                            <circle cx="12" cy="19" r="1.5"></circle>
                        </svg>
                    </p>
                )}

                <NewModal show={confirmingStoryDeletion} onClose={closeModal} maxWidth="sm">
                    <form onSubmit={deleteStory} className="os-form">
                        <h2 className="text-lg font-medium text-gray-900">
                            Are you sure you want to delete this story?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Once your story is deleted, it will be removed permanently.
                        </p>
                        <div className="mt-6" style={{ 'width':'100%','display':'flex','justifyContent':'center', 'gap':'20px' }}>
                            <Button type="button" onClick={closeModal}>Cancel</Button>

                            <Button type="submit" className="outline">
                                Delete Story
                            </Button>
                        </div>
                    </form>
                </NewModal>

                <div className="os-story-card__content">
                    <span onClick={handleOpen}>
                        <img
                            src="/img/icons/play.svg"
                            alt="play/pause"
                            className="os-story-card__play"
                            width="60"
                            height="60"
                        />
                    </span>

                    <div className="os-story-card__content-bottom">
                        <div className="os-story-card__content-bottom-left d-block">
                            <div className="os-story-card__title">
                                <Link href={route("user.profile.index", { user_id: item.author.id })}>
                                    {item?.author?.name}
                                </Link>
                            </div>
                            {item.categories && (
                                <div className="os-story-card__categories">
                                    {item.categories
                                        .filter((category) => category !== "All")
                                        .slice(0, 1)
                                        .map((category, index) => (
                                        <div className="os-story-card__category" key={index}>{category}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal to play video */}
            <Modal className="desktopmodal" open={open} onClose={handleClose}>
                <CommentModal open={open} closeModal={handleClose} item={item} handleGiftClick={onOpenGiftModal} />
            </Modal>

            {/* Hidden elements for thumbnail generation */}
            <video
                ref={hiddenVideoRef}
                src={item?.src}
                style={{ display: 'none' }}
                crossOrigin="anonymous"
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

        </>
    );
});

export default PublicStory;
