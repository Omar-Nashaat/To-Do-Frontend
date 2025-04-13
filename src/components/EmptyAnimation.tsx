import Lottie from 'lottie-react';
import emptyAnimation from '../assets/todos/empty.json';
import { IEmptyAnimationProps } from '../interfaces/Components';

export default function EmptyAnimation({
    title,
    description
}: IEmptyAnimationProps) {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="max-w-[500px] mx-auto">
                <Lottie animationData={emptyAnimation} loop={true} />
            </div>
            <h2 className="text-2xl font-semibold text-[#3A424A] mt-4">{title}</h2>
            <p className="text-[#969AB8] mt-2">{description}</p>
        </div>
    );
}
