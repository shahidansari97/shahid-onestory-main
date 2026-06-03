import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Alert} from "@/Components/Dashboard/Form.jsx";

const StoryItem = ({ story, index, moveStory, onClick }) => {
    const [{ isDragging }, drag] = useDrag({
        type: "story",
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: "story",
        hover: (item) => {
            if (item.index !== index) {
                moveStory(item.index, index);
                item.index = index;
            }
        },
    });

    return (
        <div
            ref={(node) => {
                if (moveStory) {
                    drop(node);
                }
                drag(node);
            }}
            className={'col-span-6 sm:col-span-4 md:col-span-2 xl:col-span-2'}
            onClick={onClick}
        >
            <div
                className='class="relative px-3 pt-5 pb-5 rounded-[0.6rem] bg-slate-100 border border-slate-200/80 hover:bg-slate-50 cursor-pointer transition sm:px-5 shadow-sm dark:hover:bg-darkmode-400"'>
                <div className="w-full mx-auto">
                    <div
                        className="relative block bg-center bg-no-repeat bg-contain before:content-[''] before:pt-[100%] before:w-full before:block">
                        <div className="absolute top-0 left-0 w-full h-full image-fit">
                            <img src={story.thumbnail} alt={story.name}
                                 className="rounded-md"/>
                        </div>
                    </div>
                </div>

                <span className="block mt-4 font-medium text-center capitalize truncate">{story.name}</span>
            </div>
        </div>
    );
};

const VideoEditor = ({ auth, availableStories: initialAvailableStories, selectedStories: initialSelectedStories }) => {
    const [availableStories, setAvailableStories] = useState(initialAvailableStories || []);
    const [selectedStories, setSelectedStories] = useState(initialSelectedStories || []);
    const [message, setMessage] = useState('');

    const moveStoryToSelected = (index) => {
        const updatedAvailable = [...availableStories];
        const [movedStory] = updatedAvailable.splice(index, 1);
        if (movedStory) {
            setAvailableStories(updatedAvailable);
            setSelectedStories((prev) => [...prev, movedStory]);
        }
    };

    const moveStoryToAvailable = (index) => {
        const updatedSelected = [...selectedStories];
        const [movedStory] = updatedSelected.splice(index, 1);
        if (movedStory) {
            setSelectedStories(updatedSelected);
            setAvailableStories((prev) => [...prev, movedStory]);
        }
    };

    const moveStory = (fromIndex, toIndex) => {
        const updatedSelected = [...selectedStories];
        const [movedStory] = updatedSelected.splice(fromIndex, 1);
        updatedSelected.splice(toIndex, 0, movedStory);
        setSelectedStories(updatedSelected);
    };

    const saveOrder = async () => {
        if (selectedStories.length === 0) {
            console.warn("No selected stories to save.");
            return;
        }

        const storyIds = selectedStories.map(story => story.id);
        try {
            await axios.post(route('homepage.stories-editor.update-order'), { storyIds });
            setMessage('Order saved successfully!');
        } catch (error) {
            console.error("Failed to save order:", error.response?.data || error.message);
            setMessage("Failed to save order! Please try again.");
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <div className="flex flex-col gap-y-3 w-full">
                <DndProvider backend={HTML5Backend}>
                    <div className="flex flex-col gap-10 rounded-lg  w-full">
                        <div className="flex flex-col p-5 box box--stacked">
                            <div>
                                <div
                                    className="flex flex-col sm:items-center pb-5 mb-5 border-b border-dashed sm:flex-row border-slate-300/70">
                                    <div className="text-[0.94rem] font-medium">Selected Stories</div>
                                </div>
                                <div>
                                    <p className="leading-relaxed">In this section, you can view the stories you've selected. Click on a story to move it back to the "Available Stories" section.</p>
                                    <p className="leading-relaxed">To change the order of the selected stories, simply drag and drop them into your desired position.</p>
                                    <div className="border border-dashed rounded-[0.6rem] dark:border-darkmode-400 relative mt-7 mb-4 border-slate-200/80">
                                        <div className="absolute left-0 px-3 ml-4 -mt-2 text-xs uppercase bg-white text-slate-500 dark:bg-darkmode-600">
                                            <div className="-mt-px">Stories</div>
                                        </div>
                                        <div className="grid grid-cols-12 gap-3 sm:gap-3.5 px-6 py-6 ">
                                            {selectedStories.map((story, index) => (
                                                story ? (
                                                    <StoryItem
                                                        key={story.id}
                                                        index={index}
                                                        story={story}
                                                        moveStory={moveStory}
                                                        onClick={() => moveStoryToAvailable(index)}
                                                    />
                                                ) : null
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    {message && (
                                        <Alert>
                                            {message}
                                        </Alert>
                                    )}
                                    <button
                                        onClick={saveOrder}
                                        className="transition duration-200 border shadow-sm inline-flex items-center justify-center py-2 px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&amp;:hover:not(:disabled)]:bg-opacity-90 [&amp;:hover:not(:disabled)]:border-opacity-90 [&amp;:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed bg-primary border-primary text-white dark:border-primary w-24 whitespace-nowrap"
                                    >
                                        Save Order
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-5 box box--stacked">
                            <div>
                                <div
                                    className="flex flex-col sm:items-center pb-5 mb-5 border-b border-dashed sm:flex-row border-slate-300/70">
                                    <div className="text-[0.94rem] font-medium">Available Stories</div>
                                </div>
                                <div>
                                    <div>
                                        <p className="leading-relaxed">In this section, you'll also find stories that haven't been selected yet. Click on a story here to add it to your selected list.</p>
                                        <div className="border border-dashed rounded-[0.6rem] dark:border-darkmode-400 relative mt-7 mb-4 border-slate-200/80">
                                            <div className="absolute left-0 px-3 ml-4 -mt-2 text-xs uppercase bg-white text-slate-500 dark:bg-darkmode-600">
                                                <div className="-mt-px">Stories</div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-3 sm:gap-3.5 px-6 py-6 ">
                                                {availableStories.map((story, index) => (
                                                    story ? (
                                                        <StoryItem
                                                            key={story.id}
                                                            index={index}
                                                            story={story}
                                                            onClick={() => moveStoryToSelected(index)}
                                                        />
                                                    ) : null
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DndProvider>
            </div>
        </AuthenticatedLayout>
    );
};

export default VideoEditor;
