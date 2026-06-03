import GuestLayout from '@/Layouts/GuestLayout';
import {Head} from "@inertiajs/react";
import React from "react";

export default function Index({ title, content }) {
    return (
        <GuestLayout>
            <Head title="Do not sale or share my Info" />
            <div className="os-donate">
                <div className={"os-container os-container--xl"}>
                    <div className="os-title-block os-title-block--p-lg">
                        <div className="os-title os-title--h2">Share Information</div>
                    </div>
                </div>
                <div className={"os-container os-container--sm"}>
                    <div className='os-static-page'>
                        <p>
                            Under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA), California residents have the right to opt out of the sale or sharing of their personal information.
                        </p>
                        <p> 
                            OneStoryPlanet does not sell personal information for monetary value, but we may use certain data for analytics, personalization, or advertising technologies that could be considered a “sale” or “sharing” under California law. You have the right to opt out of this.
                        </p>
                        <p>
                            Contact us at <b><a href={`mailto:friends@onestoryplanet.com`} style={{ textDecoration: "none" }} >friends@onestoryplanet.com</a>.</b> After processing, we will no longer sell or share your personal information unless you opt back in.
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
};
