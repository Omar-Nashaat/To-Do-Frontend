import { MoonLoader } from 'react-spinners';
import { ILoadingScreenProps } from '../interfaces/Components';

const LoadingScreen = ({ 
  size = 60, 
  color = "#00E2AC",
  className = "min-h-screen bg-[#F8F9FD]" 
}: ILoadingScreenProps) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <MoonLoader 
        color={color} 
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LoadingScreen;
