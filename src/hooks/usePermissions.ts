"use client";

import { useState, useCallback } from "react";
import {
  checkTopicCreationPermission,
  checkCommentCreationPermission,
} from "@/services/topic"; 
import { toast } from "sonner";

export function usePermissions() {
  const [canCreateTopic, setCanCreateTopic] = useState<boolean | null>(null);
  const [isCheckingTopic, setIsCheckingTopic] = useState(false);

  const [canCreateComment, setCanCreateComment] = useState<boolean | null>(null);
  const [isCheckingComment, setIsCheckingComment] = useState(false);

  const checkTopicPermission = useCallback(async (category: string) => {
    setIsCheckingTopic(true);
    try {
      const allowed = await checkTopicCreationPermission(category);
      setCanCreateTopic(allowed);
      return allowed;
    } catch {
      setCanCreateTopic(false);
      toast.error("Ocorreu um erro ao verificar sua permissão.");
      return false;
    } finally {
      setIsCheckingTopic(false);
    }
  }, []);

  const checkCommentPermission = useCallback(async (topicId: number) => {
    setIsCheckingComment(true);
    try {
      const allowed = await checkCommentCreationPermission(topicId);
      setCanCreateComment(allowed);
      return allowed;
    } catch {
      setCanCreateComment(false);
      toast.error("Ocorreu um erro ao verificar sua permissão para comentar.");
      return false;
    } finally {
      setIsCheckingComment(false);
    }
  }, [checkCommentCreationPermission]);

  return {
    canCreateTopic,
    isCheckingTopic,
    checkTopicPermission,
    canCreateComment,
    isCheckingComment,
    checkCommentPermission,
  };
}