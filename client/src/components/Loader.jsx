import { Spinner } from 'flowbite-react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Spinner aria-label="Left-aligned spinner example" size="xl" />
        </div>
    )
}

export default Loader
