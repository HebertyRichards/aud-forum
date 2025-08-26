
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";




export default async function TopicPage(){
  return (
    <>
    <div className="min-h-screen text-gray-300 font-sans p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border-gray-700 bg-gray-800/50 text-white">
          <CardHeader>
            <div className="flex items-center gap-3 text-sm text-gray-400 pt-2">
              <Avatar className="h-8 w-8">
                <AvatarImage

                />
                <AvatarFallback>

                </AvatarFallback>
              </Avatar>
              <span>
                Postado por{" "}
                <strong className="text-blue-400">

                </strong>
              </span>
              <span>•</span>


            </div>
          </CardHeader>
          <CardContent>

          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">

          </h2>
        </div>
      </div>
    </div>
    </>
  );
}
