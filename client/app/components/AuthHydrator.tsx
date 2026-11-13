import { useEffect } from "react";
import { useAppDispatch } from "~/store/hooks";
import { hydrateAuth } from "~/store/authSlice";

/** Після монтування читає token і користувача з localStorage (безпечно для SSR). */
export function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return null;
}
