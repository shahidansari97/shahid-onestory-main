import React from "react";
import { useState } from "react";
import "../../../css/story.css";
import "../../../css/home.css";
import "../../../css/form.css";
import "../../../css/gift.css";
import profilecover from "./../../../img/profile-cover.jpg";
import Profile from "./../../../img/profile.jpg";
import {
    Modal,
} from "@mui/material";
import { default as CustomModal } from "@/Components/Modal.jsx";
import ModalContent from "@/Components/Modals/ModalContent.jsx";
import GuestLayout from "@/Layouts/GuestLayout";
import { usePage, router, Link, Head } from "@inertiajs/react";
import Allimgstory from '@/Components/Story/Allimgstory';
import PublicStory from "@/Components/Story/PublicStory";
import useIsDesktop from "@/Hooks/useIsDesktop";
import CommentModal from "@/Components/Modals/CommentModal";
import Follow from "../../Components/Story/Follow";
import useGlobalMute from "@/Hooks/useGlobalMute";
const UserMySpace = ({ data }) => {
    // console.log("is_published",data)
    const { user, stories, followers, following, gifts } = data;
    const [open, setOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [customAmount, setCustomAmount] = useState(0.00);
    const [activeCardIndex, setActiveCardIndex] = useState(null);
    const [wallet, setWallet] = useState();
    const [error, setError] = useState(false);
    const [activeDepositCard, setActiveDepositCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refillSuccess, setRefillSuccess] = useState(false);
    const [sortOrder, setSortOrder] = useState("latest");
    const UserCoverImage = user.cover_photo ? user.cover_photo : profilecover;
    const { isGlobalMuted, toggleGlobalMute, setGlobalMute } = useGlobalMute();
    const sortedStories = [...stories].sort((a, b) => {
        if (sortOrder === "latest") {
            return new Date(b.created_at) - new Date(a.created_at);
        } else {
            return new Date(a.created_at) - new Date(b.created_at);
        }
    });
    const isMobile = useIsDesktop(992);
    // Open/Close Modal
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { auth } = usePage().props;
    const openGiftModal = () => {
        if (auth.user) {
            openModal(auth.user, "gift", user);
        } else {
            router.visit(route("login"));
        }
    };
    const handleGiftClick = (index) => {
        setActiveCardIndex(index);
    };
    const Avatar = user.avatar ? user.avatar : Profile;
        const openModal = (item, type, author) => {
        if (type === 'delete') {
            // Handle delete directly without modal
            if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
                router.delete(route('story.destroy', item), {
                    preserveScroll: true,
                    onSuccess: () => {
                        // Story will be removed from the list automatically
                    },
                    onError: (errors) => {
                        console.error('Error deleting story:', errors);
                        alert('Failed to delete story. Please try again.');
                    },
                });
            }
        } else {
            setModalData({ item, author });
            setModalType(type);
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setModalData(null);
        setModalType(null);
        setActiveCardIndex(null);
        setError(false);
        setRefillSuccess(false);
    };

    const visibility =
        auth?.user?.id === user?.id ? true : user?.visibility ? true : false;

    
    return (
        <>
            <GuestLayout addContainer={false}>
                <Head title="My Space" />
                <div className="user-profile">
                    <div className="card hovercard text-center">
                        <div className="cardMainheader">
                            <div
                                className="cardheader"
                                style={{
                                    backgroundImage: `url(${UserCoverImage})`,
                                }}
                            ></div>

                            {user.worldMessage ? (
                                <p className="cardheader-title">
                                    {user?.worldMessage}
                                </p>
                            ) : (
                                <p
                                    className="cardheader-title"
                                    style={{ visibility: `hidden` }}
                                >
                                    {user?.name}
                                </p>
                            )}
                        </div>
                        <div className="user-image">
                            <div className="avatar">
                                <img alt="" src={Avatar} />
                            </div>
                            <div className="icon-wrapper">
                                <i className="iconly-Edit icli"></i>
                            </div>
                        </div>
                        <div className="info">
                            <div className="row">
                                <div className="col-sm-12 col-lg-4 order-sm-0 order-xl-1 ">
                                    <div className="col-md-6 mx-auto">
                                        <div className="user-designation">
                                            <div className="title">
                                                <a target="_blank" href="#">
                                                    {user.name}
                                                </a>
                                            </div>
                                            <div className="desc">
                                                @{user.username}
                                            </div>
                                        </div>
                                        <div className="profile-card">
                                            <div className="stats">
                                                {auth?.user?.id === user.id ? (
                                                    <>
                                                        <Link
                                                            href={route(
                                                                "user.following",
                                                                {
                                                                    user_id:
                                                                        user.id,
                                                                }
                                                            )}
                                                        >
                                                            <div className="stat">
                                                                <h5>
                                                                    {
                                                                        following.length
                                                                    }
                                                                </h5>
                                                                <small>
                                                                    Following
                                                                </small>
                                                            </div>
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "user.followers",
                                                                {
                                                                    user_id:
                                                                        user.id,
                                                                }
                                                            )}
                                                        >
                                                            <div className="stat">
                                                                <h5>
                                                                    {
                                                                        followers.length
                                                                    }{" "}
                                                                </h5>
                                                                <small>
                                                                    Followers
                                                                </small>
                                                            </div>
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link
                                                        href={route(
                                                            "user.following",
                                                            {
                                                                user_id:user.id,
                                                            }
                                                        )}
                                                    >
                                                        <div className="stat">
                                                            <h5>
                                                                {
                                                                    following.length
                                                                }
                                                            </h5>
                                                            <small>
                                                                Following
                                                            </small>
                                                        </div>
                                                    </Link> 
                                                    <Link href={route("user.followers",{ user_id:user.id})}>          
                                                        <div className="stat">
                                                            <h5>
                                                                {
                                                                    followers.length
                                                                }{" "}
                                                            </h5>
                                                            <small>
                                                                Followers
                                                            </small>
                                                        </div>
                                                    </Link> 
                                                    </>
                                                )}
                                                <div className="stat border-0">
                                                    <h5>{stories.length}</h5>
                                                    <small>Private Stories</small>
                                                </div>
                                                {auth?.user?.id !== user.id && (
                                                    <Follow
                                                        userId={user?.id}
                                                        isFollowing={
                                                            user?.is_following
                                                        }
                                                        pages="public_profile"
                                                    />
                                                )}
                                            </div>
                                            <p>{user?.story}</p>
                                            {auth?.user?.id !== user.id && (
                                                <div className="contact-story">
                                                    <a
                                                        href={`/chatify/${user.id}`}
                                                        className="btn btn-story"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M5.5 18V17.5H5H4C3.17314 17.5 2.5 16.8269 2.5 16V8C2.5 7.17314 3.17314 6.5 4 6.5H16C16.8269 6.5 17.5 7.17314 17.5 8V16C17.5 16.8269 16.8269 17.5 16 17.5H11.277H11.1385L11.0198 17.5712L6.25777 20.4282L6.25775 20.4283L5.5 20.8829V18ZM4 7.5H3.5V8V16V16.5H4H6.5V18.234V19.1171L7.25726 18.6627L10.8615 16.5H16H16.5V16V8V7.5H16H4Z"
                                                                fill="#151617"
                                                                stroke="#151617"
                                                            ></path>
                                                            <path
                                                                d="M20 2H8C6.897 2 6 2.897 6 4H18C19.103 4 20 4.897 20 6V14C21.103 14 22 13.103 22 12V4C22 2.897 21.103 2 20 2Z"
                                                                fill="#151617"
                                                            ></path>
                                                        </svg>{" "}
                                                        Connect With Storyteller
                                                    </a>
                                                    <button
                                                        className="btn btn-story"
                                                        onClick={openGiftModal}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M12 2C10.6739 2 9.40215 2.52678 8.46447 3.46447C7.52678 4.40215 7 5.67392 7 7C7 7.275 7.225 7.5 7.5 7.5H11.5V6H9.75C9.75 5.30964 10.0596 4.75 10.75 4.75C11.4404 4.75 11.75 5.30964 11.75 6H12.25C12.25 5.30964 12.5596 4.75 13.25 4.75C13.9404 4.75 14.25 5.30964 14.25 6H12.5V7.5H16.5C16.775 7.5 17 7.275 17 7C17 5.67392 16.4732 4.40215 15.5355 3.46447C14.5978 2.52678 13.3261 2 12 2ZM9 9H2.5C2.224 9 2 9.224 2 9.5V12C2 12.8269 2.67314 13.5 3.5 13.5H9V9ZM15 13.5H20.5C21.3269 13.5 22 12.8269 22 12V9.5C22 9.224 21.776 9 21.5 9H15V13.5ZM9 15H3.5C2.67314 15 2 15.6731 2 16.5V19.5C2 20.3269 2.67314 21 3.5 21H9V15ZM15 21H20.5C21.3269 21 22 20.3269 22 19.5V16.5C22 15.6731 21.3269 15 20.5 15H15V21Z"
                                                                fill="#151617"
                                                                stroke="#151617"
                                                            />
                                                        </svg>
                                                        Gift Storyteller
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {visibility ? (
                    <>
                        {sortedStories?.length > 0 && (
                            <div className="os-container">
                                <div className="story-title">
                                    <h2>Private Stories</h2>
                                </div>
                                {/* <div className="sortby">
                                        <span>Sortby : </span>
                                        <select className="form-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} aria-label="Default select example">
                                            <option selected value="latest">Latest</option>
                                            <option value="oldest">Oldest</option>
                                        </select>
                                    </div> */}

                                <div className="sortby-container">
                                    <span className="sortby-label">
                                        Sortby:
                                    </span>
                                    <select
                                        className="form-select custom-sort-select"
                                        value={sortOrder}
                                        onChange={(e) =>
                                            setSortOrder(e.target.value)
                                        }
                                        aria-label="Default select example"
                                    >
                                        <option value="latest">Latest</option>
                                        <option value="oldest">Oldest</option>
                                    </select>
                                </div>

                                <div className={isMobile ? 'os-profile__stories-grid os-profile__stories-grid--all-stories allstoriesSec' : 'os-profile__stories-grid os-profile__stories-grid--all-stories'}>
                                    {sortedStories?.map((item) => (

                                        <Allimgstory
                                            key={item.id}
                                            item={item}
                                            displayGift={true}
                                            isGlobalMuted={isGlobalMuted}
                                            onToggleGlobalMute={toggleGlobalMute}
                                            onOpenGiftModal={() => openModal(item, "gift", item.author)}
                                            onOpenVideoModal={() => openModal(item, "video", item.author)}
                                            onOpenShareModal={() => openModal(item.id, "share")}
                                            showDelete={true}
                                            onOpenDeleteModal={() => openModal(item.id, "delete")}
                                            isUserProfilePage={true}
                                        />
                                        // <PublicStory
                                        //     item={item}
                                        //     displayGift={true}
                                        //     onOpenGiftModal={() =>
                                        //         openModal(
                                        //             item,
                                        //             "gift",
                                        //             item.author
                                        //         )
                                        //     }
                                        //     onOpenVideoModal={() =>
                                        //         openModal(
                                        //             item,
                                        //             "video",
                                        //             item.author
                                        //         )
                                        //     }
                                        //     onOpenShareModal={() =>
                                        //         openModal(item.id, "share")
                                        //     }
                                        //     showDelete={true}
                                        // />
                                    ))}
                                </div>
                            </div>
                        )}
                        {open && (
                            <Modal
                                className="desktopmodal"
                                open={open}
                                onClose={handleClose}
                            >
                                <CommentModal
                                    open={open}
                                    closeModal={handleClose}
                                    item={sharedStory}
                                    handleGiftClick={() => openModal(item, "gift", item.author)}
                                />
                            </Modal>
                        )}
                        {showModal && (
                            <CustomModal
                                show={showModal}
                                onClose={closeModal}
                                maxWidth={modalType === 'share' ? 'lg' : 'xl'}
                                className={`modal__panel${modalType === 'deposit' ? '--deposit' : modalType === 'video' ? '--video' : ''}`}
                            >
                                <ModalContent
                                    modalType={modalType}
                                    modalData={modalData}
                                    gifts={gifts}
                                    user={user}
                                    activeCardIndex={activeCardIndex}
                                    handleGiftClick={handleGiftClick}
                                    error={error}
                                    openModal={openModal}
                                    loading={loading}
                                    closeModal={closeModal}
                                    activeDepositCard={activeDepositCard}
                                    handleDepositCardClick={setActiveDepositCard}
                                    customAmount={customAmount}
                                    setCustomAmount={setCustomAmount}
                                    setLoading={setLoading}
                                    setWallet={setWallet}
                                    setError={setError}
                                    setRefillSuccess={setRefillSuccess}
                                    refillSuccess={refillSuccess}
                                />
                            </CustomModal>
                        )}
                    </>
                ) : (
                    <div
                        style={{
                            textAlign: "center",
                            fontWeight: "800",
                            fontSize: "16px",
                        }}
                    >
                        this profile is private.
                    </div>
                )}
            </GuestLayout>
        </>
    );
};

export default UserMySpace;
