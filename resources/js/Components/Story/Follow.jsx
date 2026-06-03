import React, { useState } from "react";
import {useForm,usePage, router} from '@inertiajs/react';
import axios from 'axios';
const Follow = ({ userId, isFollowing,pages =true }) => {

    const [is_following, setIsFollowing] = useState(isFollowing);
    const {data, setData, post, processing, errors} = useForm({
        following_id: userId,
    });
    const {auth} = usePage().props;
    const handleFollow = async () => {
        // if (auth.user) {
        //     await post(route('user.profile.follow'));
        //     setIsFollowing(true);
        // }else {
        //     router.visit(route("login"));
        // }
        if (auth.user) {
            try {
                await axios.post(route('user.profile.follow'),{
                    following_id: userId,
                    type: 'follow',
                });
                setIsFollowing(true);
            } catch (error) {
                console.error("Error following user:", error);
            }
        } else {
            router.visit(route("login"));
        }
    };

    const handleUnfollow = async () => {
        if (auth.user) {
            try {
                await axios.post(route('user.profile.follow'),{
                    following_id: userId,
                    type: 'unfollow',
                });
                setIsFollowing(false);
            } catch (error) {
                console.error("Error unfollowing user:", error);
            }
        } else {
            router.visit(route("login"));
        }
        // if (auth.user) {
        //     await post(route('user.profile.follow'));
        //     setIsFollowing(false);
        // }else {
        //     router.visit(route("login"));
        // }
    };

  return (
    <>
        {(pages === 'followers' || pages === 'following') && (
            <p className="unfollow-button" onClick={is_following ? handleUnfollow : handleFollow}>{is_following ? "Unfollow" : "Follow"}</p>
        )}
        {pages === 'public_profile' && (
            <div className="" onClick={is_following ? handleUnfollow : handleFollow}>
                <h5 className='btn btn-follow'>{is_following ? "Unfollow" : "Follow"}</h5>
            </div>
        )}
        {pages === 'story' && (
            <div className="os-story-card__category" onClick={is_following ? handleUnfollow : handleFollow}>
             {is_following ? "Unfollow" : "Follow"}
            </div>
        )}
    </>
  );
};

export default Follow;
