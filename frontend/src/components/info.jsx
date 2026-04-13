

const Info = ({ title, subTitle}) => {
    return (
        <div className="flex flex-col mdd:flex-row md:flex-row md:items-center gap-2">
           <div className="mb-6">
            <h1 className="text-4xl font-semibold text-black dark:text-white">
                {title}
            </h1>
            <span className="text-sm text-gray-500">{subTitle}</span>
           </div>
        </div>
    )
}

export default Info;
   