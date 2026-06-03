import React from "react";
import { useState, useEffect, useRef } from "react";
import "../../../css/story.css";
import "../../../css/home.css";
import "../../../css/form.css";
import "../../../css/gift.css";
import "../../../css/manualVideo.css";
import "../../../css/allheighlightstory.css";

import GuestLayout from "@/Layouts/GuestLayout";
import { usePage, router, Head } from "@inertiajs/react";
import axios from "axios";
import { Upload, AlertCircle, CheckCircle, Loader } from "lucide-react";
import voiceMattersBannerImg from "../../../img/Untitled.jpg";

const STORY_CATEGORIES = [
    "All",
    "Love",
    "Substance Abuse",
    "Sexual Identity",
    "Conflict",
    "Art",
    "Loss",
    "Starting Over",
    "Compassion",
    "Conquering Fears",
    "Passion",
    "Other",
];

const TIPS = [
    "Be authentic and speak from the heart",
    "Good lighting and clear audio make a difference",
    "Keep it personal - vulnerability connects people",
    "No perfect takes needed - real is better",
];

const ManualVideo = ({ data }) => {
    const { auth } = usePage().props;
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [publishType, setPublishType] = useState("public");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(Boolean(data?.uploaded));
    const [successMessage, setSuccessMessage] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!auth?.user) {
            window.location.href = route("login");
        }
    }, [auth]);

    // Keep success screen in sync with the redirect query param.
    useEffect(() => {
        setSuccess(Boolean(data?.uploaded));
    }, [data?.uploaded]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("video/")) {
            setError("Please select a valid video file (mp4, mov, avi, etc.)");
            return;
        }

        const maxSize = 500 * 1024 * 1024;
        if (file.size > maxSize) {
            setError("Video file must be less than 500MB");
            return;
        }

        setVideoFile(file);
        setError(null);
        setVideoPreview(URL.createObjectURL(file));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer?.files?.[0];
        if (file) {
            const fakeEvent = { target: { files: [file] } };
            handleFileChange(fakeEvent);
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleUpload = async () => {
        if (!videoFile) {
            setError("Please select a video file");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append("video", videoFile);
            formData.append("publish_type", publishType);
            formData.append("userId", auth.user.id);
            if (title.trim()) formData.append("title", title.trim());
            if (description.trim()) formData.append("description", description.trim());
            const categoriesToSave = Array.from(
                new Set(["All", ...selectedCategories.filter(Boolean)])
            );
            categoriesToSave.forEach((cat) => formData.append("categories[]", cat));

            const uploadResponse = await axios.post(
                route("user.stories.manual.store"),
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    },
                }
            );

            if (uploadResponse.data.status) {
                setSuccess(true);
                setSuccessMessage(
                    uploadResponse.data.message ||
                        "Video uploaded successfully! It will be reviewed and published soon."
                );
                setVideoFile(null);
                setVideoPreview(null);
                setTitle("");
                setDescription("");
                setSelectedCategories([]);
                setUploadProgress(0);
                router.visit(route("story.manual.upload.video"), {
                    method: "get",
                    data: { uploaded: 1 },
                    replace: true,
                    preserveScroll: true,
                });
                return;
            } else {
                setError(
                    uploadResponse.data.message || "Upload failed. Please try again."
                );
            }
        } catch (err) {
            console.error("Upload error:", err);
            const status = err.response?.status;
            const responseData = err.response?.data;
            const serverMessage =
                typeof responseData === "string"
                    ? responseData
                    : responseData?.message;

            if (status === 413) {
                const serverDetails =
                    typeof responseData === "string"
                        ? responseData
                        : responseData?.message || responseData?.error;

                setError(
                    `Upload failed (413): file is too large for current server upload limits (PHP upload_max_filesize / post_max_size).${
                        serverDetails ? `\nServer: ${serverDetails}` : ""
                    }`
                );
                return;
            }

            setError(
                serverMessage ||
                    err.message ||
                    "Failed to upload video. Please try again."
            );
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const canPublish = videoFile && !loading;
    const TITLE_MAX = 100;
    const DESC_MAX = 200;
    const nonAllCategories = STORY_CATEGORIES.filter((c) => c !== "All");

    return (
        <GuestLayout addContainer={false}>
            <Head title="Share Your Story" />
            <div className="min-h-screen bg-[#f0ebf6] pb-5">
                {/* Header */}
                <div className="text-center pt-10 pb-6 px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Share Your Story
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm md:text-base">
                        Upload your video and let your authentic voice to be heard
                    </p>
                </div>

                {/* Main two-column content */}
                <div className="max-w-6xl mx-auto px-4 pb-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-900">Error</h3>
                                <p className="text-red-700 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="pt-10 pb-8 flex flex-col items-center">
                            <div className="w-full max-w-2xl text-center">
                                <div className="flex justify-center">
                                    <div className="w-12 h-12 rounded-full bg-[#8c7acb] flex items-center justify-center shadow-[0px_8px_20px_rgba(140,122,203,0.35)]">
                                        <CheckCircle className="w-7 h-7 text-white" />
                                    </div>
                                </div>

                                <h2 className="mt-5 text-4xl font-bold text-[#1f1f2b]">
                                    Got Your Story!
                                </h2>
                                <div className="mt-2 text-[#5f5f73] text-base font-medium">
                                    Thanks for sharing it
                                </div>
                                <div className="mt-3 text-[#6b6b83] text-sm leading-5">
                                    We're reviewing it now and we'll let you
                                    know when it's live.
                                </div>

                                <div className="mt-8 bg-white rounded-2xl shadow-[0px_0px_0px_rgba(0,0,0,0.04)] border border-[#eeebf7] px-8 py-7">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-[#f2f0ff] flex items-center justify-center">
                                            <span className="text-[#6f59bf] text-[11px]">
                                                ✨
                                            </span>
                                        </div>
                                        <div className="text-sm font-semibold text-[#2b2b39]">
                                            What Happens Next
                                        </div>
                                    </div>

                                    <div className="mt-7 grid grid-cols-2 gap-6">
                                        <div className="text-center">
                                            <div className="w-[56px] h-[56px] rounded-2xl bg-[#7b66c9] mx-auto flex items-center justify-center text-white font-semibold text-lg shadow-[0px_12px_25px_rgba(123,102,201,0.35)]">
                                                1
                                            </div>
                                            <div className="mt-3 font-semibold text-[#2b2b39]">
                                                Review
                                            </div>
                                            <p className="mt-2 text-[11px] text-[#7a7a90] leading-4">
                                                Our team reviews your story to ensure it meets
                                                community guidelines.
                                            </p>
                                        </div>

                                        <div className="text-center">
                                            <div className="w-[56px] h-[56px] rounded-2xl bg-[#f4c74f] mx-auto flex items-center justify-center text-[#1f1f2b] font-semibold text-lg shadow-[0px_12px_25px_rgba(244,199,79,0.35)]">
                                                2
                                            </div>
                                            <div className="mt-3 font-semibold text-[#2b2b39]">
                                                Go Live
                                            </div>
                                            <p className="mt-2 text-[11px] text-[#7a7a90] leading-4">
                                                Your story goes live and becomes available to viewers
                                                worldwide.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex justify-center">
                                        <div className="bg-[#f3f1fa] text-[11px] text-[#8a7ac3] rounded-full px-4 py-2">
                                            Usually reviewed within 24 hours
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.visit(route("trigger.video.editor"))
                                        }
                                        className="px-8 py-3 rounded-xl bg-white border border-[#eae6f7] text-[#1f1f2b] font-semibold hover:bg-[#faf8ff] transition"
                                    >
                                        Share Another Story
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {!success && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {/* Left column: Upload + Tips */}
                        <div className="space-y-6">
                            {/* Video upload card */}
                            <div className="bg-white rounded-2xl shadow-[0px_0px_20px_rgba(0,0,0,0.12)] overflow-hidden">
                                {!videoPreview ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        className="border-2 border-dashed border-gray-200 rounded-2xl p-10 md:p-12 text-center cursor-pointer hover:border-violet-300 hover:bg-violet-50/50 transition-colors"
                                    >
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#9681bd]  flex items-center justify-center ">
                                            <Upload className="w-8 h-8 text-white" />
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900 mb-1">
                                            Drop your video here
                                        </p>
                                        <p className="text-sm text-gray-500 mb-4">
                                            or click to browse
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Supports: MP4, MOV, AVI (Max 2GB)
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="relative rounded-xl overflow-hidden bg-black">
                                            <video
                                                src={videoPreview}
                                                controls
                                                className="w-full aspect-video"
                                            />
                                        </div>
                                        <div className="m-4 flex items-center justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {videoFile.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Size:{" "}
                                                    {(videoFile.size / (1024 * 1024)).toFixed(2)}MB
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setVideoFile(null);
                                                    setVideoPreview(null);
                                                    if (fileInputRef.current)
                                                        fileInputRef.current.value = "";
                                                }}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium flex-shrink-0"
                                            >
                                                Change Video
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="video/mp4,video/quicktime,video/x-msvideo,video/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={loading}
                                />
                            </div>

                            {/* Tips card */}
                            <div className="bg-[#9681bd] rounded-2xl shadow-md p-6 text-white">
                                <h3 className="text-lg font-semibold mb-4">
                                    Tips for a Great Story
                                </h3>
                                <ul className="space-y-3">
                                    {TIPS.map((tip, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                                            <span className="text-sm text-white/95">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right column: Story Details */}
                        <div className="bg-white rounded-2xl shadow-[0px_10px_20px_-10px_rgba(0,0,0,0.2)] overflow-hidden p-6 lg:p-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Story Details
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value.slice(0, TITLE_MAX))
                                        }
                                        placeholder="Give your story a compelling title..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition"
                                        maxLength={TITLE_MAX}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        {title.length}/{TITLE_MAX} characters
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(
                                                e.target.value.slice(0, DESC_MAX)
                                            )
                                        }
                                        placeholder="What's your story about? Share the context..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition resize-none"
                                        maxLength={DESC_MAX}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        {description.length}/{DESC_MAX} characters
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Story Category
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {nonAllCategories.map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedCategories((prev) => {
                                                        return prev.includes(cat)
                                                            ? prev.filter((x) => x !== cat)
                                                            : [...prev, cat];
                                                    })
                                                }
                                                className={`px-4 py-2 rounded-3xl text-sm font-medium border transition ${selectedCategories.includes(cat)
                                                        ? "border-violet-500 bg-violet-50 text-violet-700"
                                                        : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {loading && uploadProgress > 0 && (
                                <div className="mt-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-gray-700">
                                            Uploading...
                                        </span>
                                        <span className="text-gray-500">
                                            {uploadProgress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-violet-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleUpload}
                                    disabled={!canPublish}
                                    className={`w-full py-4 px-6 text-[15px] rounded-xl font-semibold flex items-center justify-center gap-2 transition ${canPublish
                                            ? "bg-violet-600 text-white hover:bg-violet-700"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Publishing...
                                        </>
                                    ) : (
                                        "Publish Your Story"
                                    )}
                                </button>
                            </div>
                        </div>
                        </div>
                    )}
                </div>

                {/* Footer banner */}
                <div className="mt-12 mx-4 mb-8 max-w-3xl mx-auto">
                    <div className="relative rounded-2xl overflow-hidden">
                        <img
                            src={voiceMattersBannerImg}
                            alt="Your Voice Matters"
                            className="w-full h-[205px] object-cover block rounded-2xl"
                        />
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
};

export default ManualVideo;
