import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ForumTopicRow } from "./ForumTopicRow";
import { ForumCategoryListProps } from "@/types/post";

export function ForumCategoryList({ categories }: ForumCategoryListProps) {
  const defaultOpenCategories = categories.map((category) => category.id);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Accordion
        type="multiple"
        defaultValue={defaultOpenCategories}
        className="space-y-6"
      >
        {categories.map((category) => (
          <AccordionItem
            key={category.id}
            value={category.id}
            className="border-none rounded-md overflow-hidden shadow-md"
          >
            <AccordionTrigger
              className="bg-blue-700 px-4 py-2 text-base font-semibold hover:no-underline hover:brightness-110 w-full dark:bg-blue-550"
              aria-label={category.title || "Título da categoria"}
            >
              {category.title}
            </AccordionTrigger>
            <AccordionContent className="p-0 divide-y bg-white dark:bg-gray-800">
              {category.topics.length > 0 ? (
                category.topics.map((topic) => (
                  <ForumTopicRow key={topic.id} {...topic} />
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Nenhum tópico nesta seção.
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
