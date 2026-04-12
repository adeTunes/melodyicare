import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getDocuments, getDocument, where } from "@/lib/firebase/firestore";
import { sortByField } from "@/lib/query-helpers";
import type { User, UserRole } from "@/lib/types";

export function useAllUsers() {
  return useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: () => getDocuments<User>("users"),
    select: sortByField<User>("createdAt", "desc"),
  });
}

export function useUsersByRole(role: UserRole) {
  return useQuery({
    queryKey: queryKeys.users.byRole(role),
    queryFn: () => getDocuments<User>("users", where("role", "==", role)),
    select: (users) =>
      [...users].sort((a, b) => {
        const aMs = a.createdAt?.toMillis?.() ?? 0;
        const bMs = b.createdAt?.toMillis?.() ?? 0;
        return bMs - aMs;
      }),
    placeholderData: [],
  });
}

export function usePendingUsers() {
  return useQuery({
    queryKey: queryKeys.users.pending(),
    queryFn: () =>
      getDocuments<User>("users", where("status", "==", "pending")),
    select: (users) =>
      [...users].sort((a, b) => {
        const aMs = a.createdAt?.toMillis?.() ?? 0;
        const bMs = b.createdAt?.toMillis?.() ?? 0;
        return bMs - aMs;
      }),
    placeholderData: [],
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(id ?? ""),
    queryFn: () => getDocument<User>("users", id!),
    enabled: !!id,
  });
}
