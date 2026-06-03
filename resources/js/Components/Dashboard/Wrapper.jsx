import {Alert} from "@/Components/Dashboard/Form.jsx";
import {Head} from "@inertiajs/react";

const Wrapper = ({ title, message, children }) => {
    return (
        <>
            <Head title={title}/>
            <div className="flex items-center h-10">
                <div className="text-lg font-medium group-[.mode--light]:text-white">
                    {title}
                </div>
            </div>
            {message && (
                <Alert>
                    {message}
                </Alert>
            )}
            <div className="relative flex flex-col col-span-12 gap-y-7 lg:col-span-9 xl:col-span-8">
                {children}
            </div>
        </>
    );
};

export default Wrapper;
