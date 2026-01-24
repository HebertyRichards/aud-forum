import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services";
import { handleError } from "@/utils/errorsApi";

export const useAuthQueries = () => {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: ["auth-user"],
    queryFn: authService.getSession,
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
    onError: (error) =>
      handleError(error, "Não foi possível fazer o login."),
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(["auth-user"], null);
    },
    onError: (error) =>
      handleError(error, "Não foi possível fazer o logout."),
  });

  const registerMutation = useMutation({
    mutationFn: ({
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    }) => authService.register({ username, email, password }),
    onError: (error) => handleError(error, "Erro ao criar conta."),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: ({
      newPassword,
      accessToken,
    }: {
      newPassword: string;
      accessToken?: string;
    }) => authService.updatePassword({ newPassword, accessToken }),
    onError: (error) => handleError(error, "Erro ao atualizar senha."),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onError: (error) =>
      handleError(error, "Não foi possível processar o pedido."),
  });

  return {
    sessionQuery,
    loginMutation,
    logoutMutation,
    registerMutation,
    updatePasswordMutation,
    forgotPasswordMutation,
  };
};
