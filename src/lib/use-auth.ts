import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthState = {
  loading: boolean;
  session: Session | null;
  isStaff: boolean;
};

async function checkStaff(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "editor"]);
  return !!(data && data.length > 0);
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ loading: true, session: null, isStaff: false });

  useEffect(() => {
    let mounted = true;

    // Listener FIRST (per Supabase guidance), then read current session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session) {
        setState({ loading: false, session: null, isStaff: false });
        return;
      }
      // keep previous isStaff to avoid UI flicker while we re-check
      setState((p) => ({ loading: true, session, isStaff: p.isStaff }));
      checkStaff(session.user.id).then((isStaff) => {
        if (mounted) setState({ loading: false, session, isStaff });
      });
    });

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      const isStaff = await checkStaff(data.session?.user.id);
      if (mounted) setState({ loading: false, session: data.session, isStaff });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}

export async function signOut() {
  await supabase.auth.signOut();
}
