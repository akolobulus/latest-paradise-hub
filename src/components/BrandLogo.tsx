import { cn } from "@/src/lib/utils";

type BrandLogoProps = {
  wrapperClassName?: string;
  imgClassName?: string;
  alt?: string;
  onClick?: () => void;
};

export default function BrandLogo({ wrapperClassName, imgClassName, alt = "Paradise Hub logo", onClick }: BrandLogoProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-center overflow-hidden",
        onClick ? "cursor-pointer" : "",
        wrapperClassName
      )}
    >
      <img src="/logo.png" alt={alt} className={cn("w-full h-full object-contain", imgClassName)} />
    </div>
  );
}
