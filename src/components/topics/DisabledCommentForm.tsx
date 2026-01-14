import { Card, CardContent } from "@/components/ui/card";

interface DisabledCommentFormProps {
  message: string;
}

export const DisabledCommentForm = ({ message }: DisabledCommentFormProps) => (
  <Card className="bg-slate-800 border-slate-700/50">
    <CardContent className="p-5 text-center text-gray-400">
      <p>{message}</p>
    </CardContent>
  </Card>
);
