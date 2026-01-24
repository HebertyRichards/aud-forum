import { Card, CardContent } from "@/components/ui/card";

interface DisabledCommentFormProps {
  message: string;
}

export const DisabledCommentForm = ({ message }: DisabledCommentFormProps) => (
  <Card className="dark:bg-slate-800 dark:border-slate-700/50 bg-slate-200 border-slate-100/50">
    <CardContent className="p-5 text-center text-gray-700 dark:text-gray-400">
      <p>{message}</p>
    </CardContent>
  </Card>
);
