import { cn } from "@/src/lib/utils";

type BrandLogoProps = {
  wrapperClassName?: string;
  imgClassName?: string;
  alt?: string;
};

export default function BrandLogo({ wrapperClassName, imgClassName, alt = "Paradise Hub logo" }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center justify-center overflow-hidden", wrapperClassName)}>
      <img src="/logo.png" alt={alt} className={cn("w-full h-full object-contain", imgClassName)} />
    </div>
  );
}
