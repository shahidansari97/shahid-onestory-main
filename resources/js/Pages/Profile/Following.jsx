import './../../../css/story.css';
import onlineImg from './../../../img/dot.png';
import React from 'react';
import { useState } from 'react';
import { usePage, Head, Link } from "@inertiajs/react";
import GuestLayout from '@/Layouts/GuestLayout';
import Follow from '@/Components/Story/Follow';
const Following = ({following,userId}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const {auth} = usePage().props;
    following = following.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
    <GuestLayout>
        <Head title="Following"/>
        <div className="following-container">
            <h5 className="following-title">Following</h5>
            <div className="search-container">
                <input type="text" className="search-input" placeholder="Search..." value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}/>
            </div> 
            <ul className="user-list">
                {following.map((user, index) => (
                    <li key={index} className="user-item">
                        <div className="user-info">
                            <img src={user.avatar} alt={user.name} className="user-avatar"/>
                            {/* <img src={onlineImg} className='onlineimg'/> */}
                            <div className=''>
                                <Link href={route("user.profile.index",{user_id:user.id})}>
                                    <p>{user.name}</p>
                                </Link>
                            </div>
                        </div>
                        {userId == auth?.user?.id && (
                            <Follow userId={user.id} isFollowing={user.is_following} pages="following"/>
                        )}
                        {/* <Follow userId={user.id} isFollowing={user.is_following} pages="following"/> */}
                    </li>
                ))}
            </ul>
        </div>
    </GuestLayout>
  );
};

export default Following;
