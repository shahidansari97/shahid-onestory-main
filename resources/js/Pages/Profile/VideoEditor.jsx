import './../../../css/auth.css';
import './../../../css/profile.css';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import CreativeEditorSDKComponent from "@/Components/Video/CreativeEditorSDKComponent.jsx";
import ImageGenerator from "@/ImageGenerator.jsx";

export default function VideoEditor({auth}) {
    return (
        <GuestLayout user={auth.user}>
            <div className="os-profile">
                <CreativeEditorSDKComponent />
                <ImageGenerator/>
            </div>
        </GuestLayout>
    );
}
