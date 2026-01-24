"use client";

import { notFound } from "next/navigation";
import { useEffect, useEffectEvent } from "react";
import Link from "next/link";
import { useTopicPage } from "@/hooks/useTopic";
import { PublishForm } from "@/components/PublishTopicForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "sonner";
import { PaginationControls } from "@/components/PaginationControls";
import { TopicView } from "@/components/topics/TopicView";
import { CommentList } from "@/components/topics/CommentList";
import { DisabledCommentForm } from "@/components/topics/DisabledCommentForm";
import { useTranslations } from "next-intl";
import sanitizeHtml from "sanitize-html";

const COMMENTS_PER_PAGE = 10;

export default function TopicPageClient() {
  const t = useTranslations("topics");
  const tCategories = useTranslations("categories");
  const {
    topic,
    isLoading,
    error,
    user,
    category,
    newCommentContent,
    setNewCommentContent,
    isSubmitting,
    handlers,
    canCreateComment,
    isCheckingComment,
    addCommentImage,
    totalComments,
    currentPage,
    handlePageChange,
  } = useTopicPage();

  const checkCategory = useEffectEvent(() => {
    if (topic && category && topic.category !== category) {
      notFound();
    }
  });

  useEffect(() => {
    if (!topic) return;
    checkCategory();
    const setupSpoilers = () => {
      const spoilerBlocks = document.querySelectorAll(
        ".prose blockquote:not(.spoiler-initialized)"
      );

      spoilerBlocks.forEach((spoiler) => {
        spoiler.classList.add("spoiler-initialized");

        const originalContent = spoiler.innerHTML;

        spoiler.innerHTML = "";

        const header = document.createElement("div");
        header.className = "spoiler-header";
        header.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>Spoiler (clique para mostrar/esconder)</span>
        `;

        const content = document.createElement("div");
        content.className = "spoiler-content";
        content.innerHTML = sanitizeHtml(originalContent, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            "*": ["style", "class"],
          },
        });

        spoiler.appendChild(header);
        spoiler.appendChild(content);

        header.addEventListener("click", () => {
          spoiler.classList.toggle("spoiler-open");
        });
      });
    };

    setupSpoilers();
  }, [topic]);


  const totalPages = Math.ceil(totalComments / COMMENTS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="text-center p-10">{t("loading")}</div>
    );
  }

  if (error) {
    return notFound();
  }

  if (!topic) {
    return (
      <div className="text-center p-10">{t("topicNotFound")}</div>
    );
  }

  if (!topic || (category && topic.category !== category)) {
    return notFound();
  }

  const renderCommentBox = () => {
    if (!user) {
      return (
        <DisabledCommentForm message={t("loginToComment")} />
      );
    }
    if (isCheckingComment) {
      return (
        <DisabledCommentForm message={t("checkingPermission")} />
      );
    }
    if (canCreateComment === false) {
      return (
        <DisabledCommentForm message={t("cannotComment")} />
      );
    }
    if (canCreateComment === true) {
      return (
        <PublishForm
          type="comment"
          onSubmit={handlers.handleCommentSubmit}
          isSubmitting={isSubmitting}
          content={newCommentContent}
          setContent={setNewCommentContent}
          onImageAdd={addCommentImage}
        />
      );
    }
    return null;
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div className="min-h-screen font-sans p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="mb-4">
            <Button
            className="dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600 bg-slate-200 border-slate-100 hover:bg-slate-100"
              asChild
            >
              <Link href={`/topics/${category}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("backToCategory")}
                {tCategories.has(category) ? tCategories(category) : category.replace(/-/g, " ")}{" "}
              </Link>
            </Button>
          </div>

          <TopicView
            topic={topic}
            user={user}
            handlers={handlers}
            isSubmitting={isSubmitting}
          />

          <Separator className="bg-slate-200 dark:bg-slate-700" />

          <h2 className="text-2xl font-semibold">
            {t("comments")} ({totalComments})
          </h2>

          <CommentList topic={topic} user={user} handlers={handlers} />

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          {renderCommentBox()}
        </div>
      </div>
    </>
  );
}
