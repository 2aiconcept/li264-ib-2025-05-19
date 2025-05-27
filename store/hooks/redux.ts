// src/hooks/redux.ts
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

import type { RootState, AppDispatch } from "../index";

// Hooks typés simplement
export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector = useSelector<RootState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
