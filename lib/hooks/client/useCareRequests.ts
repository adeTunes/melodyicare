import { useQuery } from "@tanstack/react-query";
import { getDocuments, getDocument, where } from "@/lib/firebase/firestore";
import { queryKeys } from "@/lib/query-keys";
import { sortByField } from "@/lib/query-helpers";
import type { CareRequest } from "@/lib/types";

export function useCareRequests(clientId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.careRequests.byClient(clientId ?? ""),
    queryFn: () =>
      getDocuments<CareRequest>(
        "careRequests",
        where("clientId", "==", clientId),
      ),
    select: (requests) =>
      [...requests].sort((a, b) => {
        const aMs = a.createdAt?.toMillis?.() ?? 0;
        const bMs = b.createdAt?.toMillis?.() ?? 0;
        return bMs - aMs;
      }),
    placeholderData: [],
    enabled: !!clientId,
  });
}

export function useCareRequest(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.careRequests.detail(id ?? ""),
    queryFn: () => getDocument<CareRequest>("careRequests", id!),
    enabled: !!id,
  });
}
