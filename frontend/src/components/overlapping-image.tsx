import Image, { StaticImageData } from "next/image";

export interface ImageProp {
  src: string | StaticImageData;
  fit?: "cover";
}
interface OverlapProps {
  imageArray: ImageProp[];
  count?: number;
  size?: number;
}
export default function OverlappingImage({
  imageArray,
  count,
  size,
}: OverlapProps) {
  const newImageArray = count ? imageArray.slice(0, count) : imageArray;
  const remainderCount = count ? imageArray.length - count : 0;

  return (
    <div className="flex items-center">
      {newImageArray.map(({ src, fit }, i) => {
        return (
          <div
            className={`relative w-[35px] h-[35px] ${
              i !== 0 && "ml-[-15px]"
            } overflow-hidden rounded-full transition-all hover:scale-105 duration-100 cursor-pointer`}
            key={i}
            style={size ? { width: size, height: size } : {}}
          >
            <Image
              src={src}
              fill
              style={{ objectFit: fit ? fit : "contain" }}
              alt="image"
            />
          </div>
        );
      })}
      {remainderCount > 0 && (
        <p className="whitespace-nowrap text-ellipsis overflow-hidden grow shrink-[100] ml-2">
          {`+${remainderCount} more`}
        </p>
      )}
    </div>
  );
}
