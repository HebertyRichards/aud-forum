import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatLastLogin } from "@/utils/dateUtils";

// ... (as interfaces Topic, Profile, Comment permanecem as mesmas)
interface Profile {
  username: string;
  avatar_url: string;
  role: string;
}
interface Comment {
  id: number;
  content: string;
  author_id: string;
  created: string;
  profiles: Profile;
}
interface Topic {
  id: number;
  title: string;
  content: string;
  author_id: string;
  category: string;
  slug: string;
  created: string;
  profiles: Profile;
  comentarios: Comment[];
}

async function getTopicBySlug(slug: string): Promise<Topic | any> {
  // ...
}

export default async function TopicPage({
  params,
}: {
  params: { slug: string };
}) {
  const topic = await getTopicBySlug(params.slug);

  if (!topic) {
    notFound();
  }

  return (
    <div className="min-h-screen text-gray-300 font-sans p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border-gray-700 bg-gray-800/50 text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{topic.title}</CardTitle>
            <div className="flex items-center gap-3 text-sm text-gray-400 pt-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={topic.profiles.avatar_url}
                  alt={topic.profiles.username}
                />
                <AvatarFallback>
                  {topic.profiles.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>
                Postado por{" "}
                <strong className="text-blue-400">
                  {topic.profiles.username}
                </strong>
              </span>
              <span>•</span>
              {/* ATUALIZADO: Usando sua função de formatação */}
              <time dateTime={topic.created}>
                {formatLastLogin(topic.created)}
              </time>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">{topic.content}</div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">
            Comentários ({topic.comentarios.length})
          </h2>
          {topic.comentarios.length > 0 ? (
            topic.comentarios.map((comment: Comment) => (
              <Card
                key={comment.id}
                className="border-gray-700 bg-gray-800/40 text-gray-300"
              >
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={comment.profiles.avatar_url}
                      alt={comment.profiles.username}
                    />
                    <AvatarFallback>
                      {comment.profiles.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="font-semibold text-blue-400">
                        {comment.profiles.username}
                      </p>
                      {/* ATUALIZADO: Usando sua função de formatação */}
                      <time
                        dateTime={comment.created}
                        className="text-xs text-gray-500"
                      >
                        {formatLastLogin(comment.created)}
                      </time>
                    </div>
                    <p className="mt-1">{comment.content}</p>
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              Nenhum comentário ainda. Seja o primeiro a responder!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
