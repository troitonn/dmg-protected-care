import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthState = {
  loading: boolean;
  session: Session | null;
  isStaff: boolean;
};

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ loading: true, session: null, isStaff: false });

  useEffect(() => {
    let mounted = true;

    async function checkStaff(userId: string | undefined) {
      if (!userId) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .in("role", ["admin", "editor"]);
      return !!(data && data.length > 0);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setState({ loading: true, session, isStaff: false });
      checkStaff(session?.user.id).then((isStaff) => {
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
