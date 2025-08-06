import Link from "next/link";
import { ForumTopicRowProps } from "@/types/post";

export function ForumTopicRow({
  icon: Icon,
  title,
  route, 
  lastPostInfo,
  author,
  authorColorClass,
  postCount,
}: ForumTopicRowProps) {
  return (
    <div className="flex items-center px-4 py-3">
      <div className="flex items-center flex-grow space-x-3">
        <Icon className="h-5 w-5 text-primary" />

        <Link href={route} passHref>
          <h3 className="text-sm font-semibold text-primary hover:underline cursor-pointer">
            {title}
          </h3>
        </Link>
      </div>
      <div className="hidden sm:flex flex-col items-end text-xs text-right mr-4">
        {lastPostInfo && (
          <p className="text-muted-foreground">{lastPostInfo}</p>
        )}
        {author && (
          <p className={`font-medium ${authorColorClass}`}>{author}</p>
        )}
      </div>
      <div className="w-16 text-right text-sm font-bold text-muted-foreground">
        {postCount}
        <span className="block text-xs font-normal uppercase text-muted-foreground">
          Posts
        </span>
      </div>
    </div>
  );
}
