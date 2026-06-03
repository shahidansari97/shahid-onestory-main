import GuestLayout from '@/Layouts/GuestLayout';
import {Head} from "@inertiajs/react";
import React from "react";

export default function Index({ title, content }) {
    return (
        <GuestLayout>
            <Head title={title} />
            <div className="os-donate">
                <div className={"os-container os-container--xl"}>
                    <div className="os-title-block os-title-block--p-lg">
                        <div className="os-title os-title--h2">{title}</div>
                    </div>
                </div>
                <div className={"os-container os-container--sm"}>
                    <div className='os-static-page' dangerouslySetInnerHTML={{ __html: content }}></div>
                </div>
            </div>
        </GuestLayout>
    );
};
