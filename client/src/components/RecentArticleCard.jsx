import { Link } from 'react-router-dom';

const RecentArticleCard = ({ cardPost }) => {
    return (
        <div className='group relative w-full border border-gray-500 dark:border-gray-600 hover:border-2 h-[350px] overflow-hidden rounded-lg sm:w-[370px] transition-all'>
            <Link to={`/post/${cardPost.slug}`}>
                <img
                    src={cardPost.image}
                    alt='post cover'
                    className='h-[180px] w-full  object-cover group-hover:h-[140px] transition-all duration-300 z-20'
                />
            </Link>
            <div className='p-3 flex flex-col gap-2'>
                <p className='text-lg font-semibold line-clamp-2'>{cardPost.title}</p>
                <span className='italic text-sm'>{cardPost.category}</span>
                <Link
                    to={`/post/${cardPost.slug}`}
                    className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
                >
                    Read article
                </Link>
            </div>
        </div>
    )
}

export default RecentArticleCard

