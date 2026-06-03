import React, { useMemo } from "react";
import Header from "@/Components/Header.jsx";
import AudioPlayer from "@/Components/Audio/AudioPlayer.jsx";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

export default function Show({ spokenStoryRecording }) {
    const author = useMemo(() => spokenStoryRecording?.user, [spokenStoryRecording]);

    return (
        <>
            <Header />
            <div className="os-container py-10">
                <div className="mx-auto max-w-[760px] rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)] p-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200" />
                        <div className="min-w-0">
                            <div className="text-lg font-bold text-black">
                                {author?.name || "Spoken story"}
                            </div>
                            <div className="text-sm text-gray-500">
                                {author?.username ? `@${author.username}` : ""}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5">
                        {spokenStoryRecording?.url ? (
                            <AudioPlayer
                                src={spokenStoryRecording.url}
                                duration={spokenStoryRecording.duration ? parseFloat(spokenStoryRecording.duration) : null}
                                compact={false}
                            />
                        ) : (
                            <div className="text-sm text-gray-600">No audio available.</div>
                        )}
                    </div>

                    {spokenStoryRecording?.message ? (
                        <div className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-gray-700">
                            {spokenStoryRecording.message}
                        </div>
                    ) : null}

                    <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                        <IoChatbubbleEllipsesOutline />
                        <span>{spokenStoryRecording?.comments_count ?? 0}</span>
                        <span>comments</span>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                        Open the homepage to view/add comments.
                    </div>
                </div>
            </div>
        </>
    );
}

