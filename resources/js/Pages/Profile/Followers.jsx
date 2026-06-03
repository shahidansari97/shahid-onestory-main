import './../../../css/story.css';
import onlineImg from './../../../img/dot.png';
import React from 'react';
import { usePage,Head,Link } from "@inertiajs/react";
import { useState} from "react";
import GuestLayout from '@/Layouts/GuestLayout';
import Follow from '@/Components/Story/Follow';
const Followers = ({followers,userId}) => {
    // //console.log("followers",followers);
    const [searchTerm, setSearchTerm] = useState("");
    const {auth} = usePage().props;
    followers = followers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <GuestLayout>
            <Head title="Profile"/>
            <div className="following-container">
                <h5 className="following-title">Followers</h5>
                <div className="search-container">
                    <input type="text" className="search-input" placeholder="Search..." value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
                <ul className="user-list">
                    {followers.map((user, index) => (
                    <li
                        key={index}
                        className="user-item"
                    >
                        <div className="user-info">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="user-avatar"
                            />
                            {/* <img src={onlineImg} className='onlineimg'/> */}
                            <div className=''>
                                <Link href={route("user.profile.index",{user_id:user.id})}>
                                    <p>{user.name}</p>
                                </Link>
                            </div>
                        </div>
                        {/* <Follow userId={user.id} isFollowing={user.is_following} pages="followers"/> */}
                        {userId == auth?.user?.id && (
                            <Follow userId={user.id} isFollowing={user.is_following} pages="followers"/>
                        )}
                    </li>
                    ))}
                </ul>
            </div>
        </GuestLayout>
    );
};

export default Followers;
