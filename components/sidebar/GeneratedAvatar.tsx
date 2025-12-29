import { botttsNeutral, initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  variant?: "botttsneutral" | "initials";
}

export const GeneratedAvatar = ({
  seed,
  className,
  variant = "botttsneutral",
}: GeneratedAvatarProps) => {
  const avatar = createAvatar(
    variant === "botttsneutral" ? botttsNeutral : initials,
    {
      seed,
      size: 64,
    },
  );

  return (
    <Avatar className={cn("h-16 w-16", className)}>
      <AvatarImage src={avatar.toDataUri()} alt={seed} />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
