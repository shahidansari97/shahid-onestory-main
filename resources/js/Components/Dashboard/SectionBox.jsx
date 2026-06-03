export default function SectionBox({title, children}) {
    return (
        <div className="flex flex-col p-5 box box--stacked">
            {title && (
                <div className="pb-5 mb-5 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                    {title}
                </div>
            )}
            <div className='flex flex-col gap-4'>
                {children}
            </div>
        </div>
    );
}
