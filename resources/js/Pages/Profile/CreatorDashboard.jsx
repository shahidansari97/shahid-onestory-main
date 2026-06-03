import React from "react";
import { useState } from "react";
import "../../../css/story.css";
import "../../../css/home.css";
import "../../../css/form.css";
import "../../../css/gift.css";
import "../../../css/creator.css";
import profilecover from "./../../../img/profile-cover.jpg";
import Profile from "./../../../img/profile.jpg";
import {
    Eye,
    Video,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    Users,
    CheckCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    TrendingDown,
    Mail
} from "lucide-react";

import {
    Modal,
} from "@mui/material";
import { default as CustomModal } from "@/Components/Modal.jsx";
import ModalContent from "@/Components/Modals/ModalContent.jsx";
import GuestLayout from "@/Layouts/GuestLayout";
import CreatorDashboardLayout from "@/Layouts/CreatorDashboardLayout";
import { usePage, router, Link, Head } from "@inertiajs/react";
import Allimgstory from '@/Components/Story/Allimgstory';
import PublicStory from "@/Components/Story/PublicStory";
import useIsDesktop from "@/Hooks/useIsDesktop";
import CommentModal from "@/Components/Modals/CommentModal";
import Follow from "../../Components/Story/Follow";
import useGlobalMute from "@/Hooks/useGlobalMute";

const dataVideo = [
    {
        title: "My Journey Through Life’s Biggest Challenges",
        views: "125,430",
        earnings: "$2508.60",
        growth: "+15.2%",
        positive: true,
        date: "Jan 18, 2026",
        thumb: "https://picsum.photos/100/100?1",
    },
    {
        title: "The Truth About Social Media Influence",
        views: "98,750",
        earnings: "$1975.00",
        growth: "+8.5%",
        positive: true,
        date: "Jan 12, 2026",
        thumb: "https://picsum.photos/100/100?2",
    },
    {
        title: "How I Built My Personal Brand From Scratch",
        views: "87,320",
        earnings: "$1746.40",
        growth: "-2.3%",
        positive: false,
        date: "Jan 10, 2026",
        thumb: "https://picsum.photos/100/100?3",
    },
    {
        title: "Behind the Scenes: Creating Viral Content",
        views: "112,650",
        earnings: "$2253.00",
        growth: "+22.7%",
        positive: true,
        date: "Jan 5, 2026",
        thumb: "https://picsum.photos/100/100?4",
    },
];

const CreatorDashboard = ({ data }) => {
    // console.log("is_published",data)
    const {
        user,
        stories,
        followers,
        following,
        gifts,
        stats = {},
        balance = 0,
        totalEarnings = 0,
        thisMonthEarnings = 0,
        withdrawals: withdrawalsRaw = [],
        videoPerformance = { data: [], current_page: 1, last_page: 1 }
    } = data;

    // Normalize withdrawals: controller may send a paginator object ({ data: [...] })
    const withdrawalItems = Array.isArray(withdrawalsRaw)
        ? withdrawalsRaw
        : (withdrawalsRaw?.data ?? []);
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
    const path = window.location.pathname;
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
            <CreatorDashboardLayout addContainer={false}>
                <Head title="Creater Dashboard" />



                <div className="md:container mx-auto mt-4 mb-10">
                    <div className=" min-h-screen md:p-6 p-4">
                        {/* MAIN CONTAINER */}
                        <div className="max-w-7xl mx-auto space-y-6">

                            {/* HEADER */}
                            <div>
                                <h2 className="text-2xl font-semibold">Creator Dashboard</h2>
                                <p className="text-sm text-gray-500">
                                    Track your earnings, view, and manage your creator account
                                </p>
                            </div>

                            {/* TOP STATS */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                                {/* Total Views */}
                                <div className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Paid Views</p>
                                        <p className="font-semibold text-lg">{stats.totalViews?.toLocaleString() || 0}</p>
                                    </div>

                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100">
                                        <Eye className="text-indigo-600" size={20} />
                                    </div>
                                </div>

                                {/* Total Videos */}
                                <div className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Videos</p>
                                        <p className="font-semibold text-lg">{stats.totalVideos || 0}</p>
                                    </div>

                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100">
                                        <Video className="text-purple-600" size={20} />
                                    </div>
                                </div>

                                {/* Avg Views */}
                                <div className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Avg Views / Video</p>
                                        <p className="font-semibold text-lg">{stats.avgViewsPerVideo?.toLocaleString() || 0}</p>
                                    </div>

                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100">
                                        <Users className="text-green-600" size={20} />
                                    </div>
                                </div>

                                {/* Growth Rate */}
                                <div className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Growth Rate</p>
                                        <p className={`font-semibold text-lg ${stats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {stats.growthRate >= 0 ? '+' : ''}{stats.growthRate || 0}%
                                        </p>
                                    </div>

                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100">
                                        <TrendingUp className="text-yellow-600" size={20} />
                                    </div>
                                </div>

                            </div>

                            {/* BALANCE + HISTORY */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-6">
                                {/* Balance Card */}
                                <div className="">
                                    <div className="bg-purple-50 rounded-xl p-6 shadow-sm">
                                        {/* Header */}
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <p className="text-sm text-purple-500 font-medium">
                                                    Available Balance
                                                </p>
                                                <p className="text-3xl font-bold text-purple-700">
                                                    ${parseFloat(user.wallet_balance).toFixed(3)}
                                                </p>
                                            </div>

                                            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                                                <DollarSign className="text-purple-700" size={20} />
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-8 mt-8">
                                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                                <p className="text-xs text-purple-500">Total Earnings</p>
                                                <p className="font-bold text-purple-700">${parseFloat(totalEarnings).toFixed(3)}</p>
                                            </div>

                                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                                <p className="text-xs text-purple-500 flex items-center gap-1">This Month <TrendingUp className="text-green-600" size={10} /></p>
                                                <p className="font-bold text-purple-700">${parseFloat(thisMonthEarnings).toFixed(3)}</p>
                                            </div>
                                        </div>

                                        {/* Button - go to transactions and open cashout */}
                                        <Link
                                            href={route('user.transactions.index') + '?open=withdrawal'}
                                            className="block w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded-lg transition text-center"
                                        >
                                            Withdraw Funds
                                        </Link>
                                    </div>
                                </div>


                                {/* Withdraw History */}
                                <div className="bg-white rounded-xl p-6 shadow col-span-2">
                                    <h3 className="font-semibold mb-4 text-xl">Withdrawal History</h3>

                                    <div className="space-y-4">
                                        {withdrawalItems && withdrawalItems.length > 0 ? (
                                            withdrawalItems.map((rawWithdrawal, index) => {
                                                const withdrawal = rawWithdrawal || {};
                                                const isCompleted = withdrawal.status === 'complete';
                                                const isPending = withdrawal.status === 'pending';
                                                const acctType = withdrawal.type ?? 'N/A';
                                                const dateStr = withdrawal.date ?? withdrawal.created_at ?? withdrawal.created_at_formatted ?? '';

                                                return (
                                                    <div key={withdrawal.id || index} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-9 h-9 flex items-center justify-center rounded-full ${isCompleted ? 'bg-green-100' : 'bg-yellow-100'}`}>
                                                                {isCompleted ? (
                                                                    <CheckCircle className="text-green-600" size={18} />
                                                                ) : (
                                                                    <Clock className="text-yellow-600" size={18} />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">${withdrawal.amount}</p>
                                                                <p className="text-sm text-gray-500">{acctType}</p>
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-sm text-gray-500">{dateStr}</p>
                                                            <span className={`text-xs px-3 py-1 rounded-full ${isCompleted
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                {isCompleted ? 'Completed' : 'Pending'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <p>No withdrawal history yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>

                            {/* VIDEO PERFORMANCE TABLE - Always Visible */}
                            <div className="bg-white rounded-xl p-6 shadow video-performance-card">

                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="font-semibold text-lg">Video Performance</h3>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Only showing paid views
                                        </p>
                                    </div>
                                </div>

                                {/* SCROLL CONTAINER */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="border-b border-gray-200">
                                            <tr className="text-gray-600">
                                                <th className="text-left py-4 font-semibold">Video</th>
                                                <th className="text-center py-4 font-semibold">Paid Views</th>
                                                <th className="text-center py-4 font-semibold">Earnings</th>
                                                <th className="text-center py-4 font-semibold">Growth</th>
                                                <th className="text-center py-4 font-semibold">Upload Date</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100">
                                            {videoPerformance.data && videoPerformance.data.length > 0 ? (
                                                videoPerformance.data.map((item, index) => (
                                                    <tr key={item.id || index} className="hover:bg-gray-50/50 transition">
                                                        <td className="py-4 flex items-center gap-3">
                                                            <img
                                                                src={item.thumbnail || '/img/placeholder-video.jpg'}
                                                                alt={item.title}
                                                                className="w-12 h-12 rounded object-cover"
                                                            />
                                                            <span className="font-medium text-gray-800 truncate">
                                                                {item.title || 'Untitled Story'}
                                                            </span>
                                                        </td>

                                                        <td className="text-center">
                                                            <div className="flex items-center justify-center gap-1.5 text-blue-600 font-medium">
                                                                <Eye size={16} />
                                                                {item.views?.toLocaleString() || 0}
                                                            </div>
                                                        </td>

                                                        <td className="text-center">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span className="text-green-600 font-semibold text-lg">
                                                                    ${parseFloat(item.earnings).toFixed(3)}
                                                                </span>
                                                                {/* <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                                                                    {(item.views?.toLocaleString() || 0)} × $0.007
                                                                </span> */}
                                                            </div>
                                                        </td>

                                                        <td className="text-center">
                                                            <div className="flex items-center justify-center gap-1.5 text-gray-500">
                                                                <TrendingUp size={16} />
                                                                <span>N/A</span>
                                                            </div>
                                                        </td>

                                                        <td className="text-center text-gray-600">
                                                            {item.created_at || 'N/A'}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-12 text-gray-500">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Video size={32} className="text-gray-300" />
                                                            <p>No videos yet</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {videoPerformance.last_page > 1 && (
                                    <div className="flex justify-between items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                                        <div className="text-sm text-gray-500">
                                            Page {videoPerformance.current_page} of {videoPerformance.last_page}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    if (videoPerformance.current_page > 1) {
                                                        router.get(route('user.creator.dashboard'), {
                                                            videoPage: videoPerformance.current_page - 1
                                                        }, {
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                                disabled={videoPerformance.current_page === 1}
                                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (videoPerformance.current_page < videoPerformance.last_page) {
                                                        router.get(route('user.creator.dashboard'), {
                                                            videoPage: videoPerformance.current_page + 1
                                                        }, {
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                                disabled={videoPerformance.current_page === videoPerformance.last_page}
                                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Need Help */}
                            <div className="bg-white rounded-xl p-6 shadow">
                                {/* Header */}
                                <h3 className="font-semibold text-lg mb-1">Need Help?</h3>
                                <p className="text-sm text-gray-500 mb-5">
                                    Our support team is here to help you with any questions about the creators program
                                </p>

                                {/* Support Box */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-purple-50 rounded-xl p-6 flex flex-col items-center text-center">
                                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 mb-3">
                                            <Mail className="text-purple-600" size={22} />
                                        </div>

                                        <p className="text-sm text-gray-600 mb-3 mt-5">
                                            Send us an email and we’ll respond within 24 hours
                                        </p>
                                        <a
                                            href="mailto:yourstory@onestoryplanet.com"
                                            className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:underline"
                                        >
                                            Send Email
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </a>

                                        {/* <button className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:underline">
                                            Send Email
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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

            </CreatorDashboardLayout>
        </>
    );
};

export default CreatorDashboard;
