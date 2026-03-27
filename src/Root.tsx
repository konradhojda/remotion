import { Composition } from "remotion";
import {
  ImageSlideshow,
  calculateImageSlideshowMetadata,
} from "./ImageSlideshow";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ImageSlideshow"
      component={ImageSlideshow}
      calculateMetadata={calculateImageSlideshowMetadata}
      width={1080}
      height={1920}
    />
  );
};
